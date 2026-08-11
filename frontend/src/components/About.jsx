function About({ data }) {
  return (
    <section className="section about" id="about">
      <div className="section-heading split-heading">
        <div><span className="section-index">01 / About</span><h2>Built through discipline.<br />Driven by purpose.</h2></div>
        <p>A career shaped by competition, leadership, athlete development and a lifelong commitment to sport.</p>
      </div>

      <div className="about-grid">
        <div className="about-photo card-surface">
          <img src={data.image} alt="Professional portrait" loading="lazy" />
          <span className="photo-label">Athlete • Mentor • Sports Administrator</span>
        </div>
        <div className="about-content">
          <p className="about-lead">{data.text}</p>
          <div className="highlight-grid">
            {(data.highlights || []).map((item, index) => (
              <div className="highlight-item" key={item}>
                <span>0{index + 1}</span><strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
