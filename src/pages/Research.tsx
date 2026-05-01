import { useNavigate } from 'react-router';
import { ReactNode, useState, useEffect } from 'react';

// Your Research Data
const RESEARCH_PROJECTS = [
  {
    id: '0',
    file: 'optindex.py',
    title: 'Optimized Indexation for Large-Scale Asset Allocation',
    org: 'Financial Economics Institute (FEI)',
    supervisor: 'Prof. Benjamin Gillen',
    role: 'Research Analyst',
    status: 'In Progress',
    abstract: 'Index-based investing is a primary method for determining portfolio weights in large asset universes, traditionally relying on signals like market capitalization or firm fundamentals. A defining feature of these strategies is the identification of relative weights up to a constant of proportionality, which allows for the creation of sub-indices from a subset of constituents without the need for reoptimization. This research applies mean-variance optimization to determine portfolio weights while strictly preserving this indexation property. By adapting Luce\'s Axiom for Probabilistic Choice—specifically the Independence of Irrelevant Alternatives—the paper defines an "optimized indexation" problem that remains robust to changes in the constitution of the asset universe.',
    methodology: 'The study evaluates two primary algorithmic approaches to maintaining the Index Property: Direct Index Optimization and Subset Optimization. Direct optimization maximizes an "Indexation Utility" function, which aggregates utilities across all possible sub-indices using Mean, Min, or alpha-Min aggregators. Because the number of sub-indices is combinatorially large, the authors utilize a stochastic convergence algorithm (Algorithm 1) to approximate the global objective. Alternatively, the Subset Optimization approach (Algorithm 2) averages optimized weights across randomly generated sub-indices to insulate the portfolio from estimation error and ensure the index property is satisfied as the asset universe grows. Performance is validated through calibrated simulations and rolling-window backtests using a universe of up to N=500 stocks, benchmarking against 1/N and market-cap weighted strategies.',
    docId: 'RES-FEI-094-A'
  },
  {
    id: '1',
    file: 'rrg_election.db',
    title: 'Religion, Race, Gender, and the Election: A Computational Analysis of 2024 Voter Behavior',
    org: 'The Gould Center for Humanistic Studies',
    supervisor: 'Prof. Gaston Espinosa',
    role: 'Research Assistant',
    status: 'In Progress',
    abstract: 'The 2024 iteration of the Religion, Race, and Gender (RRG) project, led by Professor Gaston Espinosa, explores the critical intersectional roles that faith, ethnicity, and gender played in the 2024 U.S. presidential election. The study specifically investigates how Donald Trump successfully increased his share of the vote among diverse demographics, including racial-ethnic minorities, Catholics, Evangelicals, and young working-class men. By addressing key questions such as why and how these factors influenced the final outcome, the research provides a comprehensive overview of the shifting social and institutional power structures within the contemporary American political landscape.',
    methodology: 'The 2024 iteration of this project utilizes a quantitative data analysis framework centered on results from the 2024 National Election Pool (NEP) Exit Poll. The methodology involves the systemic breakdown of a massive sample size (n = 22,966 voters) to compare voting patterns across various identity markers, including race, gender, religion, and age. These datasets are further analyzed through the lens of critical battleground states—such as Arizona, Georgia, and Pennsylvania—to triangulate how specific issues like the economy, democracy, and abortion influenced different demographic cohorts. This comparative approach allows for a longitudinal evaluation of electoral shifts from 2016 through 2024 to identify emerging trends in voter behavior.',
    docId: 'RES-GOULD-001-B'
  }
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
    {/* THE FIX: Added min-h-0 here to ensure children can scroll */}
    <div className="flex-1 flex flex-col min-h-0">{children}</div>
  </div>
);

export function Research() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(RESEARCH_PROJECTS[0]);
  
  // Terminal logging effect
  const [logTicks, setLogTicks] = useState(0);
  useEffect(() => {
    // Reset ticks when changing projects
    setLogTicks(0);
    const interval = setInterval(() => setLogTicks(t => t + 1), 1500);
    return () => clearInterval(interval);
  }, [activeProject.id]);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-teal-500 to-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <RetroWindow title="fei_data_analyzer.exe" icon="📊" className="w-full max-w-6xl h-[85vh] z-10">
        
        {/* Toolbar */}
        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-gray-500 shrink-0">
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Database</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Query</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Analyze</span>
          <span className="hover:bg-blue-800 hover:text-white px-1 cursor-pointer">Export</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 px-2 py-2 border-b-2 border-gray-500 bg-[#c0c0c0] shrink-0">
          <button className="flex items-center gap-1 border-t border-l border-t-white border-l-white border-b-black border-r-black px-2 py-1 text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
            <span>🗄️</span> Connect DB
          </button>
          <button className="flex items-center gap-1 border-t border-l border-t-white border-l-white border-b-black border-r-black px-2 py-1 text-xs font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
            <span>📈</span> Generate Model
          </button>
        </div>

        {/* THE FIX: Added min-h-0 to the main layout wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row p-2 gap-2 bg-[#c0c0c0] min-h-0 border-t-2 border-l-2 border-t-white border-l-white">
          
          {/* Left Pane: Directory of Research */}
          <div className="w-full lg:w-1/4 h-1/4 lg:h-full bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white overflow-y-auto p-2 flex flex-col gap-1 shadow-inner shrink-0">
            <p className="text-gray-500 text-xs mb-2 border-b border-gray-300 pb-1 font-bold uppercase">Databases</p>
            
            {RESEARCH_PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`flex items-center gap-2 px-2 py-1 text-sm text-left w-full transition-none ${
                  activeProject.id === project.id 
                    ? 'bg-[#000080] text-white border border-dotted border-white' 
                    : 'text-black hover:bg-gray-200 border border-transparent'
                }`}
              >
                <span>🗃️</span>
                <span className="truncate">{project.file}</span>
              </button>
            ))}
          </div>

          {/* Middle Pane: The Research Abstract */}
          <div className="w-full lg:w-2/4 h-[40%] lg:h-full bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white overflow-y-auto p-4 md:p-6 flex flex-col shadow-inner text-black font-serif min-h-0">
            
            <div className="border-b-2 border-black pb-2 mb-4 shrink-0">
              <p className="font-sans font-bold text-gray-500 text-xs tracking-widest uppercase mb-1">Current Initiative</p>
              <h1 className="text-xl md:text-2xl font-bold font-sans">{activeProject.title}</h1>
            </div>

            <div className="bg-[#ffffcc] border border-gray-400 p-3 mb-4 font-sans text-sm shadow-sm shrink-0">
              <p><span className="font-bold">Organization:</span> {activeProject.org}</p>
              <p><span className="font-bold">Supervisor:</span> {activeProject.supervisor}</p>
              <p><span className="font-bold">Role:</span> {activeProject.role}</p>
              <p><span className="font-bold">Status:</span> {activeProject.status}</p>
            </div>

            <h3 className="font-bold font-sans text-lg mb-2 shrink-0">Abstract</h3>
            <p className="mb-4 leading-relaxed text-sm md:text-base shrink-0">
              {activeProject.abstract}
            </p>

            <h3 className="font-bold font-sans text-lg mb-2 mt-2 shrink-0">Methodology</h3>
            <p className="mb-4 leading-relaxed text-sm md:text-base shrink-0">
              {activeProject.methodology}
            </p>

            <div className="mt-auto pt-6 shrink-0">
              <p className="text-xs font-sans text-gray-500">Document ID: {activeProject.docId}</p>
            </div>
          </div>

          {/* Right Pane: Simulated Terminal / Operations Console */}
          <div className="w-full lg:w-1/4 h-1/4 lg:h-full bg-black border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-3 font-mono text-xs text-green-400 overflow-hidden shadow-inner flex flex-col min-h-0">
            <div className="border-b border-green-800 pb-1 mb-2 shrink-0">
              <p className="uppercase">Data Console</p>
              <p className="text-gray-500">v2.1.4_STOCHASTIC</p>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col justify-end space-y-1">
              <p>&gt; Connecting to {activeProject.file}...</p>
              <p>&gt; Loading dataset [84.2 MB]</p>
              <p>&gt; Dataset loaded successfully.</p>
              <p>&gt; Applying optimization passes...</p>
              
              {/* Dynamic logging simulation */}
              {logTicks > 0 && <p className="text-yellow-400">&gt; Computing variance matrices... [Iteration {logTicks * 142}]</p>}
              {logTicks > 1 && <p>&gt; Constraint bounds verified.</p>}
              {logTicks > 2 && <p className="text-yellow-400">&gt; Optimizing structures... [{Math.min(100, logTicks * 12)}%]</p>}
              {logTicks > 3 && <p>&gt; Minimizing objective function Z...</p>}
              
              <p className="mt-2 animate-pulse">_</p>
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