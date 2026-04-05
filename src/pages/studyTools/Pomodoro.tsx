import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ReactNode } from 'react';

// Reusable RetroWindow (matches your other pages)
const RetroWindow = ({ title, icon, children, className = '', onClose }: { title: string, icon: string, children: ReactNode, className?: string, onClose?: () => void }) => (
  <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-xl ${className}`}>
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
      </div>
      <div className="flex gap-1 shrink-0 ml-2">
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center">_</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center">□</button>
        <button onClick={onClose} className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center hover:bg-red-400 active:border-inset">X</button>
      </div>
    </div>
    <div className="p-2 flex-1 flex flex-col">{children}</div>
  </div>
);

// Retro Button Component
const RetroButton = ({ onClick, children, active = false, className = '' }: { onClick: () => void, children: ReactNode, active?: boolean, className?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 font-bold text-xs md:text-sm focus:outline-none 
      ${active 
        ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-black border-l-black border-b-white border-r-white text-gray-700' 
        : 'bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white'} 
      ${className}`}
  >
    {children}
  </button>
);

export function Pomodoro() {
  const navigate = useNavigate();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK');
  const [cycles, setCycles] = useState(0);

  const workTimeSeconds = workMinutes * 60;
  const breakTimeSeconds = breakMinutes * 60;

  const clampMinutes = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return 1;
    return Math.min(180, Math.max(1, parsed));
  };

  useEffect(() => {
    // Keep previewed countdown in sync with selected mode whenever timer is idle.
    if (!isRunning) {
      setTimeLeft(mode === 'WORK' ? workTimeSeconds : breakTimeSeconds);
    }
  }, [workTimeSeconds, breakTimeSeconds, mode, isRunning]);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-switch modes when timer hits 0
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(() => {}); // Play retro beep
      
      if (mode === 'WORK') {
        setMode('BREAK');
        setTimeLeft(breakTimeSeconds);
        setCycles(c => c + 1);
      } else {
        setMode('WORK');
        setTimeLeft(workTimeSeconds);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workTimeSeconds, breakTimeSeconds]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'WORK' ? workTimeSeconds : breakTimeSeconds);
  };

  const setModeManually = (newMode: 'WORK' | 'BREAK') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'WORK' ? workTimeSeconds : breakTimeSeconds);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalModeTime = mode === 'WORK' ? workTimeSeconds : breakTimeSeconds;
  const progressPercent = ((totalModeTime - timeLeft) / totalModeTime) * 100;

  return (
    <div className="min-h-screen w-full bg-[#008080] flex items-center justify-center p-4 relative font-sans">
      
      <RetroWindow 
        title="pomo_timer.exe" 
        icon="⏱️" 
        className="w-full max-w-md"
        onClose={() => navigate('/study')}
      >
        {/* Top Toolbar */}
        <div className="flex gap-4 px-2 pb-2 mb-4 border-b border-gray-500 text-xs">
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Options</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        {/* LCD Screen */}
        <div className="bg-black border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-6 mb-4 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Scanline overlay effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
          
          <div className="text-green-500 font-mono text-xl tracking-widest uppercase mb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
            STATUS: {mode}
          </div>
          
          <div className="text-green-400 font-mono text-6xl md:text-7xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex justify-center gap-2 mb-4">
          <RetroButton active={mode === 'WORK'} onClick={() => setModeManually('WORK')}>
            Deep Work
          </RetroButton>
          <RetroButton active={mode === 'BREAK'} onClick={() => setModeManually('BREAK')}>
            Short Break
          </RetroButton>
        </div>

        {/* Editable Session Durations */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs md:text-sm">
          <label className="flex flex-col gap-1 font-bold text-gray-800">
            Work (min)
            <input
              type="number"
              min={1}
              max={180}
              value={workMinutes}
              onChange={(e) => setWorkMinutes(clampMinutes(e.target.value))}
              className="bg-white border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white px-2 py-1 font-mono"
            />
          </label>
          <label className="flex flex-col gap-1 font-bold text-gray-800">
            Break (min)
            <input
              type="number"
              min={1}
              max={180}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(clampMinutes(e.target.value))}
              className="bg-white border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white px-2 py-1 font-mono"
            />
          </label>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center bg-[#c0c0c0] p-2 border-2 border-inset border-t-gray-500 border-l-gray-500 border-b-white border-r-white mb-4">
          <button 
            onClick={toggleTimer}
            className="flex-1 mr-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset py-2 font-bold flex justify-center items-center gap-2"
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button 
            onClick={resetTimer}
            className="w-1/3 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset py-2 font-bold"
          >
            ⏹ Reset
          </button>
        </div>

        {/* Stats Footer */}
        <div className="text-xs font-mono text-gray-700 mt-2 flex justify-between border-t border-gray-400 pt-2">
          <span>Cycles Completed: {cycles}</span>
          <span className="w-24 h-4 border border-gray-500 bg-white relative">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-[#000080] transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </span>
        </div>
      </RetroWindow>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 z-50">
        <button onClick={() => navigate('/')} className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-2 h-6 font-bold text-black flex items-center gap-1 active:border-inset text-xs">
          <span>⊞</span> Start
        </button>
        <div className="w-px h-5 bg-gray-400 mx-2 border-r border-white"></div>
        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-black border-l-black border-b-white border-r-white px-2 h-6 flex items-center text-xs font-bold text-gray-800">
          ⏱️ pomo_timer.exe
        </div>
      </div>
    </div>
  );
}