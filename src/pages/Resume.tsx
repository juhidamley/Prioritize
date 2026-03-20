import { useNavigate } from 'react-router';
import { ReactNode } from 'react';

// Reusable Retro Window
const RetroWindow = ({ title, icon, children, className = '' }: { title: string, icon: string, children: ReactNode, className?: string }) => (
  <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-2xl ${className}`}>
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
      </div>
      <div className="flex gap-1 shrink-0 ml-2">
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">_</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">□</button>
        <button onClick={() => window.history.back()} className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center hover:bg-red-400">X</button>
      </div>
    </div>
    <div className="flex-1 flex flex-col">{children}</div>
  </div>
);

export function Resume() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a001a] bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-blue-600 to-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      {/* Changed to Acrobat Reader style */}
      <RetroWindow title="resume.pdf - Acrobat Reader 3.0" icon="📄" className="w-full max-w-6xl h-[90vh] z-10">
        
        {/* Action Toolbar */}
        <div className="flex gap-2 px-2 py-2 border-b-2 border-gray-500 bg-[#c0c0c0] shrink-0">
          <div className="flex gap-2 pr-2">
            <a 
              href="/assets/resume.pdf" 
              download="Resume.pdf"
              className="px-3 py-1 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 text-sm font-bold text-black bg-[#c0c0c0] gap-2" 
              title="Download to Disk"
            >
              <span>💾</span> Download PDF
            </a>
            <a 
              href="/assets/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 text-sm font-bold text-black bg-[#c0c0c0] gap-2" 
              title="Open Full Screen in Browser"
            >
              <span>🖨️</span> Open Full Screen
            </a>
          </div>
        </div>

        {/* Document Area - Embedding the actual PDF */}
        <div className="flex-1 bg-[#808080] p-1 md:p-2 overflow-hidden border-t-2 border-l-2 border-gray-600 shadow-inner flex flex-col">
          <iframe 
            src="/assets/resume.pdf" 
            title="Resume PDF"
            className="w-full flex-1 bg-white border-none"
          />
        </div>

      </RetroWindow>

      {/* Start Button Overlay */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-4 left-4 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white z-50 shadow-xl"
      >
        <span className="text-xl leading-none">⊞</span> Start
      </button>

    </div>
  );
}