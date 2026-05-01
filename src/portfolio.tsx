import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { About } from "./pages/About";
import { Resume } from "./pages/Resume";
import { Projects } from "./pages/Projects";
import { Research } from "./pages/Research";
import { Contact } from "./pages/Contact";
import { StudyTools } from "./pages/StudyTools";
import { Pomodoro } from "./pages/studyTools/Pomodoro";
import Hero from "./pages/Hero";

import MandelbrotBackground from "./app/components/MandelbrotBackground"; 
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    // Force a black base layer container to prevent white bleed-through
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      
      {/* 1. The fractal is locked to the bottom layer (z-0) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MandelbrotBackground />
      </div>

      {/* 2. Your entire Site Content is forced to the top layer (z-10) */}
      <div className="relative z-10 w-full min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/links" element={<Links />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/research" element={<Research />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/studyTools" element={<StudyTools />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </div>

    </div>
  );
}