function Achievements({ data = [] }) {
  return (
    <section className="section achievements" id="achievements">
      <div className="section-heading">
        <span className="section-index">02 / Achievements</span>
        <h2>Competed. Represented.<br />Delivered.</h2>
      </div>
      <div className="achievement-grid">
        {data.map((group, groupIndex) => (
          <article className="achievement-card card-surface" key={group.category}>
            <div className="achievement-top"><span>0{groupIndex + 1}</span><h3>{group.category}</h3></div>
            <ul>
              {group.items.map((item, index) => <li key={`${item}-${index}`}><span className="medal">◆</span>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
export default Achievements;
