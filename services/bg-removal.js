import { env, AutoModel, AutoProcessor, RawImage } from '@xenova/transformers';
import { logError } from './logger';
import Jimp from 'jimp';
import os from 'os';
import path from 'path';

// Fix for serverless environments (e.g. Vercel) which have read-only filesystems.
// /tmp is the only writable directory. We disable local models to force remote fetching 
// and caching in the temporary folder.
// adaptive configuration for hosting.
// Allow local models if they exist (good for persistent hosting like Hostinger), 
// otherwise allow remote download (good for Vercel/first-time).
const IS_VERCEL = !!process.env.VERCEL;

env.allowLocalModels = !IS_VERCEL; // If on Vercel, always fetch remote to avoid large local repos
env.allowRemoteModels = true; 
env.cacheDir = path.join(os.tmpdir(), '.cache');

// If we are on Vercel, we must use the WASM backend for ONNX. 
// Standard serverless environments often lack the shared library (libonnxruntime.so) 
// required for the native Node.js backend.
if (IS_VERCEL) {
    env.backends.onnx.gpu = false;
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
} else {
    // Local / VPS environments can use 1 thread for stability but native performance
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.simd = true;
}

let model = null;
let processor = null;

// The popular highly robust background removal model
const MODEL_ID = 'briaai/RMBG-1.4';

async function loadModel() {
    try {
        if (!model || !processor) {
            console.log(`Loading model ${MODEL_ID}... This might take a bit the first time.`);
            
            model = await AutoModel.from_pretrained(MODEL_ID, {
                config: { model_type: 'custom' },
            });
            
            processor = await AutoProcessor.from_pretrained(MODEL_ID, {
                config: {
                    do_normalize: true,
                    do_pad: false,
                    do_rescale: true,
                    do_resize: true,
                    image_mean: [0.5, 0.5, 0.5],
                    feature_extractor_type: "ImageFeatureExtractor",
                    image_std: [1, 1, 1],
                    resample: 2,
                    rescale_factor: 0.00392156862745098,
                    size: { width: 1024, height: 1024 }, // Exact architecture requirements to prevent array-bounds crash
                }
            });
            
            console.log('Model loaded successfully!');
        }
    } catch (err) {
        logError(err, 'LOAD_MODEL');
        throw err;
    }
}

async function removeBackground(imageBuffer) {
    if (!model || !processor) {
        await loadModel();
    }

    // 1. Read input image using native Jimp (guarantees no C++ glib collisions with ONNX)
    const jimpImage = await Jimp.read(imageBuffer);
    const width = jimpImage.bitmap.width;
    const height = jimpImage.bitmap.height;

    // Convert to RGBA raw data for transformers
    const image = new RawImage(new Uint8ClampedArray(jimpImage.bitmap.data), width, height, 4);

    // 2. Preprocess the image
    const { pixel_values } = await processor(image);

    // 3. Run the model inference
    const { output } = await model({ input: pixel_values });

    // 4. Post-process the output
    const mask = await RawImage.fromTensor(output[0].mul_(255.0).to('uint8')).resize(width, height);
    const maskData = mask.data;
    const imageData = jimpImage.bitmap.data;
    
    // 5. Highly optimized pure JS loop overwriting alpha channel array
    for (let i = 0; i < maskData.length; ++i) {
        imageData[(i * 4) + 3] = maskData[i];
    }
    
    // 6. Return buffer WITHOUT CPU-intensive javascript PNG deflation!
    // Jimp defaults to high deflation which takes ~10-14 seconds entirely on the CPU in JS land.
    // By turning deflation to 0, encoding drops down to <0.5 seconds!
    jimpImage.deflateLevel(0);
    jimpImage.filterType(Jimp.PNG_FILTER_NONE);

    // 7. Extract the buffer dynamically
    const resultBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    return resultBuffer;
}

export { removeBackground, loadModel };
