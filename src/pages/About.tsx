import { useNavigate } from 'react-router';
import { ReactNode } from 'react';

// Reusable component for Windows 95 UI borders
const RetroWindow = ({ title, icon, children, className = '' }: { title: string, icon: string, children: ReactNode, className?: string }) => (
  <div className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-xl ${className}`}>
    {/* Title Bar */}
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
      </div>
      {/* Window Controls */}
      <div className="flex gap-1 shrink-0 ml-2">
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">_</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center">□</button>
        <button className="bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center hover:bg-red-400">X</button>
      </div>
    </div>
    {/* Content Area */}
    <div className="p-1 md:p-2 flex-1 flex flex-col">{children}</div>
  </div>
);

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a001a] bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-yellow-400 to-pink-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Main Grid Layout - INCREASED GAP (gap-8 md:gap-12) AND MAX-WIDTH (max-w-6xl) */}
      <div className="w-full max-w-6xl z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative pb-16">
        {/* MODULE 3: Top - Full Width Notepad */}
        <RetroWindow title="readme.txt - Notepad" icon="📝" className="md:col-span-3 min-h-[40vh]">
          {/* Notepad Toolbar */}
          <div className="flex gap-4 px-2 pb-1 border-b border-gray-500 mb-2 shrink-0 text-xs md:text-sm">
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">File</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Edit</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Search</span>
            <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Help</span>
          </div>

          <div className="w-full flex-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-white p-4 md:p-6 overflow-y-auto text-black text-sm md:text-base leading-relaxed font-serif shadow-inner">
            <h3 className="font-sans font-bold text-xl md:text-2xl mb-4 uppercase tracking-wider">About Me</h3>
            <p className="mb-4">
              Hello, my name is Juhi Damley, and I am a student at Claremont McKenna College graduating in 2028. I am majoring in Computer Science. I am a curious individual eager to learn more. As evidenced by my diverse research and project history, I am versatile and have enjoyed working across a variety of subjects.
            </p>
            <p className="mb-4">
              Areas of curiosity: Stochastic Modeling, Software Architecture, UI/UX Design, Operating Systems, Bioinformatics, Machine Learning, Financial Engineering, Databases
            </p>
            <p className="mb-4">
              Roles of curiosity: Product Manager, Software Engineer, Data Scientist, Product Builder, Quantitative Developer
            </p>
            <p className="mb-4">
              Industries of curiosity: Autonomous Vehicles, Defense, Pharmaceuticals, Consumer Technology, Finance, Social Media, Government
            </p>
          </div>
        </RetroWindow>

        {/* MODULE 1: Bottom Left - Coursework (2 Columns Wide) */}
        <RetroWindow title="coursework.bat" icon="💻" className="md:col-span-2 h-64 md:h-80">
          <div className="w-full h-full border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-black p-4 font-mono text-xs md:text-sm text-green-400 overflow-y-auto shadow-inner">
            <p className="mb-2">C:\WINDOWS\SYSTEM32&gt; run_coursework.exe</p>
            <p className="mb-4">STEM: Stochastic Operations Research, Abstract Algebra, Data Structures/Program Development, Principles of Computer Science, Calculus III, Discrete Mathematics, Intro to Computer Science, Statistics, The Codes of Life, Linear Algebra</p>
            <p className="mb-2"></p>
            <p className="text-blue-400">Humanities: Religion, Politics, and Global Violence; Race/Religion in Hollyvood Films; Intro American Politics: Shakespeare's Tragedies; Mystics, Prophets, ₺ Social Change; Intermediate Microeconomics</p>
          </div>
        </RetroWindow>

        {/* MODULE 2: Bottom Right - Quick Facts (1 Column Wide) */}
        <RetroWindow title="quick_facts.txt" icon="📌" className="md:col-span-1 h-64 md:h-80">
          {/* Pale yellow background to mimic a retro sticky note / text pad */}
          <div className="w-full h-full border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-[#ffffe1] p-4 text-black font-sans text-sm md:text-base overflow-y-auto shadow-inner">
            <p className="font-bold mb-2 border-b border-gray-400 pb-1">Current Status</p>
            <ul className="list-disc pl-4 space-y-3 mt-3">
              <li>Studying CS at Claremont McKenna via Harvey Mudd</li>
              <li>I used to study math as well, but dropped the major in favor of flexibility. Some areas I'm taking classes in for fun include engineering, government, pure and applied math, and religious studies.</li>
              <li>My favorite video game is The Sims 4. I also enjoy otomes and Assassin's Creed.</li>
              <li>I love cats and other cute animals!</li>
            </ul>
          </div>
        </RetroWindow>

      </div>

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