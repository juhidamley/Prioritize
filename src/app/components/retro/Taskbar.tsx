import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDesktop } from './DesktopContext';
import { StartMenu } from './StartMenu';

const RAISED =
  'border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black';
const SUNKEN =
  'border-t-2 border-l-2 border-b-2 border-r-2 border-t-black border-l-black border-b-white border-r-white';

export function Taskbar() {
  const desktop = useDesktop();
  const navigate = useNavigate();
  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [shuttingDown, setShuttingDown] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const shutDown = () => {
    setStartOpen(false);
    setShuttingDown(true);
    window.setTimeout(() => navigate('/'), 1800);
  };

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} onShutDown={shutDown} />}

      <nav
        aria-label="Taskbar"
        className="fixed bottom-0 inset-x-0 h-10 bg-[#c0c0c0] border-t-2 border-t-white flex items-center gap-1 px-1 z-50 shadow-[0_-2px_6px_rgba(0,0,0,0.4)]"
      >
        <button
          onClick={() => setStartOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={startOpen}
          className={`${startOpen ? SUNKEN : RAISED} bg-[#c0c0c0] px-2 h-8 font-bold text-black flex items-center gap-1 text-sm shrink-0 active:border-t-black active:border-l-black active:border-b-white active:border-r-white`}
        >
          <span className="text-lg leading-none" aria-hidden="true">⊞</span> Start
        </button>

        <div className="w-px h-7 bg-gray-500 border-r border-white mx-1 shrink-0" aria-hidden="true" />

        {/* Open-window tabs */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0">
          {(desktop?.windows ?? []).map(w => (
            <button
              key={w.id}
              onClick={() => desktop!.toggleMinimized(w.id)}
              aria-pressed={!w.minimized}
              title={w.minimized ? `Restore ${w.title}` : `Minimize ${w.title}`}
              className={`${w.minimized ? RAISED : `${SUNKEN} bg-[#dfdfdf]`} bg-[#c0c0c0] h-8 px-2 max-w-44 flex items-center gap-1.5 text-xs text-black shrink-0 ${w.minimized ? '' : 'font-bold'}`}
            >
              <span aria-hidden="true">{w.icon}</span>
              <span className="truncate">{w.title}</span>
            </button>
          ))}
        </div>

        {/* Clock */}
        <div
          className={`${SUNKEN} h-8 px-3 flex items-center text-xs text-black shrink-0`}
          title={now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        >
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </nav>

      {shuttingDown && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-[fade-in_0.5s_ease]">
          <p
            className="text-[#ffa500] text-center px-6 text-lg md:text-2xl leading-relaxed"
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
          >
            It's now safe to return to the terminal.
          </p>
        </div>
      )}
    </>
  );
}
