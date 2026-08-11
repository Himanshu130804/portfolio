import { useEffect, useState } from "react";

const links = ["about", "achievements", "experience", "education", "gallery", "contact"];

function Navbar({ name }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="#home" aria-label="Go to home">
        <span className="brand-mark"><i />KA</span>
        <span className="brand-copy">
          <strong>{name?.replace("Dr. ", "") || "Karamvir Attri"}</strong>
          <small>SPORT / LEADERSHIP / INDIA</small>
        </span>
      </a>

      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        <span /> <span />
      </button>

      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map((link, index) => (
          <a key={link} href={`#${link}`} onClick={() => setOpen(false)}>
            <small>0{index + 1}</small>{link.charAt(0).toUpperCase() + link.slice(1)}
          </a>
        ))}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Let’s connect <b>↗</b></a>
      </nav>
    </header>
  );
}

export default Navbar;
