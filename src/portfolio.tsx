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

import "./styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <>
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
    </>
  );
}