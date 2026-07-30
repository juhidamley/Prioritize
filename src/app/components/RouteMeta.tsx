import { useEffect } from 'react';
import { useLocation } from 'react-router';

const DEFAULT_DESCRIPTION =
  'Juhi Damley — Computer Science student at Claremont McKenna College. Projects, research, and a retro-computing playground.';

const META: Record<string, { title: string; description?: string }> = {
  '/': { title: 'Juhi Damley | Studio' },
  '/home': { title: 'Desktop — Juhi Damley' },
  '/about': {
    title: 'About — Juhi Damley',
    description: 'About Juhi Damley — CS student at Claremont McKenna College, class of 2028.',
  },
  '/links': { title: 'Links — Juhi Damley' },
  '/resume': { title: 'Resume — Juhi Damley' },
  '/projects': {
    title: 'Projects — Juhi Damley',
    description: 'Projects by Juhi Damley — LectureTeX, Prioritize, devlog, and more.',
  },
  '/projects/electoral-equilibrium': {
    title: 'Electoral Equilibrium — Juhi Damley',
    description: 'Electoral Equilibrium — an ML pipeline (Mistral 7B, CVXPY, Monte Carlo) modeling voter-coalition shifts after political shocks.',
  },
  '/projects/lecturetex': {
    title: 'LectureTeX — Juhi Damley',
    description: 'LectureTeX — a web app that converts lecture audio/video into structured, compile-ready LaTeX PDF notes.',
  },
  '/projects/optimized-indexation': {
    title: 'Optimized Indexation — Juhi Damley',
    description: 'Optimized Indexation — a reproducible CVXPY/OSQP research pipeline for large-scale portfolio construction, with a subset-optimization method. FEI research advised by Prof. Benjamin Gillen.',
  },
  '/research': {
    title: 'Research — Juhi Damley',
    description: 'Research by Juhi Damley — optimized indexation and 2024 voter behavior analysis.',
  },
  '/contact': { title: 'Contact — Juhi Damley' },
  '/studytools': { title: 'Study Tools — Juhi Damley' },
  '/pomodoro': { title: 'Pomodoro — Juhi Damley' },
};

export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const entry = META[pathname.toLowerCase()] ?? { title: '404 — Juhi Damley' };
    document.title = entry.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', entry.description ?? DEFAULT_DESCRIPTION);
  }, [pathname]);

  return null;
}
