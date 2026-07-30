import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';
// Verified stratum weights from the Electoral Equilibrium computational work
// (iterative proportional fitting over ~20 presidential cycles, 1948–2024).
// See src/content/metrics.ts for the same figures.
const LAMBDA_DATA = [
  { stratum: 'Race', weight: 0.114, fill: '#e06666' },
  { stratum: 'Religion', weight: 0.224, fill: '#6fa8dc' },
  { stratum: 'Gender', weight: 0.662, fill: '#93c47d' },
];

// Your Research Data
const RESEARCH_PROJECTS = [
  {
    id: '2',
    file: 'electoral_equilibrium.py',
    title: 'Electoral Equilibrium: Modeling Demographic Coalition Dynamics Under Political Shocks',
    org: 'Claremont McKenna College — Summer Research Program',
    supervisor: 'Prof. Gaston Espinosa',
    role: 'Independent Researcher',
    status: 'In Progress',
    abstract: 'Political shocks—scandals, court rulings, foreign-policy events—do not move the electorate uniformly; they redistribute support unevenly across demographic blocs defined by race, religion, and gender. This project develops an end-to-end computational pipeline that models how a hypothetical shock reshapes a party\'s coalition and what strategic reweighting is required to remain electorally viable. A central methodological challenge is data scarcity: with only roughly twenty presidential cycles available, no observational dataset maps shocks to per-bloc loyalty shifts. The work addresses this through a hybrid training corpus—expert-designed event archetypes expanded into synthetic examples, augmented by observed social-media reactions—and confronts the resulting question of how to validate a counterfactual model of events that have not occurred and carry no polling.',
    methodology: 'A shock description and target party are passed to a fine-tuned language model (Mistral 7B, adapted via QLoRA with constrained decoding) that predicts per-bloc loyalty deltas across fifteen demographic strata. A convex optimizer (CVXPY, disciplined quasiconvex programming) rebalances racial-bloc coalition weights to maximize effective loyalty against an Electoral-College-adjusted win threshold, and an isometric-log-ratio Monte Carlo simulation propagates uncertainty via a Ledoit-Wolf-shrunk covariance to produce win probabilities with confidence intervals. Demographic baselines are reconciled from a multi-source survey merge (NEP, ANES, CES, GSS, NPORS, VOTER Panel) via inverse-standard-error weighting. The pipeline is deployed as a live web application. Model neutrality is assessed through a structural null-shock symmetry test, and predictions are evaluated out-of-sample against roughly 300,000 scored real-world social reactions across fifty-one events the model never trained on. Ongoing work extends the training corpus toward observed-reaction grounding and develops an expert-elicitation framework for validation where ground-truth deltas are unavailable.',
    docId: 'RES-CMC-114-C'
  },
  {
    id: '0',
    file: 'optindex.py',
    title: 'Optimized Indexation for Large-Scale Asset Allocation',
    org: 'Financial Economics Institute (FEI)',
    supervisor: 'Prof. Benjamin Gillen',
    role: 'Research Analyst',
    status: 'Complete',
    abstract: 'Index-based investing is a primary method for determining portfolio weights in large asset universes, traditionally relying on signals like market capitalization or firm fundamentals. A defining feature of these strategies is the identification of relative weights up to a constant of proportionality, which allows for the creation of sub-indices from a subset of constituents without the need for reoptimization. This research applies mean-variance optimization to determine portfolio weights while strictly preserving this indexation property. By adapting Luce\'s Axiom for Probabilistic Choice—specifically the Independence of Irrelevant Alternatives—the paper defines an "optimized indexation" problem that remains robust to changes in the constitution of the asset universe.',
    methodology: 'The study evaluates two primary algorithmic approaches to maintaining the Index Property: Direct Index Optimization and Subset Optimization. Direct optimization maximizes an "Indexation Utility" function, which aggregates utilities across all possible sub-indices using Mean, Min, or alpha-Min aggregators. Because the number of sub-indices is combinatorially large, the authors utilize a stochastic convergence algorithm (Algorithm 1) to approximate the global objective. Alternatively, the Subset Optimization approach (Algorithm 2) averages optimized weights across randomly generated sub-indices to insulate the portfolio from estimation error and ensure the index property is satisfied as the asset universe grows. Performance is validated through calibrated simulations and rolling-window backtests using a universe of up to N=500 stocks, benchmarking against 1/N and market-cap weighted strategies.',
    finding: 'On the Ken French 48-industry data (1973–2023, annual rebalancing), the long-only Global Minimum Variance portfolio beat the 1/N benchmark — Sharpe 1.03 vs 0.76 and max drawdown −33% vs −53% at a 30-name universe. Built as a fully reproducible CVXPY/OSQP pipeline with a subset-optimization method for scaling to large universes.',
    writeup: 'optimized-indexation',
    docId: 'RES-FEI-094-A'
  },
  {
    id: '1',
    file: 'rrg_election.db',
    title: 'Religion, Race, Gender, and the Election: A Computational Analysis of 2024 Voter Behavior',
    org: 'The Gould Center for Humanistic Studies',
    supervisor: 'Prof. Gaston Espinosa',
    role: 'Research Assistant',
    status: 'Complete',
    abstract: 'The 2024 iteration of the Religion, Race, and Gender (RRG) project, led by Professor Gaston Espinosa, explores the critical intersectional roles that faith, ethnicity, and gender played in the 2024 U.S. presidential election. The study specifically investigates how Donald Trump successfully increased his share of the vote among diverse demographics, including racial-ethnic minorities, Catholics, Evangelicals, and young working-class men. By addressing key questions such as why and how these factors influenced the final outcome, the research provides a comprehensive overview of the shifting social and institutional power structures within the contemporary American political landscape.',
    methodology: 'The 2024 iteration of this project utilizes a quantitative data analysis framework centered on results from the 2024 National Election Pool (NEP) Exit Poll. The methodology involves the systemic breakdown of a massive sample size (n = 22,966 voters) to compare voting patterns across various identity markers, including race, gender, religion, and age. These datasets are further analyzed through the lens of critical battleground states—such as Arizona, Georgia, and Pennsylvania—to triangulate how specific issues like the economy, democracy, and abortion influenced different demographic cohorts. This comparative approach allows for a longitudinal evaluation of electoral shifts from 2016 through 2024 to identify emerging trends in voter behavior.',
    finding: 'Breaks down the 2024 National Election Pool exit poll (n=22,966) across race, religion, gender, and age to quantify how vote share shifted among racial-ethnic minorities, Catholics, Evangelicals, and young working-class men across battleground states.',
    docId: 'RES-GOULD-001-B'
  }
];

export function Research() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(RESEARCH_PROJECTS[0]);
  const showChart = activeProject.file === 'electoral_equilibrium.py';

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 pb-16 relative font-sans">
      <h1 className="sr-only">Research — Juhi Damley</h1>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-teal-500 to-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <RetroWindow title="fei_data_analyzer.exe" icon="📊" windowId="research" className="w-full max-w-6xl h-[85vh] z-10">

        {/* Toolbar */}
        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-gray-500 shrink-0" aria-hidden="true">
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
              <h2 className="text-xl md:text-2xl font-bold font-sans">{activeProject.title}</h2>
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

          {/* Right Pane: Real findings / data-viz */}
          <div className="w-full lg:w-1/4 h-1/3 lg:h-full bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-3 overflow-y-auto shadow-inner flex flex-col min-h-0 text-black font-sans">
            <p className="uppercase text-xs font-bold text-gray-500 border-b border-gray-300 pb-1 mb-3 shrink-0">Findings</p>

            {showChart ? (
              <>
                <p className="text-xs font-bold mb-1">Raked stratum weights (λ)</p>
                <p className="text-[10px] text-gray-500 mb-2">IPF over ~20 cycles (1948–2024)</p>
                <div style={{ width: '100%', height: 160 }} className="shrink-0" aria-label="Bar chart of raked stratum weights: race 0.114, religion 0.224, gender 0.662">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={LAMBDA_DATA} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                      <XAxis dataKey="stratum" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 0.7]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => Number(v).toFixed(3)} cursor={{ fill: 'rgba(0,0,128,0.06)' }} />
                      <Bar dataKey="weight" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                        {LAMBDA_DATA.map((d) => (
                          <Cell key={d.stratum} fill={d.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-gray-600 mt-3 leading-snug">
                  Gender carries the highest cross-cycle variance — a calibration result recovering the documented
                  growth of the gender gap, not a claim it matters most at the individual level.
                </p>
                <a
                  href="https://electoral.juhi.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-700 underline mt-3 shrink-0"
                >
                  ▶ Try the interactive model ↗
                </a>
              </>
            ) : (
              <div className="text-xs text-gray-700 space-y-2">
                <p className="font-bold">Status: {activeProject.status}</p>
                {(activeProject as any).finding && (
                  <div className="pb-2 border-b border-gray-200">
                    <p className="font-bold text-[#4a4a9a] mb-1">Key finding</p>
                    <p className="text-gray-700 leading-snug">{(activeProject as any).finding}</p>
                  </div>
                )}
                <p>{activeProject.org}</p>
                <p className="text-gray-500">Supervisor: {activeProject.supervisor}</p>
                {(activeProject as any).writeup && (
                  <button
                    onClick={() => navigate(`/projects/${(activeProject as any).writeup}`)}
                    className="text-blue-700 underline text-xs mt-2 block"
                  >
                    ▶ Read the full case study →
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </RetroWindow>

      <Taskbar />

    </div>
  );
}