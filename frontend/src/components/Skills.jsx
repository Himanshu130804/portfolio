function Skills({ data = [] }) {
  return (
    <section className="skills-strip" id="skills" aria-label="Core skills">
      <div className="skills-label">CORE DNA</div>
      <div className="skills-track">
        {[...data, ...data].map((skill, index) => <span key={`${skill}-${index}`}>{skill} <b>✦</b></span>)}
      </div>
    </section>
  );
}
export default Skills;
