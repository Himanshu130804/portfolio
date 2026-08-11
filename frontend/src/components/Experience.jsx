function Experience({ data = [] }) {
  return (
    <section className="section experience" id="experience">
      <div className="section-heading split-heading">
        <div><span className="section-index">03 / Experience</span><h2>Leadership across<br />institutions.</h2></div>
        <p>From elite sport to university administration, every role adds another layer of experience.</p>
      </div>
      <div className="timeline">
        {data.map((item, index) => (
          <article className="timeline-row" key={`${item.role}-${item.time}`}>
            <div className="timeline-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="timeline-main"><h3>{item.role}</h3><p>{item.place}</p>{item.desc && <small>{item.desc}</small>}</div>
            <time>{item.time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
export default Experience;
