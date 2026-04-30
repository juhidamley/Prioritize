import React, { useEffect, useRef } from 'react';

const CELL_SIZE = 50;
const FPS = 15; // Controls the speed of the simulation

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols: number;
    let rows: number;
    let grid: number[][];
    // no decorative particles — Game of Life only
    let animationFrameId: number;
    let lastRenderTime = 0;

    // Initialize or resize the grid
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / CELL_SIZE);
      rows = Math.floor(canvas.height / CELL_SIZE);
      
      grid = new Array(cols).fill(null).map(() =>
        new Array(rows).fill(null).map(() => (Math.random() > 0.85 ? 1 : 0))
      );
    };

    // Standard Game of Life rules
    const computeNextGeneration = () => {
      const nextGrid = grid.map((arr) => [...arr]);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let neighbors = 0;
          
          // Count all 8 surrounding cells
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;
              
              // Wrap around edges (Toroidal array)
              const col = (i + x + cols) % cols;
              const row = (j + y + rows) % rows;
              neighbors += grid[col][row];
            }
          }

          // Apply rules
          const isAlive = grid[i][j] === 1;
          if (isAlive && (neighbors < 2 || neighbors > 3)) {
            nextGrid[i][j] = 0; // Underpopulation or Overpopulation
          } else if (!isAlive && neighbors === 3) {
            nextGrid[i][j] = 1; // Reproduction
          }
        }
      }
      grid = nextGrid;
    };

    const draw = () => {
      // Clear with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw live cells using decorative symbols
      const SYMBOLS = ". ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.𖦹ׂ ₊˚⊹⋆".split(/\s+/).filter(Boolean);
      ctx.fillStyle = '#ffffff';
      // Use a font sized to the cell for readable glyphs
      const fontSize = Math.max(8, CELL_SIZE - 1);
      ctx.font = `${fontSize}px "Sixtyfour Convergence", "Press Start 2P", serif, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] === 1) {
            const idx = (i * rows + j) % SYMBOLS.length;
            const glyph = SYMBOLS[idx];
            const x = i * CELL_SIZE + CELL_SIZE / 2;
            const y = j * CELL_SIZE + CELL_SIZE / 2;
            ctx.fillText(glyph, x, y);
          }
        }
      }

      // (particles removed) only draw Game of Life symbols
    };

    // particles removed — no updateParticles

    const loop = (timestamp: number) => {
      // Throttle the framerate
      if (timestamp - lastRenderTime >= 1000 / FPS) {
        draw();
        computeNextGeneration();
        lastRenderTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    // Initial setup
    setup();
    animationFrameId = requestAnimationFrame(loop);

    // Handle window resizing
    const handleResize = () => {
      setup();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />
      
      {/* Foreground Text Overlay */}
      <div className="z-10 text-center pointer-events-none select-none">
        <h1
          className="text-4xl md:text-6xl lg:text-8xl tracking-widest"
            style={{
              fontFamily: "Times New Roman, serif",
              color: '#FFFFFF',
              WebkitTextStroke: '1px rgba(0,0,0,0.25)',
              textShadow: '0 0 16px rgba(000,000,000,0.6), 0 8px 32px rgba(0,0,0,0.6)'
          }}
        >
          Juhi Damley
        </h1>
      </div>
    </section>
  );
}