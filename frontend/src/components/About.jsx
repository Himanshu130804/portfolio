import { assetUrl } from "../services/api";

function About({ data }) {
  return (
    <section className="section about" id="about">
      <div className="section-heading split-heading">
        <div>
          <span className="section-index">
            01 / About
          </span>

          <h2>
            Built through discipline.
            <br />
            Driven by purpose.
          </h2>
        </div>

        <p>
          A career shaped by competition,
          leadership, athlete development and
          a lifelong commitment to sport.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-photo card-surface">
          {data.image ? (
            <img
              src={assetUrl(data.image)}
              alt="Professional portrait"
              loading="lazy"
            />
          ) : (
            <div className="about-image-placeholder">
              No About image
            </div>
          )}

          <span className="photo-label">
            Athlete • Mentor • Sports
            Administrator
          </span>
        </div>

        <div className="about-content">
          <p className="about-lead">
            {data.text}
          </p>

          <div className="highlight-grid">
            {(data.highlights || []).map(
              (item, index) => (
                <div
                  className="highlight-item"
                  key={`${item}-${index}`}
                >
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <strong>{item}</strong>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;