import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "./components/Hero.jsx";

import DSA from "./components/DSA.jsx";
import WebDev from "./components/WebDev.jsx";
import Communication from "./components/Communication.jsx";
import Physical from "./components/Physical.jsx";
import OpenSource from "./components/OpenSource.jsx";
import Aptitude from "./components/Aptitude.jsx";
import Academic from "./components/Acadmic.jsx";
import Projects from "./components/Projects.jsx";
import SystemDesign from "./components/SystemDesign.jsx";
import AcademicSubjectPage from "./components/AcademicSubjectPage.jsx";
import AptitudeTopicPage from "./components/AptitudeTopicPage.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/dsa" element={<DSA />} />

        <Route path="/webdev" element={<WebDev />} />

        <Route path="/communication" element={<Communication />} />

        <Route path="/physical" element={<Physical />} />

        <Route path="/opensource" element={<OpenSource />} />

        {/* Aptitude */}
        <Route path="/aptitude" element={<Aptitude />} />
        <Route
          path="/aptitude/:topic"
          element={<AptitudeTopicPage />}
        />


        {/* Academic */}
        <Route path="/academic" element={<Academic />} />

        {/* Individual Academic Subject */}
        <Route
          path="/academic/:subject"
          element={<AcademicSubjectPage />}
        />

        <Route path="/projects" element={<Projects />} />

        <Route
          path="/system-design"
          element={<SystemDesign />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;