import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';

export function Resume() {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 pb-16 relative font-sans">
      <h1 className="sr-only">Resume — Juhi Damley</h1>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-blue-600 to-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      {/* Acrobat Reader style */}
      <RetroWindow title="resume.pdf - Acrobat Reader 3.0" icon="📄" windowId="resume" className="w-full max-w-6xl h-[85vh] z-10">

        {/* Action Toolbar */}
        <div className="flex gap-2 px-2 py-2 border-b-2 border-gray-500 bg-[#c0c0c0] shrink-0">
          <div className="flex gap-2 pr-2">
            <a
              href="/assets/resume.pdf"
              download="Juhi_Damley_Resume.pdf"
              className="px-3 py-1 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 text-sm font-bold text-black bg-[#c0c0c0] gap-2"
              title="Download to Disk"
            >
              <span aria-hidden="true">💾</span> Download PDF
            </a>
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 flex items-center justify-center border-t border-l border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 text-sm font-bold text-black bg-[#c0c0c0] gap-2"
              title="Open Full Screen in Browser"
            >
              <span aria-hidden="true">🖨️</span> Open Full Screen
            </a>
          </div>
        </div>

        {/* Crawlable highlights strip — real text above the (binary) PDF */}
        <div className="shrink-0 bg-white border-b-2 border-gray-500 px-4 py-3 text-black text-xs md:text-sm">
          <p className="font-bold uppercase tracking-wider text-gray-600 mb-2">Highlights</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5 leading-snug">
            <li>Research Analyst, Financial Economics Institute — computational finance under Prof. Benjamin Gillen</li>
            <li>Founder &amp; President, Girls Who Code at the Claremont Colleges — designed the full curriculum</li>
            <li>Built Electoral Equilibrium (fine-tuned Mistral 7B + CVXPY optimization + Monte Carlo) and LectureTeX (AI lecture-to-LaTeX notes)</li>
            <li>B.A. Computer Science, Claremont McKenna College — Class of 2028</li>
          </ul>
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

      <Taskbar />
    </div>
  );
}
