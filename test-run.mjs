import { removeBackground } from './services/bg-removal.js';
import fs from 'fs';

async function test() {
    try {
        console.log("Loading module...");
        console.log("Reading dummy buffer...");
        // 100x100 dummy image buffer (we can't just use empty, Jimp needs valid buffer)
        // Actually I don't have an image. Let's create an empty Jimp image.
        const Jimp = (await import('jimp')).default;
        const img = new Jimp(100, 100, 0xFF0000FF);
        const buf = await img.getBufferAsync(Jimp.MIME_PNG);
        
        console.log("Starting removal...");
        const t0 = Date.now();
        const res = await removeBackground(buf);
        console.log("First pass Done in", Date.now() - t0, "ms");
        
        console.log("Starting removal pass 2...");
        const t1 = Date.now();
        const res2 = await removeBackground(buf);
        console.log("Second pass Done in", Date.now() - t1, "ms");
    } catch(e) {
        console.error(e);
    }
}
test();
