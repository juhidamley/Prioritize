import { useEffect, useRef } from 'react';

export default function MandelbrotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const maxIter = 150; 
    const escapeRadiusSq = 4;
    const baseRe = -0.74364388;
    const baseIm = 0.13182590;
    let time = 0; 

    const palette = new Uint8ClampedArray(maxIter * 4);
    for (let i = 0; i < maxIter; i++) {
      palette[i * 4] = Math.floor(Math.sin(0.1 * i + 0) * 127 + 128);     
      palette[i * 4 + 1] = Math.floor(Math.sin(0.1 * i + 2) * 127 + 128); 
      palette[i * 4 + 2] = Math.floor(Math.sin(0.1 * i + 4) * 127 + 128); 
      palette[i * 4 + 3] = 255;                                           
    }

    let animationFrameId: number;

    const renderFrame = () => {
      time += 0.015; 
      const centerRe = baseRe + Math.sin(time * 0.3) * 0.001;
      const centerIm = baseIm + Math.cos(time * 0.4) * 0.001;
      const zoomRange = 0.008 + Math.sin(time * 0.2) * 0.004;

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      const minRe = centerRe - zoomRange / 2;
      const maxRe = centerRe + zoomRange / 2;
      const minIm = centerIm - (zoomRange * height / width) / 2;
      const maxIm = centerIm + (zoomRange * height / width) / 2;

      const reStep = (maxRe - minRe) / width;
      const imStep = (maxIm - minIm) / height;

      for (let y = 0; y < height; y++) {
        const cIm = minIm + y * imStep;
        for (let x = 0; x < width; x++) {
          const cRe = minRe + x * reStep;
          let zRe = 0;
          let zIm = 0;
          let iter = 0;

          while (zRe * zRe + zIm * zIm <= escapeRadiusSq && iter < maxIter) {
            const zReTemp = zRe * zRe - zIm * zIm + cRe;
            zIm = 2 * zRe * zIm + cIm;
            zRe = zReTemp;
            iter++;
          }

          const pixelIndex = (y * width + x) * 4;
          if (iter === maxIter) {
            data[pixelIndex] = 0;
            data[pixelIndex + 1] = 0;
            data[pixelIndex + 2] = 0;
            data[pixelIndex + 3] = 255;
          } else {
            data[pixelIndex] = palette[iter * 4];
            data[pixelIndex + 1] = palette[iter * 4 + 1];
            data[pixelIndex + 2] = palette[iter * 4 + 2];
            data[pixelIndex + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
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
    // We wrap everything in a solid black container fixed to the very back (-z-20)
    <div className="fixed inset-0 w-full h-full -z-20 bg-black">
      
      {/* The Canvas sits inside, slightly transparent */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />
      
      {/* Global Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-yellow-400 to-pink-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
    
    </div>
  );
}