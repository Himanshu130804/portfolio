function Hero({ data }) {
  return (
    <section className="hero section" id="home">
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="hero-ghost-word" aria-hidden="true">KABADDI</div>

      <div className="hero-copy">
        <div className="eyebrow"><span /> {data.eyebrow}</div>
        <h1>
          <span className="hero-title-main">{data.title}</span>
          <span className="hero-title-accent">Legacy in motion.</span>
        </h1>
        <p className="hero-description">{data.description}</p>
        <div className="hero-actions">
          <a className="button primary" href="#experience"><span>{data.primaryCta || "Explore Journey"}</span><b>↗</b></a>
          <a className="button ghost" href="#contact"><span>{data.secondaryCta || "Get in Touch"}</span><b>→</b></a>
        </div>
        <div className="hero-meta">
          <div><strong>20+</strong><span>Years in sport</span></div>
          <div><strong>INTL</strong><span>Kabaddi career</span></div>
          <div><strong>LEAD</strong><span>University sports</span></div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="portrait-halo" aria-hidden="true" />
        <div className="portrait-frame">
          <div className="portrait-chrome" aria-hidden="true">ATHLETE / LEADER / MENTOR</div>
          <img src={data.image} alt={data.name} />
          <div className="portrait-scanline" aria-hidden="true" />
          <div className="portrait-badge">
            <span className="status-dot" />
            <div><small>Current role</small><strong>Director of Sports</strong></div>
          </div>
          <span className="portrait-coordinate">28.61° N / INDIA</span>
        </div>
        <div className="floating-chip chip-one"><small>MODE</small><strong>PERFORMANCE</strong></div>
        <div className="floating-chip chip-two"><small>STATUS</small><strong>ACTIVE LEGACY</strong></div>
        <span className="outline-number">01</span>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Scroll to about"><span /> SCROLL TO DISCOVER</a>
    </section>
  );
}

export default Hero;
