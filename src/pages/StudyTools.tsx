import { useNavigate } from 'react-router';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';

export function StudyTools() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 pb-16 relative font-sans">
      <h1 className="sr-only">Study Tools — Juhi Damley</h1>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-blue-400 to-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative pb-16">

        {/* Tool 3: Study Resources & Apps */}
        <RetroWindow
          title="applications.hlp"
          icon="📁"
          windowId="applications"
          className="md:col-span-2 min-h-48"
          bodyClassName="p-1 md:p-2"
        >
          <div className="flex gap-4 px-2 pb-1 border-b border-gray-500 mb-2 text-xs" aria-hidden="true">
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
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors" aria-hidden="true">
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
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors" aria-hidden="true">
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
                <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-2xl group-hover:bg-[#000080] group-hover:text-white transition-colors" aria-hidden="true">
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

      <Taskbar />
    </div>
  );
}
