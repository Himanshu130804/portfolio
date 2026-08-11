import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Achievements from "./components/Achievements";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./admin/AdminPanel";
import { api } from "./services/api";
import { fallbackPortfolio } from "./dataFallback";
import "./App.css";

function App() {
  // A tiny route check keeps the project dependency-light: /admin opens the CMS.
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);
  const [loading, setLoading] = useState(!isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) return;

    // Public content comes from MongoDB through the backend.
    // If the backend is offline, we retain the bundled fallback content.
    api.getPortfolio()
      .then((data) => setPortfolio(data))
      .catch((error) => console.warn("Using fallback portfolio data:", error.message))
      .finally(() => setLoading(false));
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return;

    // Scroll progress drives the thin neon line at the very top of the site.
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    };

    // Pointer coordinates feed the ambient cursor glow on desktop.
    const updatePointer = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    // Sections/cards reveal only when they enter the viewport.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    const revealTargets = document.querySelectorAll(".section-heading, .about-grid, .achievement-card, .timeline-row, .education-card, .gallery-card, .contact-panel");
    revealTargets.forEach((target) => observer.observe(target));

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, [isAdminRoute, portfolio]);

  if (isAdminRoute) return <AdminPanel />;

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />
      <div className="ambient ambient-c" aria-hidden="true" />
      <div className="cursor-aura" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />
      <Navbar name={portfolio.hero.name} />
      <main>
        <Hero data={portfolio.hero} />
        <About data={portfolio.about} />
        <Achievements data={portfolio.achievements} />
        <Experience data={portfolio.experience} />
        <Education data={portfolio.education} />
        <Skills data={portfolio.skills} />
        <Gallery data={portfolio.gallery} />
        <Contact data={portfolio.contact} />
      </main>
      <Footer name={portfolio.hero.name} />
      {loading && <div className="api-status">Syncing live portfolio…</div>}
    </div>
  );
}

export default App;
