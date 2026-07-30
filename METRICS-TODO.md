# Metrics to fill in (when your results are final)

Everything below is currently shown on the site as **"research in progress"** — nothing is fabricated. Fill a value once and it flows to every place listed. Edit **`src/content/metrics.ts`** (the one file) and, where noted, remove the matching `TODO(juhi):` marker.

| Metric | Where to put it | Appears on | Example value |
|---|---|---|---|
| Electoral: held-out backtest accuracy | `metrics.electoral.backtestAccuracy` in `src/content/metrics.ts` | Research page, `/projects/electoral-equilibrium` writeup | `"82% directional (held-out cycles)"` |
| Electoral: win-probability calibration | `metrics.electoral.winProbCalibration` | Research page, electoral writeup | `"Brier 0.14"` |
| LectureTeX: compile-success rate | `metrics.lecturetex.compileSuccessRate` | `/projects/lecturetex` writeup | `"100% (n=40 lectures)"` |
| LectureTeX: transcription WER | `metrics.lecturetex.transcriptionWER` | LectureTeX writeup | `"6.2% WER"` |

Also remove these inline `TODO(juhi):` markers once the numbers exist:
- `scripts/writeups.mjs` — "add any held-out backtest…" (electoral) and "add a measured compile-success rate" (lecturetex).
- `~/PycharmProjects/electoral-equilibrium/README.md` — "add held-out backtest / win-probability calibration metrics".

## Other quick TODOs
- **AI Juhi**: add `ANTHROPIC_API_KEY` in the Vercel project env to switch the chat from its canned fallback to live Claude responses. (Optional: set `CHAT_MODEL`, defaults to `claude-haiku-4-5`.)
- **Demo videos**: record ~15s screen captures and drop them at `public/assets/demos/electoral-equilibrium.mp4` and `public/assets/demos/lecturetex.mp4`, then set `demo.src` in `scripts/writeups.mjs`.
- **Hugging Face**: if you have a profile, add it to `sameAs` in `index.html` and the `## About` block in `public/llms.txt`.
