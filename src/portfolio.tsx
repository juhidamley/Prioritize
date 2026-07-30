import { Suspense, lazy, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { About } from "./pages/About";
import { Resume } from "./pages/Resume";
import { Projects } from "./pages/Projects";
import { ProjectWriteup } from "./pages/ProjectWriteup";
// Code-split: recharts is heavy, load it only when /research is visited.
const Research = lazy(() => import("./pages/Research").then((m) => ({ default: m.Research })));
import { Contact } from "./pages/Contact";
import { StudyTools } from "./pages/StudyTools";
import { Pomodoro } from "./pages/studyTools/Pomodoro";
import { NotFound } from "./pages/NotFound";
import Hero from "./pages/Hero";

import MandelbrotBackground from "./app/components/MandelbrotBackground";
import { RouteMeta } from "./app/components/RouteMeta";
import { DesktopProvider } from "./app/components/retro/DesktopContext";
import { BootScreen } from "./app/components/retro/BootScreen";
import { ChatLauncher } from "./app/components/ai/ChatLauncher";
import { useKonami } from "./app/hooks/useKonami";
import "./styles/index.css";

// Pages that render their own full-screen background — mounting the fractal
// under them would burn CPU on pixels that are never visible.
const FRACTAL_FREE_PATHS = new Set(["/", "/home"]);
const KNOWN_PATHS = new Set([
  "/", "/home", "/links", "/about", "/resume", "/projects",
  "/research", "/contact", "/studytools", "/pomodoro",
]);

function AppShell() {
  const { pathname } = useLocation();
  const path = pathname.toLowerCase();
  const showFractal = KNOWN_PATHS.has(path) && !FRACTAL_FREE_PATHS.has(path);

  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const fireKonami = useCallback(() => {
    setKonamiUnlocked(true);
    import("canvas-confetti")
      .then(m => {
        m.default({ particleCount: 160, spread: 90, origin: { y: 0.7 } });
      })
      .catch(() => {});
    window.setTimeout(() => setKonamiUnlocked(false), 4500);
  }, []);
  useKonami(fireKonami);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {showFractal && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <MandelbrotBackground />
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen">
        <RouteMeta />
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/links" element={<Links />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectWriteup />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/studyTools" element={<StudyTools />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </div>

      {konamiUnlocked && (
        <div
          role="status"
          className="fixed bottom-14 right-4 z-[90] bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl w-72"
        >
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 text-xs font-bold">
            konami.exe
          </div>
          <div className="p-3 text-sm text-black flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🏆</span>
            <span className="font-bold">ACHIEVEMENT UNLOCKED: 30 extra lives</span>
          </div>
        </div>
      )}

      <ChatLauncher />
      <BootScreen />
      <Analytics />
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <DesktopProvider>
        <AppShell />
      </DesktopProvider>
    </BrowserRouter>
  );
}
