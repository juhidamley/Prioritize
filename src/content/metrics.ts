// Central, fillable metrics for the project case studies and the Research page.
// Verified numbers are filled in; anything not yet measured is `null` and rendered
// as "research in progress" — NEVER invent a number. See METRICS-TODO.md for the
// checklist of what to fill and where each value appears.

export type Metric = number | string | null;

export const metrics = {
  electoral: {
    // Verified (from FINDINGS.md — IPF over 20 cycles, 1948–2024).
    rakedLambda: { race: 0.114, religion: 0.224, gender: 0.662 },
    blocs: 15,
    cyclesFrom: 1948,
    cyclesTo: 2024,
    monteCarloDraws: '10,000+',
    // TODO(juhi): fill once the paper baseline run completes.
    backtestAccuracy: null as Metric, // e.g. "82%" held-out directional accuracy
    winProbCalibration: null as Metric, // e.g. Brier score / calibration error
  },
  lecturetex: {
    // Verified (from README.md).
    pagesPerLecture: '8–12',
    gpuTranscriptionSeconds: '30–45', // on Modal A100 GPUs
    // TODO(juhi): fill if you want to cite measured figures.
    compileSuccessRate: null as Metric, // e.g. "100% (n=40 lectures)"
    transcriptionWER: null as Metric, // e.g. word-error rate on a test set
  },
} as const;

/** Render a metric, or a neutral placeholder when it isn't measured yet. */
export function showMetric(m: Metric, unit = ''): string {
  return m == null ? 'research in progress' : `${m}${unit}`;
}
