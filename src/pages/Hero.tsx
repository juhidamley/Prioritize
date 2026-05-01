import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';

const CELL_SIZE = 50;
const FPS = 15;

const NAV_ITEMS = [
  { label: 'home',       path: '/' },
  { label: 'about',      path: '/about' },
  { label: 'links',      path: '/links' },
  { label: 'resume',     path: '/resume' },
  { label: 'projects',   path: '/projects' },
  { label: 'research',   path: '/research' },
  { label: 'contact',    path: '/contact' },
  { label: 'study',      path: '/studyTools' },
  { label: 'prioritize', path: '/prioritize' },
  { label: 'lecturetex', path: '/lecturetex' },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols: number, rows: number, grid: number[][];
    let animationFrameId: number;
    let lastRenderTime = 0;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / CELL_SIZE);
      rows = Math.floor(canvas.height / CELL_SIZE);
      grid = new Array(cols).fill(null).map(() =>
        new Array(rows).fill(null).map(() => (Math.random() > 0.85 ? 1 : 0))
      );
    };

    const computeNextGeneration = () => {
      const next = grid.map(arr => [...arr]);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let n = 0;
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;
              n += grid[(i + x + cols) % cols][(j + y + rows) % rows];
            }
          }
          const alive = grid[i][j] === 1;
          if (alive && (n < 2 || n > 3)) next[i][j] = 0;
          else if (!alive && n === 3) next[i][j] = 1;
        }
      }
      grid = next;
    };

    const SYMBOLS = ". ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.𖦹ׂ ₊˚⊹⋆".split(/\s+/).filter(Boolean);

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.max(8, CELL_SIZE - 1);
      ctx.font = `${fontSize}px "Sixtyfour Convergence", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] === 1) {
            const glyph = SYMBOLS[(i * rows + j) % SYMBOLS.length];
            ctx.fillText(glyph, i * CELL_SIZE + CELL_SIZE / 2, j * CELL_SIZE + CELL_SIZE / 2);
          }
        }
      }
    };

    const loop = (ts: number) => {
      if (ts - lastRenderTime >= 1000 / FPS) {
        draw();
        computeNextGeneration();
        lastRenderTime = ts;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    setup();
    animationFrameId = requestAnimationFrame(loop);
    const onResize = () => setup();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavigate = useCallback((item: typeof NAV_ITEMS[0]) => {
    if (item.path === '/prioritize') {
      window.location.href = '/prioritize/';
    } else if (item.path === '/lecturetex') {
      window.location.href = '/lecturetex';
    } else {
      navigate(item.path);
    }
  }, [navigate]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % NAV_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + NAV_ITEMS.length) % NAV_ITEMS.length);
      } else if (e.key === 'Enter') {
        handleNavigate(NAV_ITEMS[selectedIndex]);
      } else if (e.key === 'Escape') {
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, selectedIndex, handleNavigate]);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Name — animates from center to top on click */}
      <div
        className="absolute left-1/2 z-10 transition-all duration-700 ease-in-out"
        style={{
          top: expanded ? '2.5rem' : '50%',
          transform: expanded ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        }}
      >
        <div style={!expanded ? { animation: 'gentle-bounce 2s ease-in-out infinite' } : undefined}>
          <button
            onClick={() => !expanded && setExpanded(true)}
            className="text-4xl md:text-6xl lg:text-8xl tracking-widest text-white whitespace-nowrap select-none transition-opacity duration-300 hover:opacity-80"
            style={{
              fontFamily: 'Times New Roman, serif',
              WebkitTextStroke: '1px rgba(0,0,0,0.25)',
              textShadow: '0 0 16px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.6)',
              cursor: expanded ? 'default' : 'pointer',
            }}
          >
            Juhi Damley
          </button>
        </div>
      </div>

      {/* Terminal selector */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4 transition-all duration-500"
        style={{
          top: '10rem',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          transform: `translateX(-50%) translateY(${expanded ? '0px' : '20px'})`,
        }}
      >
        <div className="border border-white/20 bg-black/85 backdrop-blur-sm font-mono text-sm">
          <div className="px-4 pt-3 pb-2 text-white/30 text-xs tracking-[0.3em] border-b border-white/10">
            SELECT DESTINATION
          </div>
          <div className="py-1">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item)}
                onMouseEnter={() => setSelectedIndex(i)}
                className="w-full text-left px-4 py-1.5 flex items-center gap-3 transition-colors duration-100"
                style={{
                  background: i === selectedIndex ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: i === selectedIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              >
                <span className="w-3 text-white/60">{i === selectedIndex ? '>' : ' '}</span>
                <span className="flex-1 tracking-wider">{item.label}</span>
                <span className="text-white/20 tracking-wider">{item.path}</span>
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-white/10 text-white/20 text-xs tracking-widest flex gap-4">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
        </div>
      </div>
    </section>
  );
}
