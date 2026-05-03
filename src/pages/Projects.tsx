import { useNavigate } from 'react-router';
import { useState, ReactNode } from 'react';

// Your Project Data
const PROJECTS = [
  {
  id: 'lectureTex',
  file: 'lecturetex.py',
  title: 'LectureTex',
  tech: 'Python, FastAPI, Modal, Whisper, Claude AI, LaTeX, React, Electron, Vercel',
  desc: 'End-to-end pipeline that converts lecture audio and video into publication-quality LaTeX notes with a compiled PDF. Audio is transcribed using OpenAI Whisper on an A100 GPU via Modal, then Claude generates subject-aware structured notes — handling mathematical notation, theorem formatting, and proof structure automatically. Features an AI-driven LaTeX repair loop that parses compile errors and self-corrects the source before retrying. Deployed as both a Vercel web app and an Electron desktop app, backed by a FastAPI job server on DigitalOcean that manages the async GPU pipeline.',
  icon: '🎓',
  link: '/lecturetex/'
  },
  {
    id: 'prioritize',
    file: 'prioritize.exe',
    title: 'Prioritize (Queue Management)',
    tech: 'React, Vite, Tailwind CSS, Supabase, Node.js',
    desc: 'Prioritize is a high-performance task management application developed with TypeScript and React, designed to bridge the gap between complex workflows and intuitive user experience. Originally translated from a detailed Figma design, the platform features a secure authentication system powered by Supabase and a dynamic dashboard for real-time task tracking and organization. By leveraging a modular architecture with Shadcn UI and Vite, the project maintains a 96% type-safe codebase, ensuring a scalable, responsive, and reliable tool for professional productivity.',
    icon: '⚡',
    link: 'https://ptz.juhi.studio'
  },
  {
    id: 'espinosa',
    file: 'espinosa_portfolio.html',
    title: 'Gaston Espinosa Portfolio',
    tech: 'HTML, CSS, UI/UX Design',
    desc: 'A high-performance academic portfolio for Professor Gaston Espinosa using React and TypeScript. The site features dynamic course listings, a dedicated media gallery, and a responsive UI built with Shadcn components, all optimized for a seamless and accessible user experience.fessor Gaston Espinosa, focusing on clean design and accessible architecture.',
    icon: '🌐',
    link: null
  },
  {
    id: 'wakeMe',
    file: 'wake_me.app',
    title: 'Wake Me',
    tech: 'Swift, watchOS, iOS, Xcode',
    desc: 'WakeMe is a specialized accessibility utility developed in Swift for iOS and Apple Watch, specifically designed to support individuals managing narcolepsy and excessive daytime sleepiness. By leveraging biometric data to detect unintended sleep episodes, the app triggers immediate alerts through a dedicated watchOS companion app to wake the user. This project demonstrates a sophisticated use of cross-device synchronization and real-time monitoring within the Apple ecosystem to create a practical, life-enhancing tool for neurological health management.',
    icon: '⏰',
    link: "https://github.com/juhidamley/WakeMe"
  },
  {
    id: 'contactPrefs',
    file: 'contact_prefs.bat',
    title: 'Contact Prefs',
    tech: 'Python, Batchfile',
    desc: 'contactPrefs is a Python-based administrative utility developed for an advancement office to streamline the management of donor and constituent contact data. The project features a custom GUI that allows users to standardize complex file-naming conventions and preference updates with high precision and consistency. To ensure accessibility for non-technical staff, the application is wrapped in a Batchfile for one-click execution, transforming a sophisticated data-management script into a user-friendly, production-ready tool that enhances office workflow and data integrity.',
    icon: '💼',
    link: "https://github.com/juhidamley/contactPrefs"
  },
  {
    id: 'challengeVerse',
    file: 'challengeverse.html',
    title: 'The Sims 4 ChallengeVerse',
    tech: "React, Vite, Tailwind CSS, React Router, Firebase, and JavaScript.",
    desc: 'The Sims 4 ChallengeVerse is a dynamic web application built with React, Vite, and Firebase that serves as a centralized hub for the Sims 4 community to discover and track gameplay challenges. The platform features a robust, filterable directory with advanced multiselect tagging for categories like "Legacy" or "Rags to Riches," alongside interactive elements like celebratory animations to enhance the user experience. By leveraging Tailwind CSS for responsive styling and Firebase Hosting for deployment, the project demonstrates a high level of proficiency in full-stack frontend development and the ability to build functional, community-driven digital tools.',
    icon: '🎮',
    link: "https://github.com/juhidamley/ts4ChallengeVerse"
  },
  {
    id: 'ieEmployment',
    file: 'ie_employment.tex',
    title: 'Inland Empire and Imperial County Employment Disparities',
    tech: 'Python, LaTeX',
    desc: 'An economic research project that utilizes R to analyze regional labor market disparities between the Inland Empire and Imperial County. By deriving a custom "Job Opportunity Index" (JOI), the study assesses employment attainability by correlating commute data, census variables, and industry-specific employment statistics. The project features automated data visualizations and a comprehensive writeup that theorizes the structural differences in job access across Southern California, demonstrating proficiency in statistical modeling and geospatial economic analysis.',
    icon: '📈',
    link: "https://github.com/juhidamley/IE-Employment/tree/main"
  },
  {
    id: 'stylometry',
    file: 'stylometry.py',
    title: 'Stylometric Analysis of Haruki Murakami Translations',
    tech: 'Python',
    desc: 'A Python-based linguistic analysis project that utilizes Markov models to identify and compare the distinct stylistic "fingerprints" of different literary translators. By training models on two separate English translations of Haruki Murakami\'s Hard-Boiled Wonderland and the End of the World—one by Phillip Gabriel and another by Alfred Birnbaum—the program evaluates whether these specific stylistic traits persist across their other translated works. The project demonstrates a sophisticated application of natural language processing and statistical probability to quantify the influence of a translator\'s "voice" on a source text.',
    icon: '✍️',
    link: "https://github.com/juhidamley/cs5Final"
  },
  {
    id: 'spotifyStats',
    file: 'spotify_stats.py',
    title: 'Spotify Statistical Analysis',
    tech: 'Python, Pandas, Matplotlib',
    desc: 'A data science project that earned first place in the CMC Economics Department Spring 2025 Statistics Competition. Developed in Python, the application conducts a rigorous multi-variable regression analysis on a dataset of 900,000 songs to isolate the key determinants of musical popularity, such as energy, acousticness, and instrumentalness. By utilizing Pandas for data preprocessing and Matplotlib for trend visualization, the project transforms raw metadata into actionable economic insights, demonstrating a high-level command of statistical modeling and large-scale data analysis.',
    icon: '🎵',
    link: "https://github.com/juhidamley/spotify-stats"
  },
];

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

export function Projects() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  return (
    // REMOVED bg-[#0a001a] so fractal shows through the grid
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-600 to-pink-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <RetroWindow title="C:\My Documents\Projects" icon="📁" className="w-full max-w-5xl h-[80vh] z-10">
        
        {/* Toolbar */}
        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-gray-500 shrink-0">
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Edit</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">View</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        {/* Split Pane Interface */}
        <div className="flex-1 flex flex-col md:flex-row p-2 gap-2 overflow-hidden bg-[#c0c0c0]">
          
          {/* Left Pane: File Directory */}
          <div className="w-full md:w-1/3 h-1/3 md:h-full bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white overflow-y-auto p-2 flex flex-col gap-1 shadow-inner shrink-0">
            <p className="text-gray-500 text-xs mb-2 border-b border-gray-300 pb-1">Name</p>
            
            {PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`flex items-center gap-2 px-2 py-1 text-sm text-left w-full transition-none ${
                  activeProject.id === project.id 
                    ? 'bg-[#000080] text-white border border-dotted border-white' 
                    : 'text-black hover:bg-gray-200 border border-transparent'
                }`}
              >
                <span>{project.icon}</span>
                <span className="truncate">{project.file}</span>
              </button>
            ))}
          </div>

          {/* Right Pane: Project Details */}
          <div className="w-full md:w-2/3 h-2/3 md:h-full flex flex-col">
            <div className="w-full h-full bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black p-4 md:p-8 overflow-y-auto shadow-md">
              
              <div className="flex items-start gap-4 mb-6 border-b-2 border-gray-400 pb-4">
                <div className="text-5xl md:text-6xl drop-shadow-md">{activeProject.icon}</div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black mb-1">{activeProject.title}</h3>
                  <p className="text-sm font-mono text-gray-700 bg-white px-2 py-1 inline-block border border-gray-400 shadow-inner">
                    {activeProject.tech}
                  </p>
                </div>
              </div>

              <div className="bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-4 mb-6 shadow-inner text-black font-serif leading-relaxed">
                {activeProject.desc}
              </div>

              {/* Dynamic Action Button */}
              {activeProject.link && (
                <button 
                  onClick={() => window.location.href = activeProject.link!}
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-6 py-2 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 transition-none"
                >
                  <span>▶</span> Run {activeProject.file}
                </button>
              )}

            </div>
          </div>

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