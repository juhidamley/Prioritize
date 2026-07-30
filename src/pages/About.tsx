import { useNavigate } from 'react-router';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 pb-16 relative font-sans">
      <h1 className="sr-only">About — Juhi Damley</h1>

      {/* Main Grid Layout */}
      <div className="w-full max-w-6xl z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative pb-16">
        {/* MODULE 3: Top - Full Width Notepad (bio + where-to-next) */}
        <RetroWindow
          title="readme.txt - Notepad"
          icon="📝"
          windowId="readme"
          className="md:col-span-3 min-h-[40vh]"
          bodyClassName="p-1 md:p-2"
        >
          {/* Notepad Toolbar */}
          <div className="flex gap-4 px-2 pb-1 border-b border-gray-500 mb-2 shrink-0 text-xs md:text-sm" aria-hidden="true">
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">File</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Edit</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Search</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Help</span>
          </div>

          <div className="w-full flex-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-white p-4 md:p-6 overflow-y-auto text-black text-sm md:text-base leading-relaxed font-serif shadow-inner min-h-0">
            <h3 className="font-sans font-bold text-xl md:text-2xl mb-4 uppercase tracking-wider">About Me</h3>
            <p className="mb-4">
              I'm Juhi Damley, a Computer Science student at Claremont McKenna College (Class of 2028). During my college career, I've performed research under Prof. Gaston Espinosa and Prof. Benjamin Gillen, with a focus on computational finance, politics, and religion. Some projects I've built are Electoral Equilibrium, LectureTeX, and WakeMe. I'm also the founder and president of Girls Who Code at the Claremont Colleges. So far, most of what I've built aims to solve problems I've run into myself. In the future, I'd like that same instinct to eventually solve problems for other people too.
            </p>
            <p className="mb-2 font-sans text-sm">
              <span className="font-bold">Areas:</span> Machine Learning, Financial Engineering, Stochastic Modeling, Software Architecture
            </p>
            <p className="mb-2 font-sans text-sm">
              <span className="font-bold">Roles:</span> Software Engineer, Forward Deployed Engineer, Data Scientist, Product Manager
            </p>
            <p className="mb-4 font-sans text-sm">
              <span className="font-bold">Industries:</span> Finance, Consumer Technology, Social Media, Defense, AI
            </p>

            {/* Where to next — outbound CTA links (Win95 button chrome) */}
            <div className="mt-4 pt-3 border-t border-gray-400">
              <p className="font-sans font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">Where to next →</p>
              <nav aria-label="Explore more of Juhi's work" className="flex flex-wrap gap-2 font-sans">
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black text-xs md:text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
                >
                  📁 Projects
                </button>
                <button
                  onClick={() => navigate('/research')}
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black text-xs md:text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
                >
                  📊 Research
                </button>
                <button
                  onClick={() => navigate('/resume')}
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black text-xs md:text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
                >
                  📄 Résumé
                </button>
                <a
                  href="https://github.com/juhidamley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black text-xs md:text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
                >
                  💾 GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/juhidamley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 font-bold text-black text-xs md:text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
                >
                  👔 LinkedIn ↗
                </a>
              </nav>
            </div>
          </div>
        </RetroWindow>

        {/* MODULE 1: Bottom Left - Coursework (2 Columns Wide) */}
        <RetroWindow
          title="coursework.bat"
          icon="💻"
          windowId="coursework"
          className="md:col-span-2 h-64 md:h-80"
          bodyClassName="p-1 md:p-2"
        >
          <div className="w-full flex-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-black p-4 font-mono text-xs md:text-sm text-green-400 overflow-y-auto shadow-inner min-h-0">
            <p className="mb-2">C:\WINDOWS\SYSTEM32&gt; run_coursework.exe</p>
            <p className="mb-4">STEM: Computer Systems, Computability and Logic, Math of Political Districting, Digital Electronics & Computer Engineering, Stochastic Operations Research, Abstract Algebra, Data Structures/Program Development, Principles of Computer Science, Calculus III, Discrete Mathematics, Intro to Computer Science, Statistics, The Codes of Life, Linear Algebra</p>
            <p className="mb-2"></p>
            <p className="text-blue-400">Humanities: Religion, Politics, and Global Violence; Race/Religion in Hollywood Films; Intro American Politics; Shakespeare's Tragedies; Mystics, Prophets, & Social Change; Intermediate Microeconomics</p>
          </div>
        </RetroWindow>

        {/* MODULE 2: Bottom Right - Quick Facts (personality — lands after the credibility signals above) */}
        <RetroWindow
          title="quick_facts.txt"
          icon="📌"
          windowId="facts"
          className="md:col-span-1 h-64 md:h-80"
          bodyClassName="p-1 md:p-2"
        >
          <div className="w-full flex-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-[#ffffe1] p-4 text-black font-sans text-sm md:text-base overflow-y-auto shadow-inner min-h-0">
            <p className="font-bold mb-2 border-b border-gray-400 pb-1">Current Status</p>
            <ul className="list-disc pl-4 space-y-3 mt-3">
              <li>I used to study math as well, but dropped the major in favor of flexibility. Some areas I'm taking classes in for fun include engineering, government, pure and applied math, and religious studies.</li>
              <li>My favorite video game is The Sims 4. I also enjoy otomes and recently golf.</li>
              <li>I love cats and other cute animals!</li>
            </ul>
          </div>
        </RetroWindow>
      </div>

      <Taskbar />
    </div>
  );
}
