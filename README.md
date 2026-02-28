# EraseBG - AI Background Remover

EraseBG is a high-performance, completely free, and privacy-focused AI background removal application. Built with Node.js, Express, and running cutting-edge `@xenova/transformers` entirely locally, this tool securely removes backgrounds from images in milliseconds—without ever sending your sensitive data to remote third-party APIs.

## Features

- **Local AI Processing**: Uses the robust `briaai/RMBG-1.4` model directly on your server, ensuring extreme processing speed and 100% data privacy.
- **Batch Processing**: Drag and drop up to 12 images (PNG, JPG, WEBP) at once for seamless bulk processing.
- **Dynamic Optimization Engine**: Output images are intelligently resized and encoded to keep file sizes as low or lower than the original inputs.
- **Multiple Output Formats**: Choose between uncompressed `.PNG` for maximal quality, or highly optimized `.WEBP` formats to save disk space.
- **Sleek Glassmorphism UI**: Beautiful, fully responsive frontend utilizing modern HTML/CSS techniques for flawless mobile and desktop usability.
- **Instant ZIP Compilation**: Compile and download multiple backgrounds-free images directly in your browser using JSZip, putting zero strain on the backend.

## Architecture

1. **Backend (Express)**
   - Minimalist Express server serving static UI assets.
   - `multer` handles multi-part array uploads in-memory.
   - Processing bypasses classic ImageMagick/Canvas wrappers by directly manipulating raw Image Bitmaps via `jimp` while evaluating AI tensors from ONNX.

2. **Frontend (Vanilla HTML/CSS/JS)**
   - No React/Vue overhead. 
   - Uses `Blob` allocations and dynamic `<canvas>` repaints to execute instant client-side resizing and format conversion.

## Setup and Installation

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **First Run**
   The first time the application runs, it will download the ONNX model files (~170MB). They will be cached locally.
   ```bash
   npm start
   ```

3. **Usage**
   Navigate to `http://localhost:3000` in your web browser. Drag and drop your images into the designated area.

## SEO and Monetization Preparedness

The application includes generated static subpages (Privacy Policy, Terms of Service, About Us, and Contact Us) styled consistently with the core application. These pages are strictly structured with Semantic HTML and adhere to standard Google AdSense compliance policies to aid in search ranking and monetization approval.
"# erasebg" 
