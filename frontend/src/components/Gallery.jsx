import {
  useMemo,
  useState,
} from "react";

import {
  assetUrl,
} from "../services/api";

function Gallery({
  data = [],
}) {
  const [
    visible,
    setVisible,
  ] = useState(12);

  const [
    selected,
    setSelected,
  ] = useState(null);

  const validImages =
    useMemo(
      () =>
        data.filter(
          (item) =>
            item?.src
        ),
      [data]
    );

  const visibleImages =
    validImages.slice(
      0,
      visible
    );

  function loadMore() {
    setVisible(
      (current) =>
        Math.min(
          current + 12,
          validImages.length
        )
    );
  }

  return (
    <section
      className="section gallery-section"
      id="gallery"
    >
      <div className="section-heading split-heading">
        <div>
          <span className="section-index">
            05 / Gallery
          </span>

          <h2>
            Moments from
            <br />
            the journey.
          </h2>
        </div>

        <p>
          A visual archive of sport,
          leadership, events, teams
          and milestones.
        </p>
      </div>

      <div className="gallery-grid">
        {visibleImages.map(
          (
            item,
            index
          ) => (
            <button
              className={`gallery-card gallery-visible gallery-${
                (index %
                  6) +
                1
              }`}
              key={`${item.src}-${index}`}
              onClick={() =>
                setSelected(
                  item
                )
              }
            >
              <img
                src={assetUrl(
                  item.src
                )}
                alt={
                  item.caption ||
                  `Portfolio moment ${
                    index +
                    1
                  }`
                }
                loading="lazy"
                onError={(
                  event
                ) => {
                  console.error(
                    "Gallery image failed:",
                    item.src
                  );

                  event.currentTarget.style.opacity =
                    "0.15";
                }}
              />

              <span className="gallery-overlay">
                <small>
                  {String(
                    index +
                      1
                  ).padStart(
                    2,
                    "0"
                  )}
                </small>

                <strong>
                  {item.caption ||
                    "View moment"}
                </strong>
              </span>
            </button>
          )
        )}
      </div>

      {visible <
        validImages.length && (
        <div className="gallery-load-area">
          <button
            className="button ghost gallery-more"
            onClick={
              loadMore
            }
          >
            Load more moments
            <span>
              {Math.min(
                12,
                validImages.length -
                  visible
              )}{" "}
              more
            </span>
          </button>

          <small className="gallery-count">
            Showing{" "}
            {Math.min(
              visible,
              validImages.length
            )}{" "}
            of{" "}
            {
              validImages.length
            }
          </small>
        </div>
      )}

      {visible >=
        validImages.length &&
        validImages.length >
          12 && (
          <p className="gallery-count gallery-complete">
            All{" "}
            {
              validImages.length
            }{" "}
            moments loaded.
          </p>
        )}

      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() =>
            setSelected(
              null
            )
          }
        >
          <button
            className="lightbox-close"
            aria-label="Close image"
            onClick={() =>
              setSelected(
                null
              )
            }
          >
            ×
          </button>

          <img
            src={assetUrl(
              selected.src
            )}
            alt={
              selected.caption ||
              "Gallery preview"
            }
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          />

          {selected.caption && (
            <div
              className="lightbox-caption"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              {
                selected.caption
              }
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Gallery;