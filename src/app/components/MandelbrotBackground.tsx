import { useEffect, useRef } from 'react';

export default function MandelbrotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Increased scale for much higher clarity (0.8 is a good balance of crispness and performance)
    const RENDER_SCALE = 0.8; 
    let width = Math.floor(window.innerWidth * RENDER_SCALE);
    let height = Math.floor(window.innerHeight * RENDER_SCALE);

    const maxIter = 120;
    // Increased escape radius is required for the smooth coloring math to work properly
    const escapeRadiusSq = 256; 
    
    // A deeply detailed target spot on the fractal
    const targetRe = -0.74364388;
    const targetIm = 0.13182590;
    let time = 0;

    // Generate Palette
    const palette = new Uint8ClampedArray(maxIter * 4);
    for (let i = 0; i < maxIter; i++) {
      // Adjusted color frequencies slightly for a richer gradient
      palette[i * 4] = Math.floor(Math.sin(0.15 * i + 0) * 127 + 128);     
      palette[i * 4 + 1] = Math.floor(Math.sin(0.15 * i + 2) * 127 + 128); 
      palette[i * 4 + 2] = Math.floor(Math.sin(0.15 * i + 4) * 127 + 128); 
      palette[i * 4 + 3] = 255;                                           
    }

    let animationFrameId: number;

    const renderFrame = () => {
      time += 0.005; 
      
      // 1. Exponential Zoom: Oscillates between 2.5 (wide) and 0.00005 (deep zoom)
      const zoomPhase = (Math.sin(time * 0.3) + 1) / 2; // Normalizes sine wave to 0 -> 1
      const zoomRange = 2.5 * Math.pow(0.00002, zoomPhase);

      // 2. Dynamic Panning: Pans the camera, scaling the movement by the current zoom level
      // so it always feels like it's drifting at a constant speed
      const centerRe = targetRe + Math.sin(time * 0.25) * zoomRange * 0.4;
      const centerIm = targetIm + Math.cos(time * 0.31) * zoomRange * 0.4;

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      const aspect = height / width;
      const minRe = centerRe - zoomRange / 2;
      const maxRe = centerRe + zoomRange / 2;
      const minIm = centerIm - (zoomRange * aspect) / 2;

      const reStep = (maxRe - minRe) / width;
      const imStep = (zoomRange * aspect) / height;

      for (let y = 0; y < height; y++) {
        const cIm = minIm + y * imStep;
        for (let x = 0; x < width; x++) {
          const cRe = minRe + x * reStep;
          let zRe = 0;
          let zIm = 0;
          let iter = 0;
          let zReSq = 0;
          let zImSq = 0;

          // Optimized inner loop
          while (zReSq + zImSq <= escapeRadiusSq && iter < maxIter) {
            zIm = 2 * zRe * zIm + cIm;
            zRe = zReSq - zImSq + cRe;
            zReSq = zRe * zRe;
            zImSq = zIm * zIm;
            iter++;
          }

          const pixelIndex = (y * width + x) * 4;
          
          if (iter === maxIter) {
            data[pixelIndex] = 0;     // R
            data[pixelIndex + 1] = 0; // G
            data[pixelIndex + 2] = 0; // B
            data[pixelIndex + 3] = 255; // A
          } else {
            // 3. Smooth Coloring Algorithm (Renormalization)
            // Prevents ugly color banding when zoomed in deeply
            const magSq = zReSq + zImSq;
            let smoothIter = iter;
            if (magSq > 0) {
              const logZ = Math.log(magSq) / 2;
              const nu = Math.log(logZ / Math.LN2) / Math.LN2;
              smoothIter = iter + 1 - nu;
            }

            // Interpolate between the two nearest colors in the palette
            const color1 = Math.floor(smoothIter) % maxIter;
            const color2 = (color1 + 1) % maxIter;
            const frac = smoothIter - Math.floor(smoothIter);

            const i1 = color1 * 4;
            const i2 = color2 * 4;

            data[pixelIndex] = palette[i1] * (1 - frac) + palette[i2] * frac;
            data[pixelIndex + 1] = palette[i1 + 1] * (1 - frac) + palette[i2 + 1] * frac;
            data[pixelIndex + 2] = palette[i1 + 2] * (1 - frac) + palette[i2 + 2] * frac;
            data[pixelIndex + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const setupCanvas = () => {
      width  = Math.floor(window.innerWidth  * RENDER_SCALE);
      height = Math.floor(window.innerHeight * RENDER_SCALE);
      canvas.width  = width;
      canvas.height = height;
    };

    setupCanvas();
    renderFrame();

    window.addEventListener('resize', setupCanvas);

    return () => {
      window.removeEventListener('resize', setupCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-yellow-400 to-pink-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
    </div>
  );
}