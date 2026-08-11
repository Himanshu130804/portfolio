function Education({ data = [] }) {
  return (
    <section className="section education" id="education">
      <div className="section-heading"><span className="section-index">04 / Education</span><h2>Academic foundation.</h2></div>
      <div className="education-grid">
        {data.map((item, index) => (
          <article className="education-card card-surface" key={`${item.title}-${index}`}>
            <span className="edu-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3><p>{item.inst}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export default Education;
