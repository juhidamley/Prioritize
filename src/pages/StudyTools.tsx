import { useNavigate } from 'react-router';
import { ReactNode } from 'react';

const RetroWindow = ({ title, icon, children, className = '' }: { title: string, icon: string, children: ReactNode, className?: string }) => (
  <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-xl ${className}`}>
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
      </div>
      <div className="flex gap-1 shrink-0 ml-2">
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center">_</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center">□</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] flex items-center justify-center hover:bg-red-400">X</button>
      </div>
    </div>
    <div className="p-1 md:p-2 flex-1 flex flex-col">{children}</div>
  </div>
);

export function StudyTools() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-blue-400 to-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative pb-16">
        
        {/* Tool 1: AI Math Notetaker Placeholder */}
        <RetroWindow title="MathNotes.exe" icon="🧮" className="h-64">
           <div className="w-full h-full bg-white border-2 border-inset p-4 text-black font-mono overflow-y-auto">
             <p className="text-blue-600 font-bold mb-2">&gt; AI Math Notetaker v0.1</p>
             <p className="text-gray-600 italic mb-4">"Building an AI math notetaker for VS Code..."</p>
             <div className="p-2 border border-dashed border-gray-400 text-center text-sm">
               [ Module Loading: Under Construction ]
             </div>
           </div>
        </RetroWindow>

        {/* Tool 2: Accountabl Status */}
        <RetroWindow title="Accountabl_Habits.sys" icon="📈" className="h-64">
          <div className="w-full h-full bg-black border-2 border-inset p-4 text-green-500 font-mono text-sm">
            <p>STATUS: ACTIVE</p>
            <p>POINTS_EARNED: 450</p>
            <p>STREAK: 12 DAYS</p>
            <div className="mt-4 bg-green-900 h-4 w-full">
               <div className="bg-green-400 h-full w-3/4"></div>
            </div>
            <p className="mt-1 text-[10px]">Progress to daily goal...</p>
          </div>
        </RetroWindow>

        {/* Tool 3: Study Resources & Apps */}
        <RetroWindow title="applications.hlp" icon="📁" className="md:col-span-2 min-h-48">
          <div className="flex gap-4 px-2 pb-1 border-b border-gray-500 mb-2 text-xs">
            <span className="cursor-pointer">File</span>
            <span className="cursor-pointer">Edit</span>
            <span className="cursor-pointer">View</span>
          </div>
          
          <div className="w-full flex-1 bg-white border-2 border-inset border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-4">
            <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-sm">Installed Applications</h3>
            
            <div className="flex flex-wrap gap-6">
              {/* THE POMODORO LINK */}
              <button 
                onClick={() => navigate('/pomodoro')}
                className="flex flex-col items-center gap-2 group focus:outline-none w-24"
              >
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors">
                  ⏱️
                </div>
                <span className="text-xs font-sans text-center group-hover:bg-[#000080] group-hover:text-white px-1">
                  PomoTimer.exe
                </span>
              </button>

              {/* THE PRIORITIZE LINK */}
              <button 
                onClick={() => window.location.href = 'https://ptz.juhi.studio'}
                className="flex flex-col items-center gap-2 group focus:outline-none w-24"
              >
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors">
                  📋
                </div>
                <span className="text-xs font-sans text-center group-hover:bg-[#000080] group-hover:text-white px-1">
                  Prioritize.exe
                </span>
              </button>

              {/* THE LECTURETEX LINK */}
              <button 
                onClick={() => window.location.href = 'https://lecturetex.juhi.studio'}
                className="flex flex-col items-center gap-2 group focus:outline-none w-24"
              >
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors">
                  🧮
                </div>
                <span className="text-xs font-sans text-center group-hover:bg-[#000080] group-hover:text-white px-1">
                  LectureTeX.exe
                </span>
              </button>
            </div>
          </div>
        </RetroWindow>
      </div>

      <button onClick={() => navigate('/')} className="fixed bottom-4 left-4 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white z-50 shadow-xl">
        <span className="text-xl">⊞</span> Start
      </button>
    </div>
  );
}