import { useMemo, useState } from "react";

function Gallery({ data = [] }) {
  const [visible, setVisible] = useState(12);
  const [selected, setSelected] = useState(null);
  const validImages = useMemo(() => data.filter((item) => item?.src), [data]);

  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-heading split-heading">
        <div><span className="section-index">05 / Gallery</span><h2>Moments from<br />the journey.</h2></div>
        <p>A visual archive of sport, leadership, events, teams and milestones.</p>
      </div>
      <div className="gallery-grid">
        {validImages.slice(0, visible).map((item, index) => (
          <button className={`gallery-card gallery-${(index % 6) + 1}`} key={`${item.src}-${index}`} onClick={() => setSelected(item)}>
            <img src={item.src} alt={item.caption || `Portfolio moment ${index + 1}`} loading="lazy" onError={(event) => { event.currentTarget.parentElement.style.display = "none"; }} />
            <span className="gallery-overlay"><small>{String(index + 1).padStart(2, "0")}</small><strong>{item.caption || "View moment"}</strong></span>
          </button>
        ))}
      </div>
      {visible < validImages.length && <button className="button ghost gallery-more" onClick={() => setVisible((value) => value + 12)}>Load more moments</button>}

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <button className="lightbox-close" aria-label="Close">×</button>
          <img src={selected.src} alt={selected.caption || "Gallery preview"} />
        </div>
      )}
    </section>
  );
}
export default Gallery;
