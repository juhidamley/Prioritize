import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

// 1. Make sure ALL of these imports are present and use { brackets }
import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { About } from "./pages/About";
import { Resume } from "./pages/Resume"; // <-- THIS IS THE LINE THAT FIXES YOUR ERROR

import "./styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/links" element={<Links />} />
        <Route path="/about" element={<About />} />
        {/* 2. Your Resume route */}
        <Route path="/resume" element={<Resume />} /> 
      </Routes>
    </BrowserRouter>
  );
}