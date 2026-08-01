// Structured, factual source content for the prerendered project writeup pages.
// Consumed by scripts/prerender-writeups.mjs at build time to emit static,
// crawlable HTML at dist/projects/<slug>/index.html.
//
// GROUNDING RULE: every number here is sourced from the project's own repo docs
// or code. Anything unverifiable is marked `TO DO(juhi):` and must be filled in
// (or removed) before publishing — never invent metrics.

export const SITE = 'https://juhi.studio';
export const AUTHOR = 'Juhi Damley';

export const writeups = [
  {
    slug: 'electoral-equilibrium',
    name: 'Electoral Equilibrium',
    // Phrased as an answer to a natural-language question people actually ask.
    title: 'Electoral Equilibrium — an ML pipeline for modeling voter-coalition shifts after political shocks',
    description:
      'Electoral Equilibrium is a machine-learning research pipeline (fine-tuned Mistral 7B, CVXPY optimization, Monte Carlo simulation) that models how a party’s winning voter coalition must rebalance after a hypothetical political shock. By Juhi Damley (CMC, advised by Prof. Gaston Espinosa).',
    liveUrl: 'https://electoral.juhi.studio',
    repoUrl: 'https://github.com/juhidamley/electoral-equilibrium',
    languages: ['Python', 'TypeScript'],
    appCategory: 'Research / DeveloperApplication',
    // TO DO(juhi): record a ~15s screen capture of the live demo and drop it at
    // public/assets/demos/electoral-equilibrium.mp4, then set src below.
    demo: { src: null, poster: null, caption: 'Type a shock → watch the coalition rebalance and the win-probability update live.' },
    // One dense direct-answer sentence — no throat-clearing.
    lede:
      'Electoral Equilibrium is a stochastic-optimization pipeline that reads a plain-text political shock, uses a fine-tuned Mistral 7B model to estimate how each demographic bloc’s loyalty shifts, then computes—via convex optimization and Monte Carlo simulation—how a party’s winning coalition must rebalance and its probability of still winning with a 90% confidence interval.',
    context:
      'Built as a Claremont McKenna College Summer Research Program (SRP) 2026 project, advised by Prof. Gaston Espinosa. It is prescriptive, not predictive: rather than forecasting who will win, it asks what a coalition would have to change to still win if the world shifted overnight. It is a research tool, not an election forecast.',
    sections: [
      {
        h2: 'How it works',
        body:
          'The system runs a three-stage pipeline, streamed to the browser over Server-Sent Events (SSE) so each stage appears as it completes:',
        steps: [
          'Shock interpretation — a fine-tuned Mistral 7B model (QLoRA, with constrained/structured decoding) reads free text describing an event and estimates a per-stratum loyalty shift (Δμ) for every demographic bloc.',
          'Coalition optimization — a CVXPY disciplined-quasiconvex (DQCP) optimizer rebalances the race/ethnicity weights to maximize the probability of winning, subject to feasibility constraints, and returns the new optimal weights plus a feasibility flag.',
          'Win-probability simulation — a Monte Carlo simulation over a logistic-normal (isometric-log-ratio, ILR) distribution with N = 10,000+ draws produces a point estimate of P(win) with a 90% confidence interval.',
        ],
      },
      {
        h2: 'Demographic architecture',
        body:
          'The electorate is partitioned into 15 demographic blocs across three parallel strata — Race/ethnicity (5 groups), Religion (7 groups), and Gender (3 groups). These are parallel marginal tables, not nested cross-tabulations, which keeps the model tractable given severe data scarcity. Only the race/ethnicity stratum holds the optimizer’s decision variables; the other strata contribute fixed-weight terms to the effective metric.',
      },
      {
        h2: 'Technical stack',
        table: [
          ['Shock model', 'Fine-tuned Mistral 7B (QLoRA / PEFT), constrained decoding'],
          ['Optimization', 'CVXPY, disciplined quasiconvex programming (DQCP)'],
          ['Simulation', 'Monte Carlo over logistic-normal (ILR), NumPy / SciPy'],
          ['Signal / NLP layer', 'RoBERTa scoring; social + news collection via Bluesky and Apify'],
          ['Frontend', 'Next.js (App Router), server-side rendered, SSE streaming'],
          ['Inference / infra', 'Modal / vLLM inference backend'],
        ],
      },
      {
        h2: 'Results & validation',
        body:
          'Calibration uses iterative proportional fitting (IPF) over roughly 20 U.S. presidential cycles (1948–2024). IPF converged in 2 iterations to raked stratum weights of race 0.114, religion 0.224, and gender 0.662 — recovering the well-documented growth of the gender gap from first principles. This is a model-calibration result reflecting cross-cycle temporal variance, not a claim that gender matters more than race at the individual level (African American party loyalty, for instance, has been a stable 87–92% since 1964). TODO(juhi): add any held-out backtest or win-probability calibration metrics you want to cite publicly.',
      },
      {
        h2: 'Limitations',
        body:
          'The central constraint is data scarcity: only ~20 modern presidential elections exist, so the architecture is built to work around roughly 20 data points rather than learn freely from history. λ weights are aggregate-level regression coefficients subject to the ecological fallacy, not individual-level causal effects. The additive-independence assumption across strata does not model intersectional interactions (e.g. Latino Evangelical women). The tool estimates equilibria under stated assumptions; it is explicitly not a forecast of real election outcomes.',
      },
    ],
    faq: [
      {
        q: 'What is Electoral Equilibrium?',
        a: 'A machine-learning research pipeline that models how a political party’s winning voter coalition must structurally rebalance after a hypothetical shock, and estimates the probability of still winning. It combines a fine-tuned Mistral 7B model, CVXPY convex optimization, and Monte Carlo simulation.',
      },
      {
        q: 'Who built Electoral Equilibrium and is it a forecast?',
        a: 'It was built by Juhi Damley as a Claremont McKenna College Summer Research Program 2026 project, advised by Prof. Gaston Espinosa. It is a prescriptive research tool, not an election forecast.',
      },
      {
        q: 'What machine-learning methods does it use?',
        a: 'A fine-tuned Mistral 7B model (QLoRA) with constrained decoding for shock interpretation, CVXPY disciplined-quasiconvex optimization for coalition rebalancing, and Monte Carlo simulation over a logistic-normal (ILR) distribution for win-probability estimation.',
      },
    ],
  },

  {
    slug: 'lecturetex',
    name: 'LectureTeX',
    title: 'LectureTeX — convert lecture audio and video into structured LaTeX PDF notes',
    description:
      'LectureTeX is a web app that turns lecture audio or video into structured, compile-ready LaTeX PDF study notes — faster-whisper transcription on Modal A100 GPUs, single-pass note generation with your choice of LLM, and an automated LaTeX compile-repair loop. By Juhi Damley.',
    liveUrl: 'https://lecturetex.juhi.studio',
    repoUrl: 'https://github.com/juhidamley/lecturetex',
    languages: ['Python', 'TypeScript'],
    appCategory: 'DeveloperApplication / EducationalApplication',
    // to do record a ~15s screen capture (lecture audio → compiled PDF) at
    // public/assets/demos/lecturetex.mp4, then set src below.
    demo: { src: null, poster: null, caption: 'A lecture recording becomes a structured, compile-ready LaTeX PDF.' },
    lede:
      'LectureTeX is a web app that turns lecture audio or video into structured, compile-ready LaTeX study notes. It transcribes the recording with faster-whisper (large-v3) on an A100, turns that transcript into focused notes using an LLM of your choice, then compiles clean LaTeX automatically — repairing its own errors if a compile fails.',
    context:
      'LectureTeX produces focused notes rather than a raw transcript dump — roughly 8–12 pages for a ~50-minute lecture at standard depth, configurable down to 5–8 pages (concise) or up to 12–18 (detailed). It runs entirely as a web app at lecturetex.juhi.studio: record from your mic, upload a video or audio file, paste a transcript, or drop in a Dropbox, Box, or Drive share link, and it returns a compiled PDF with no local LaTeX toolchain required. A "PDF/textbook" input tab exists in the UI but isn’t fully wired end-to-end yet.',
    sections: [
      {
        h2: 'How it works',
        body: 'LectureTeX runs a staged pipeline, entirely inside a single Modal A100 function, that carries a lecture from raw audio to a compiled PDF:',
        steps: [
          'Transcription. faster-whisper (large-v3) transcribes the lecture audio on a Modal A100 GPU using float16 precision and a beam size of 2 — the project’s own docs put this at roughly 30–45 seconds, versus 4–8 minutes on a laptop. Segments with an average log-probability below ‑1.0 are treated as low-confidence and dropped.',
          'Note generation. A single subject-aware LLM call turns the transcript into structured notes, preserving definitions, theorems, and worked examples while compressing filler. You choose the model — Claude Haiku 4.5 or Sonnet 4.6 via Anthropic, or one of eight NVIDIA NIM models (Llama 3.3 70B, Llama 3.1 405B, Nemotron Ultra 253B, DeepSeek-R1, Gemma 3 27B, Qwen3-Coder 480B, Mistral Large 2, or Phi-4) — ten models in total.',
          'Structured rendering. The notes are wrapped in a LaTeX preamble built around a tcolorbox callout system — including dedicated exam-logistics and exam-content boxes — amsthm theorem environments, and TikZ/pgfplots, producing visually structured, exam-ready output.',
          'Compile with automated repair. pdflatex runs inside the Modal container, a CUDA and Python 3.11 image with a full TeX Live install. If a compile fails, the errors are parsed with source context and sent to Qwen2.5-Coder (via NVIDIA NIM) to fix — up to three pdflatex passes per round across two repair rounds — and the best PDF produced is returned.',
        ],
      },
      {
        h2: 'From local CLI to web app',
        body:
          'LectureTeX didn’t start out this way. The original version was a local Python CLI built around faster-whisper transcription, a hand-built four-tier content-importance classifier (core material, supporting context, reference-only, or skip), and compilation through the VSCode LaTeX Workshop extension, all wrapped in an Electron desktop GUI. That code still lives in the repo for reference, but it’s no longer what’s deployed: the live product runs the pipeline above — a single Modal function behind a FastAPI job broker — and the CLI, the four-tier classifier, and the Electron app are legacy.',
      },
      {
        h2: 'Technical stack',
        table: [
          ['Transcription', 'faster-whisper (large-v3) on a Modal A100 GPU'],
          ['Note generation', 'Choice of 10 models — Claude (Haiku 4.5 / Sonnet 4.6) via Anthropic, or 8 NVIDIA NIM models (Llama, DeepSeek, Qwen, Nemotron, Gemma, Mistral, Phi)'],
          ['Document generation', 'LaTeX with tcolorbox callouts and TikZ/pgfplots'],
          ['Compilation', 'pdflatex in a Modal container (full TeX Live), with an LLM error-repair loop (Qwen2.5-Coder via NVIDIA NIM)'],
          ['Media handling', 'ffmpeg (compression), aria2c (link downloads)'],
          ['Interface', 'Web app (React + Vite, hosted on Vercel)'],
          ['Orchestration', 'Vercel proxy → FastAPI job broker on a DigitalOcean droplet → Modal A100'],
        ],
      },
      {
        h2: 'Results & validation',
        body:
          'Output depth is configurable — standard runs 8–12 pages, concise 5–8, and detailed 12–18 pages per ~50-minute lecture, compared with 40+ pages under uniform compression. The automated compile-repair loop, up to three pdflatex passes per round across two LLM repair rounds, returns a finished PDF without any manual LaTeX fixing. '
        // TO DO(juhi): add a measured compile-success rate or transcription-accuracy figure if you want to cite one — none is currently logged or benchmarked in the repo.',
      },
      {
        h2: 'Limitations',
        body:
          'Everything runs server-side through the web app, so there’s no local LaTeX install to manage. Transcription quality still depends on audio clarity, and heavily non-standard notation or cross-talk can require manual review. The compile-repair loop is best-effort, not a guarantee. Two known gaps as of this writing: the "PDF/textbook" input tab and the custom-instructions field both exist in the UI but aren’t fully wired end-to-end yet.',
      },
    ],
    faq: [
      {
        q: 'What is LectureTeX?',
        a: 'A web app that converts lecture audio or video into structured, compile-ready LaTeX PDF study notes. It transcribes with faster-whisper on an A100, turns the transcript into focused notes with your chosen LLM, and produces LaTeX that compiles automatically — repairing its own errors when needed.',
      },
      {
        q: 'How does LectureTeX turn a lecture into LaTeX notes?',
        a: 'It transcribes the audio with faster-whisper (large-v3) on a Modal A100, sends the transcript to your chosen model in a single subject-aware call, wraps the result in a LaTeX preamble with tcolorbox callouts and TikZ, then compiles it with pdflatex — automatically repairing errors with Qwen2.5-Coder if the first compile fails.',
      },
      {
        q: 'How long are the notes LectureTeX produces?',
        a: 'Roughly 8–12 pages for a 50-minute lecture at standard depth, configurable to 5–8 pages (concise) or 12–18 pages (detailed) — instead of a 40+ page uniform transcript.',
      },
      {
        q: 'Did LectureTeX always work this way?',
        a: 'No. It started as a local CLI with a four-tier content classifier and an Electron GUI, compiling through VSCode’s LaTeX Workshop extension. It’s since been rebuilt as a serverless web app, where a single Modal A100 function handles transcription, note generation, and LaTeX compilation, invoked by a FastAPI job broker on a DigitalOcean droplet behind a Vercel-hosted frontend.',
      },
    ],
  },

  {
    slug: 'optimized-indexation',
    name: 'Optimized Indexation',
    title: 'Optimized Indexation — a reproducible pipeline for large-scale portfolio construction',
    description:
      'Optimized Indexation is a reproducible, contract-driven research pipeline (CVXPY/OSQP) that builds and backtests large-universe stock portfolios — including a subset-optimization method for scaling — benchmarked against 1/N and value-weighted baselines. FEI research by Juhi Damley, advised by Prof. Benjamin Gillen.',
    liveUrl: null,
    repoUrl: null,
    languages: ['Python'],
    appCategory: 'Research',
    lede:
      'Optimized Indexation is a reproducible, contract-driven research pipeline that builds and backtests large-universe stock portfolios — solving long-only minimum-variance and mean-variance problems as convex programs (CVXPY / OSQP), including a subset-optimization method that scales optimization to large universes by solving many small sub-portfolios and averaging them.',
    context:
      'A Financial Economics Institute research project advised by Prof. Benjamin Gillen. The question: can portfolio optimization scale to large asset universes — where a full covariance optimization is ill-conditioned — while still beating naive benchmarks like equal-weight (1/N)? The pipeline is engineered so every result is byte-for-byte reproducible: a single JSON config fully specifies a run, and a SHA-256 "run key" derived from it guarantees the same inputs always produce the same output.',
    sections: [
      {
        h2: 'How it works',
        body:
          'A six-stage, checkpointed pipeline — data → universe → moments → portfolios → backtest → metrics. Each stage reads the previous stage’s artifact and emits its own schema-versioned JSON, so runs resume safely and stay auditable.',
        steps: [
          'Universe & moments — rank stocks by market cap into top-N universes and estimate return means and covariances over a rolling 120-month window.',
          'Portfolio construction — solve long-only Global Minimum Variance (minimize wᵀΣw) and Mean-Variance (maximize μᵀw − (λ/2)·wᵀΣw) as convex programs via CVXPY with the OSQP solver, subject to fully-invested, no-short constraints.',
          'Subset optimization — to scale to large universes, deterministically sample B random subsets of size ñ, solve each small sub-problem, lift the weights back to the full universe, then average and project onto the long-only simplex.',
          'Backtest & metrics — a no-look-ahead engine with delisting-adjusted returns rebalances annually and reports annualized mean/volatility, Sharpe, certainty-equivalent, and max drawdown against 1/N and value-weighted baselines.',
        ],
      },
      {
        h2: 'Technical stack',
        table: [
          ['Language', 'Python 3.10+'],
          ['Optimization', 'CVXPY with the OSQP solver (long-only convex programs)'],
          ['Data', 'NumPy, pandas, PyArrow (Parquet panels)'],
          ['Methods', 'Equal-weight, value-weight, GMV, mean-variance, subset-GMV, subset-MV'],
          ['Reproducibility', 'Config-as-contract + SHA-256 run keys; schema-versioned JSON artifacts'],
          ['Testing', 'pytest — 115 tests incl. determinism; ruff'],
          ['Scale', 'CRSP monthly data 1973–2023; HPC run on the Rutgers Hopper cluster (SLURM)'],
        ],
      },
      {
        h2: 'Results & validation',
        body:
          'On the Ken French 48-industry dataset (1973–2023, annual rebalancing), the long-only Global Minimum Variance portfolio beat the 1/N equal-weight benchmark on both risk-adjusted return and drawdown: at a 30-name universe, Sharpe 1.03 vs 0.76 and maximum drawdown −33% vs −53%. Reproducibility is test-enforced — identical configs produce byte-identical outputs — and a full 51-year CRSP-scale run completed on the Rutgers Hopper cluster in under an hour on a single CPU.'
        // TO DO(juhi): add the CRSP paper-baseline results (N = 100 / 250 / 500) once they are published to the repo.',
      },
      {
        h2: 'Limitations',
        body:
          'This is an actively-developed research scaffold (v0.1). The subset-optimization method is implemented but its large-universe results are still being finalized; Direct Index Optimization and turnover metrics are specified but not yet implemented; the covariance estimator is the sample estimator; and the headline CRSP paper-baseline numbers currently live on the HPC cluster rather than in the public repo.',
      },
    ],
    faq: [
      {
        q: 'What is Optimized Indexation?',
        a: 'A reproducible research pipeline for building and backtesting large-universe stock portfolios, developed at the Financial Economics Institute under Prof. Benjamin Gillen. It solves long-only minimum-variance and mean-variance problems with CVXPY/OSQP and includes a subset-optimization method for scaling to large universes.',
      },
      {
        q: 'What is the subset-optimization approach?',
        a: 'Instead of one large, ill-conditioned covariance optimization over the whole universe, it deterministically samples many small subsets of assets, solves each sub-problem, lifts the weights back to the full universe, and averages them onto the long-only simplex — a route to scaling optimization to large N.',
      },
      {
        q: 'What were the results?',
        a: 'On the Ken French 48-industry data (1973–2023, annual rebalancing), long-only Global Minimum Variance beat the 1/N benchmark: Sharpe 1.03 vs 0.76 and max drawdown −33% vs −53% at a 30-name universe. Every result is byte-for-byte reproducible via config-derived run keys.',
      },
    ],
  },
];
