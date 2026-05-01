import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';

const CELL_SIZE = 50;
const FPS = 15;

const G = '#00ff41';
const G_DIM = 'rgba(0,255,65,0.35)';
const G_MID = 'rgba(0,255,65,0.6)';
const G_BG  = 'rgba(0,255,65,0.07)';

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
  const [aliveCount, setAliveCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  // ── Game of Life canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols: number, rows: number, grid: number[][];
    let raf: number, last = 0;

    const setup = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width  / CELL_SIZE);
      rows = Math.floor(canvas.height / CELL_SIZE);
      grid = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => (Math.random() > 0.85 ? 1 : 0))
      );
    };

    const step = () => {
      const next = grid.map(c => [...c]);
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          let n = 0;
          for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++) {
              if (!x && !y) continue;
              n += grid[(i + x + cols) % cols][(j + y + rows) % rows];
            }
          const a = grid[i][j];
          if (a && (n < 2 || n > 3)) next[i][j] = 0;
          else if (!a && n === 3)    next[i][j] = 1;
        }
      grid = next;
    };

    const SYMS = ". ݁₊ ⊹ . ݁ ⟡ ₊˚⊹⋆".split(/\s+/).filter(Boolean);

    let frame = 0;
    let lastChangeTime = performance.now();
    let prevCount = -1;
    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(8, CELL_SIZE - 2)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let count = 0;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
          if (grid[i][j]) {
            ctx.fillText(
              SYMS[(i * rows + j) % SYMS.length],
              i * CELL_SIZE + CELL_SIZE / 2,
              j * CELL_SIZE + CELL_SIZE / 2,
            );
            count++;
          }

      // detect stall: if alive count hasn't changed for 5s, restart
      if (count !== prevCount) {
        prevCount = count;
        lastChangeTime = performance.now();
      } else {
        if (performance.now() - lastChangeTime >= 5000) {
          setup();
          lastChangeTime = performance.now();
          prevCount = -1;
          return; // skip updating state this frame, grid has been reset
        }
      }

      frame++;
      if (frame % 3 === 0) setAliveCount(count);
    };

    const loop = (ts: number) => {
      if (ts - last >= 1000 / FPS) { draw(); step(); last = ts; }
      raf = requestAnimationFrame(loop);
    };

    setup();
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', setup);
    return () => { window.removeEventListener('resize', setup); cancelAnimationFrame(raf); };
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────────
  const go = useCallback((item: typeof NAV_ITEMS[0]) => {
    if (item.path === '/prioritize') { window.location.href = '/prioritize/'; return; }
    if (item.path === '/lecturetex') { window.location.href = '/lecturetex';  return; }
    navigate(item.path);
  }, [navigate]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown')  { e.preventDefault(); setSelectedIndex(i => (i + 1) % NAV_ITEMS.length); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setSelectedIndex(i => (i - 1 + NAV_ITEMS.length) % NAV_ITEMS.length); }
      if (e.key === 'Enter')      { go(NAV_ITEMS[selectedIndex]); }
      if (e.key === 'Escape')     { setExpanded(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, selectedIndex, go]);

  useEffect(() => {
    if (expanded) {
      setShowHint(false);
      return;
    }
    const id = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(id);
  }, [expanded]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ── Name ─────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 z-10"
        style={{
          top: expanded ? '10rem' : '50%',
          transform: expanded ? 'translateX(-50%)' : 'translate(-50%, -50%)',
          transition: 'top 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <button
          onClick={() => { if (!expanded) { setExpanded(true); setShowHint(false); } }}
          className="text-4xl md:text-6xl lg:text-8xl tracking-widest text-white whitespace-nowrap select-none"
          style={{
            fontFamily: 'Times New Roman, serif',
            //animation: expanded ? 'none' : 'pulsate 3s ease-in-out infinite',
            cursor: expanded ? 'default' : 'pointer',
            color: expanded ? G : '#ffe169',
          }}
        >
          Juhi Damley
        </button>
      </div>

      {/* ── Terminal ─────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 top-1/2 z-10 w-full max-w-lg md:max-w-2xl lg:max-w-3xl"
        style={{
          transform: expanded
            ? 'translate(-50%, -50%)'
            : 'translate(-50%, calc(-50% + 40px))',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          transition: 'opacity 0.5s 0.35s ease, transform 0.5s 0.35s cubic-bezier(0.4,0,0.2,1)',
          fontFamily: '"Courier New", Courier, monospace',
        }}
      >
        {/* box top */}
        <div style={{ color: G_MID, fontSize: '0.78rem', lineHeight: 1.4, display: 'flex', whiteSpace: 'nowrap' }}>
          <span>{'┌─ juhi@studio ~ '}</span>
          <span style={{ flex: 1, overflow: 'hidden' }}>{'─'.repeat(120)}</span>
          <span>{'┐'}</span>
        </div>

        <div
          style={{
            borderLeft: `1px solid ${G_MID}`,
            borderRight: `1px solid ${G_MID}`,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* prompt line */}
          <div className="px-4 py-2 text-xs" style={{ color: G_DIM }}>
            juhi@studio:~$ <span style={{ color: G }}>ls navigation/</span>
          </div>

          {/* nav items */}
          <div className="pb-1">
            {NAV_ITEMS.map((item, i) => {
              const active = i === selectedIndex;
              return (
                <button
                  key={item.path}
                  onClick={() => go(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className="w-full text-left flex items-center text-sm"
                  style={{
                    padding: '0.2rem 1rem',
                    background: active ? G_BG : 'transparent',
                    color: active ? G : G_DIM,
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  <span
                    className="w-4 mr-2 text-center"
                    style={{
                      color: G,
                      animation: active ? 'blink-cursor 1s step-end infinite' : 'none',
                    }}
                  >
                    {active ? '>' : ' '}
                  </span>
                  <span className="flex-1 tracking-wider">{item.label}</span>
                  <span style={{ color: G_DIM, fontSize: '0.75rem' }}>{item.path}</span>
                </button>
              );
            })}
          </div>

          {/* hint line */}
          <div
            className="px-4 py-2 text-xs flex gap-5"
            style={{
              color: G_DIM,
              borderTop: `1px solid rgba(0,255,65,0.12)`,
            }}
          >
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        </div>

        {/* box bottom */}
        <div style={{ color: G_MID, fontSize: '0.78rem', lineHeight: 1.4, display: 'flex', whiteSpace: 'nowrap' }}>
          <span>{'└'}</span>
          <span style={{ flex: 1, overflow: 'hidden' }}>{'─'.repeat(120)}</span>
          <span>{'┘'}</span>
        </div>
      </div>

      <div
        className="absolute left-4 bottom-4 z-20"
        style={{
          color: G,
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${G_MID}`,
          padding: '0.25rem 0.5rem',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '0.75rem',
          borderRadius: '4px',
        }}
      >
        <div style={{ color: G_MID, fontSize: '0.65rem', marginBottom: 4 }}>Game of Life</div>
        <div>
          <span style={{ color: G_MID, marginRight: 8 }}>alive</span>
          <span>{aliveCount}</span>
        </div>
      </div>

      {showHint && (
        <div
          className="absolute right-4 bottom-4 z-20"
          style={{
            color: G,
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${G_MID}`,
            padding: '0.25rem 0.5rem',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.75rem',
            borderRadius: '4px',
            textAlign: 'right',
          }}
        >
          <div style={{ color: G_MID, fontSize: '0.65rem', marginBottom: 4 }}>Hint</div>
          <div>Click the name to view the navigation</div>
        </div>
      )}
    </section>
  );
}
