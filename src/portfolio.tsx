import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

// 1. Make sure ALL of these imports are present and use { brackets }
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

// Import the fractal background! Adjust the path if necessary.
import MandelbrotBackground from "./app/components/MandelbrotBackground"; 

import "./styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    // 1. Solid black base wrapper
    <div className="relative min-h-screen w-full bg-black text-white">
      
      {/* 2. Fractal pinned to the back (z-0) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MandelbrotBackground />
      </div>

      {/* 3. Your pages render on top (z-10) */}
      <div className="relative z-10 w-full h-full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/links" element={<Links />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} /> 
            <Route path="/projects" element={<Projects />} />
            <Route path="/research" element={<Research />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/studyTools" element={<StudyTools />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/hero" element={<Hero />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </div>

    </div>
  );
}