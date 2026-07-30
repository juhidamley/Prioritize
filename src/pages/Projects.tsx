import { useState } from 'react';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';

// Your Project Data
const PROJECTS = [
  {
    id: 'electoralEquilibrium',
    file: 'electoral_equilibrium.py',
    title: 'Electoral Equilibrium',
    tech: 'Python, Mistral 7B (QLoRA), CVXPY (DQCP), NumPy/SciPy Monte Carlo, RoBERTa, Next.js, Modal/vLLM',
    desc: `Electoral Equilibrium is a stochastic-optimization research pipeline that models how a political party's winning voter coalition must structurally rebalance after a hypothetical political shock. It is prescriptive, not predictive — a Claremont McKenna SRP 2026 project advised by Prof. Gaston Espinosa.

  Three stages, streamed to the browser over Server-Sent Events:

  1. **Shock interpretation** — a fine-tuned Mistral 7B model (QLoRA, constrained decoding) estimates each demographic bloc's loyalty shift from free text.
  2. **Coalition optimization** — a CVXPY disciplined-quasiconvex optimizer rebalances race/ethnicity weights to maximize P(win).
  3. **Win-probability simulation** — a Monte Carlo simulation over a logistic-normal (ILR) distribution (N = 10,000+) yields P(win) with a 90% confidence interval.

  15 demographic blocs across three strata, calibrated on ~20 U.S. presidential cycles (1948–2024). A research tool, not an election forecast.`,
    icon: '🗳️',
    link: 'https://electoral.juhi.studio',
    writeup: 'electoral-equilibrium',
  },
  {
  id: 'lectureTex',
  file: 'lecturetex.py',
  title: 'LectureTeX',
  tech: 'Python, Faster Whisper, Anthropic Claude, NVIDIA NIM APIs, Modal (A100 serverless), DigitalOcean MCP, FastAPI, React, Vite, LaTeX, FFmpeg',
    desc: `LectureTeX is an end-to-end AI pipeline that turns lectures into publication-quality PDF study notes in minutes.

  It accepts three input types: live recordings, uploaded audio files, and cloud-sharing links.

  The pipeline runs on NVIDIA A100 GPUs via Modal serverless infrastructure and follows three stages:

  1. **Transcription**  
    Audio is transcribed with Faster Whisper (large-v3). Low-confidence spans are filtered, overlapping chunks are deduplicated, and uploaded/link-based media is pre-compressed with FFmpeg for faster transfer.
  2. **Note generation**  
    Transcripts are sent to an LLM (Claude, Llama, DeepSeek, Qwen, Mistral, Gemma, Phi, Nemotron, and others) using subject-aware prompts and a four-tier importance hierarchy.
  3. **Compilation and cleanup**  
    LaTeX output is deterministically cleaned (references, labels, operators, malformed blocks, markdown artifacts) and compiled with pdflatex using a full texlive install.

  Output depth is configurable:

  - **Concise:** 4-6 pages
  - **Standard:** 8-12 pages
  - **Detailed:** 14-18 pages

  LectureTeX runs as a web app at lecturetex.juhi.studio over a FastAPI backend, with GPU work dispatched to Modal A100s and orchestrated via DigitalOcean MCP.`,
  icon: '🎓',
  link: 'https://lecturetex.juhi.studio',
  writeup: 'lecturetex',
  },
  {
    id: 'devlog',
    file: 'devlog.md',
    title: 'devlog',
    tech: 'Next.js 15, React Three Fiber, Tiptap, Prisma, Postgres, Vercel Blob',
    desc: `devlog is a personal development journal where I document what I'm building and why. Posts are organized by 
    project and written in a custom admin CMS — a Tiptap rich-text editor backed by Prisma and Postgres, with image 
    uploads via Vercel Blob. The frontend is built with Next.js 15 App Router and leans into a brutalist aesthetic: 
    monospaced type, hard borders, and a live WebGL background rendered with React Three Fiber. It turns a simple journal
    into a fully self-hosted publishing stack — content model, rich-text editor, media pipeline, and rendering all built from scratch.`,
    icon: '📝',
    link: 'https://devlog.juhi.studio'
  },
  {
    id: 'prioritize',
    file: 'prioritize.exe',
    title: 'Prioritize (Queue Management)',
    tech: 'React, Vite, Tailwind CSS, Supabase, Node.js',
    desc: `Prioritize is a collaborative task manager built around a simple idea: deciding **what to do next** is harder than just writing tasks down.

  Instead of flat lists, work is organized into shared queues that can be ranked, reordered, and edited in real time.

  Core features include:

  - Pairwise ranking mode (Beli-inspired) powered by binary insertion sort
  - Nested tasks via sub-queues for breaking down large work
  - Six-color queue palettes for fast visual scanning
  - Live multi-user collaboration via Supabase realtime subscriptions
  - Google/GitHub auth plus guest mode with local storage

  The result is a deliberate, continuously updated priority stack for both personal and team workflows.`,
    icon: '⚡',
    link: 'https://ptz.juhi.studio'
  },
  {
    id: 'studio',
    file: 'studio.html',
    title: 'juhi.studio',
    tech: 'React, TypeScript, Vite, Tailwind CSS',
    desc: `juhi.studio is a custom personal portfolio and app platform.

  The homepage features a live Conway's Game of Life canvas with symbol-based cells, keyboard-accessible terminal navigation, and staged animation that transitions the hero into a command-style interface.

  Interior pages share a continuously panning Mandelbrot fractal layer and a responsive Windows 95-inspired UI system.

  Notable sections include:

  - **Projects:** two-pane file explorer experience
  - **Research:** simulated database terminal
  - **Contact:** retro messaging-style compose flow
  - **Study Tools:** includes a functional Pomodoro utility

  The platform also links to independently deployed companion apps (Prioritize and LectureTeX) and is deployed on Vercel with SPA rewrites and analytics.`,
    icon: '🖥️',
    link: 'https://juhi.studio'
  },
  {
    id: 'wakeMe',
    file: 'wake_me.app',
    title: 'Wake Me',
    tech: 'Swift, watchOS, iOS, Xcode',
    desc: `WakeMe is an accessibility-focused iOS + watchOS app built in Swift to support people managing narcolepsy and excessive daytime sleepiness.

  Using biometric signals to detect unintended sleep episodes, it triggers immediate wake alerts through an Apple Watch companion flow.

  The project emphasizes real-time monitoring, cross-device synchronization, and practical neurological health support in the Apple ecosystem.`,
    icon: '⏰',
    link: "https://github.com/juhidamley/WakeMe"
  },
  {
    id: 'contactPrefs',
    file: 'contact_prefs.bat',
    title: 'Contact Prefs',
    tech: 'Python, Batchfile',
    desc: `contactPrefs is a Python administrative utility built for advancement-office donor and constituent data workflows.

  It provides a custom GUI for standardizing complex file naming and preference updates with high consistency.

  To support non-technical staff, the tool is wrapped in a Batch script for one-click execution, turning a technical data process into a production-ready office utility.`,
    icon: '💼',
    link: "https://github.com/juhidamley/contactPrefs"
  },
  {
    id: 'challengeVerse',
    file: 'challengeverse.html',
    title: 'The Sims 4 ChallengeVerse',
    tech: "React, Vite, Tailwind CSS, React Router, Firebase, and JavaScript.",
    desc: `The Sims 4 ChallengeVerse is a community-focused web app for discovering and tracking Sims 4 gameplay challenges.

  Built with React, Vite, and Firebase, it includes a filterable challenge directory with multi-select tags (for categories like Legacy and Rags to Riches), plus playful UI interactions and celebratory feedback.

  Tailwind-based responsive styling and Firebase deployment round out a polished, production-grade frontend experience.`,
    icon: '🎮',
    link: "https://github.com/juhidamley/ts4ChallengeVerse"
  },
  {
    id: 'ieEmployment',
    file: 'ie_employment.tex',
    title: 'Inland Empire and Imperial County Employment Disparities',
    tech: 'Python, LaTeX',
    desc: `An economic research project analyzing labor market disparities between the Inland Empire and Imperial County.

  Using R, the study develops a custom **Job Opportunity Index (JOI)** by correlating commute behavior, census variables, and industry-level employment data.

  The deliverable includes automated visualizations and a full written analysis of structural differences in job access across Southern California.`,
    icon: '📈',
    link: "https://github.com/juhidamley/IE-Employment/tree/main"
  },
  {
    id: 'stylometry',
    file: 'stylometry.py',
    title: 'Stylometric Analysis of Haruki Murakami Translations',
    tech: 'Python',
    desc: `A Python NLP project that uses Markov models to compare translator-specific stylistic fingerprints.

  Models were trained on two English translations of *Hard-Boiled Wonderland and the End of the World* (Phillip Gabriel vs. Alfred Birnbaum), then tested for whether those stylistic signals persist across each translator's broader catalog.

  The work quantifies how translator voice can shape a source text in measurable ways.`,
    icon: '✍️',
    link: "https://github.com/juhidamley/cs5Final"
  },
  {
    id: 'spotifyStats',
    file: 'spotify_stats.py',
    title: 'Spotify Statistical Analysis',
    tech: 'Python, Pandas, Matplotlib',
    desc: `First-place project in the CMC Economics Department Spring 2025 Statistics Competition.

  Built in Python, it performs multivariable regression over a dataset of ~500,000 songs to isolate key predictors of popularity (including energy, acousticness, and instrumentalness).

  Pandas-based preprocessing and Matplotlib visual analysis turn large-scale streaming metadata into interpretable economic insights.`,
    icon: '🎵',
    link: "https://github.com/juhidamley/spotify-stats"
  },
];

export function Projects() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  return (
    // REMOVED bg-[#0a001a] so fractal shows through the grid
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 md:p-8 pb-16 relative font-sans">
      <h1 className="sr-only">Projects — Juhi Damley</h1>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-600 to-pink-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <RetroWindow title="C:\My Documents\Projects" icon="📁" windowId="projects" className="w-full max-w-5xl h-[80vh] z-10">

        {/* Toolbar */}
        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-gray-500 shrink-0" aria-hidden="true">
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-4 ml-5 list-disc">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                  }}
                >
                  {activeProject.desc}
                </ReactMarkdown>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {activeProject.link && (
                  <button
                    onClick={() => window.location.href = activeProject.link!}
                    className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-6 py-2 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 transition-none"
                  >
                    <span>▶</span> Run {activeProject.file}
                  </button>
                )}
                {(activeProject as any).writeup && (
                  <button
                    onClick={() => navigate(`/projects/${(activeProject as any).writeup}`)}
                    className="bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-6 py-2 font-bold text-black flex items-center gap-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300 transition-none"
                  >
                    <span>📄</span> Read the case study →
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </RetroWindow>

      <Taskbar />

    </div>
  );
}