import { useEffect, useState } from "react";
import { api, assetUrl } from "../services/api";
import { fallbackPortfolio } from "../dataFallback";

const TOKEN_KEY = "portfolio_admin_token";

const sections = [
  "hero",
  "about",
  "achievements",
  "experience",
  "education",
  "skills",
  "gallery",
  "contact",
  "messages",
];

/*
|--------------------------------------------------------------------------
| Reusable Field
|--------------------------------------------------------------------------
*/

function Field({
  label,
  value,
  onChange,
  full = false,
  multiline = false,
}) {
  return (
    <label
      className={`admin-field ${
        full ? "full" : ""
      }`}
    >
      {label}

      {multiline ? (
        <textarea
          rows="4"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      )}
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Upload Button
|--------------------------------------------------------------------------
*/

function UploadButton({
  label,
  accept,
  multiple = false,
  onChange,
}) {
  return (
    <label className="button primary admin-upload-button">
      {label}

      <input
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (multiple) {
            onChange(e.target.files);
          } else {
            onChange(
              e.target.files?.[0]
            );
          }

          e.target.value = "";
        }}
      />
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Admin Panel
|--------------------------------------------------------------------------
*/

function AdminPanel() {
  const [token, setToken] =
    useState(
      localStorage.getItem(
        TOKEN_KEY
      ) || ""
    );

  const [
    credentials,
    setCredentials,
  ] = useState({
    email: "",
    password: "",
  });

  const [data, setData] =
    useState(
      fallbackPortfolio
    );

  const [active, setActive] =
    useState("hero");

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [notice, setNotice] =
    useState("");

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load portfolio
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token) {
      return;
    }

    api
      .getPortfolio()
      .then(setData)
      .catch((error) =>
        setNotice(
          error.message
        )
      );
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | Load messages
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      active === "messages" &&
      token
    ) {
      loadMessages();
    }
  }, [active, token]);

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  async function login(e) {
    e.preventDefault();

    setNotice(
      "Signing in..."
    );

    try {
      const result =
        await api.login(
          credentials
        );

      localStorage.setItem(
        TOKEN_KEY,
        result.token
      );

      setToken(
        result.token
      );

      setNotice("");
    } catch (error) {
      setNotice(
        error.message
      );
    }
  }

  function logout() {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setToken("");
  }

  /*
  |--------------------------------------------------------------------------
  | Save portfolio
  |--------------------------------------------------------------------------
  */

  async function save() {
    setNotice(
      "Saving changes..."
    );

    try {
      const saved =
        await api.savePortfolio(
          data,
          token
        );

      setData(saved);

      setNotice(
        "Changes saved successfully."
      );
    } catch (error) {
      if (
        /token|unauthorized/i.test(
          error.message
        )
      ) {
        logout();
      }

      setNotice(
        error.message
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Messages
  |--------------------------------------------------------------------------
  */

  async function loadMessages() {
    try {
      const result =
        await api.getMessages(
          token
        );

      setMessages(result);
    } catch (error) {
      setNotice(
        error.message
      );
    }
  }

  async function removeMessage(
    id
  ) {
    try {
      await api.deleteMessage(
        id,
        token
      );

      setMessages(
        (current) =>
          current.filter(
            (message) =>
              message._id !== id
          )
      );
    } catch (error) {
      setNotice(
        error.message
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | State helpers
  |--------------------------------------------------------------------------
  */

  const setObjectValue = (
    section,
    key,
    value
  ) =>
    setData(
      (current) => ({
        ...current,

        [section]: {
          ...current[
            section
          ],

          [key]: value,
        },
      })
    );

  const setArray = (
    section,
    value
  ) =>
    setData(
      (current) => ({
        ...current,

        [section]:
          value,
      })
    );

  /*
  |--------------------------------------------------------------------------
  | Hero/Profile image upload
  |--------------------------------------------------------------------------
  */

  async function uploadHeroImage(
    file
  ) {
    if (!file) {
      return;
    }

    setUploadProgress(
      "Uploading profile photo..."
    );

    try {
      const result =
        await api.upload(
          file,
          token
        );

      setObjectValue(
        "hero",
        "image",
        result.url
      );

      setUploadProgress("");

      setNotice(
        "Profile photo uploaded. Click Save changes."
      );
    } catch (error) {
      setUploadProgress("");

      setNotice(
        error.message
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | About image upload
  |--------------------------------------------------------------------------
  */

  async function uploadAboutImage(
    file
  ) {
    if (!file) {
      return;
    }

    setUploadProgress(
      "Uploading About image..."
    );

    try {
      const result =
        await api.upload(
          file,
          token
        );

      setObjectValue(
        "about",
        "image",
        result.url
      );

      setUploadProgress("");

      setNotice(
        "About image uploaded. Click Save changes."
      );
    } catch (error) {
      setUploadProgress("");

      setNotice(
        error.message
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Gallery uploads
  |--------------------------------------------------------------------------
  */

  async function uploadGalleryImages(
    files
  ) {
    if (
      !files ||
      files.length === 0
    ) {
      return;
    }

    const fileList =
      Array.from(files);

    const uploaded = [];
    const failed = [];

    setNotice("");

    for (
      let index = 0;
      index <
      fileList.length;
      index++
    ) {
      const file =
        fileList[index];

      setUploadProgress(
        `Uploading ${
          index + 1
        } of ${
          fileList.length
        }: ${file.name}`
      );

      try {
        const result =
          await api.upload(
            file,
            token
          );

        uploaded.push({
          src:
            result.url,

          caption:
            file.name,

          category:
            "Gallery",

          date: "",

          featured:
            false,
        });
      } catch (error) {
        failed.push({
          name:
            file.name,

          message:
            error.message,
        });
      }
    }

    if (
      uploaded.length > 0
    ) {
      setData(
        (current) => ({
          ...current,

          gallery: [
            ...(
              current.gallery ||
              []
            ),

            ...uploaded,
          ],
        })
      );
    }

    setUploadProgress("");

    if (
      failed.length > 0
    ) {
      setNotice(
        `${uploaded.length} uploaded, ${failed.length} failed. ${failed[0].name}: ${failed[0].message}`
      );
    } else {
      setNotice(
        `${uploaded.length} photo(s) uploaded successfully. Click Save changes.`
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Login page
  |--------------------------------------------------------------------------
  */

  if (!token) {
    return (
      <div className="admin-page admin-login">
        <div className="admin-login-card">
          <span className="section-index">
            HIMANSHU ATTRI
            PORTFOLIO CMS
          </span>

          <h1>
            Admin access
          </h1>

          <p>
            Manage your
            portfolio,
            photographs,
            gallery and
            content.
          </p>

          <form
            onSubmit={
              login
            }
          >
            <input
              type="email"
              placeholder="Admin email"
              required
              value={
                credentials.email
              }
              onChange={(
                e
              ) =>
                setCredentials(
                  {
                    ...credentials,

                    email:
                      e
                        .target
                        .value,
                  }
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={
                credentials.password
              }
              onChange={(
                e
              ) =>
                setCredentials(
                  {
                    ...credentials,

                    password:
                      e
                        .target
                        .value,
                  }
                )
              }
            />

            <button
              className="button primary"
              type="submit"
            >
              Sign in
            </button>

            {notice && (
              <span className="admin-notice">
                {notice}
              </span>
            )}
          </form>

          <a
            className="button ghost"
            href="/"
            style={{
              marginTop:
                12,
            }}
          >
            ← Back to
            portfolio
          </a>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main CMS
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-page admin-shell">
      <aside className="admin-sidebar">
        <span className="section-index">
          HIMANSHU
          PORTFOLIO CMS
        </span>

        <h2>
          Content editor
        </h2>

        <div className="admin-nav">
          {sections.map(
            (section) => (
              <button
                key={
                  section
                }
                className={
                  active ===
                  section
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActive(
                    section
                  )
                }
              >
                {section[0].toUpperCase() +
                  section.slice(
                    1
                  )}
              </button>
            )
          )}
        </div>

        <button
          className="button ghost"
          onClick={
            logout
          }
        >
          Log out
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>
              {active[0].toUpperCase() +
                active.slice(
                  1
                )}
            </h1>

            <p>
              Manage
              portfolio
              content
              without
              editing code.
            </p>
          </div>

          <div className="admin-actions">
            <a
              className="button ghost"
              href="/"
              target="_blank"
              rel="noreferrer"
            >
              Preview ↗
            </a>

            {active !==
              "messages" && (
              <button
                className="button primary"
                onClick={
                  save
                }
              >
                Save changes
              </button>
            )}
          </div>
        </div>

        {uploadProgress && (
          <p className="admin-upload-progress">
            {
              uploadProgress
            }
          </p>
        )}

        {notice && (
          <p className="admin-notice">
            {notice}
          </p>
        )}

        {/* HERO */}

        {active ===
          "hero" && (
          <div className="admin-card">
            <div className="admin-array-head">
              <div>
                <h3>
                  Hero
                  section
                </h3>

                <p>
                  Main
                  profile
                  image and
                  homepage
                  information.
                </p>
              </div>

              <UploadButton
                label="Upload profile photo"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={
                  uploadHeroImage
                }
              />
            </div>

            {data.hero
              ?.image && (
              <div className="admin-image-preview hero-preview">
                <img
                  src={assetUrl(
                    data
                      .hero
                      .image
                  )}
                  alt="Profile preview"
                />

                <button
                  className="admin-small-button danger"
                  onClick={() =>
                    setObjectValue(
                      "hero",
                      "image",
                      ""
                    )
                  }
                >
                  Remove
                  image
                </button>
              </div>
            )}

            <div className="admin-grid">
              {Object.entries(
                data.hero ||
                  {}
              )
                .filter(
                  ([key]) =>
                    key !==
                    "image"
                )
                .map(
                  ([
                    key,
                    value,
                  ]) => (
                    <Field
                      key={
                        key
                      }
                      label={
                        key
                      }
                      value={
                        value
                      }
                      full={[
                        "title",
                        "description",
                      ].includes(
                        key
                      )}
                      multiline={
                        key ===
                        "description"
                      }
                      onChange={(
                        value
                      ) =>
                        setObjectValue(
                          "hero",
                          key,
                          value
                        )
                      }
                    />
                  )
                )}
            </div>
          </div>
        )}

        {/* ABOUT */}

        {active ===
          "about" && (
          <div className="admin-card">
            <div className="admin-array-head">
              <div>
                <h3>
                  About
                  section
                </h3>

                <p>
                  Your story
                  and
                  supporting
                  photograph.
                </p>
              </div>

              <UploadButton
                label="Upload About image"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={
                  uploadAboutImage
                }
              />
            </div>

            {data.about
              ?.image && (
              <div className="admin-image-preview">
                <img
                  src={assetUrl(
                    data
                      .about
                      .image
                  )}
                  alt="About preview"
                />

                <button
                  className="admin-small-button danger"
                  onClick={() =>
                    setObjectValue(
                      "about",
                      "image",
                      ""
                    )
                  }
                >
                  Remove
                  image
                </button>
              </div>
            )}

            <div className="admin-grid">
              <Field
                label="About text"
                value={
                  data.about
                    ?.text
                }
                full
                multiline
                onChange={(
                  value
                ) =>
                  setObjectValue(
                    "about",
                    "text",
                    value
                  )
                }
              />

              <Field
                label="Highlights (one per line)"
                value={(
                  data.about
                    ?.highlights ||
                  []
                ).join(
                  "\n"
                )}
                full
                multiline
                onChange={(
                  value
                ) =>
                  setObjectValue(
                    "about",
                    "highlights",
                    value
                      .split(
                        "\n"
                      )
                      .filter(
                        Boolean
                      )
                  )
                }
              />
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}

        {active ===
          "achievements" && (
          <ArrayEditor
            title="Achievement groups"
            items={
              data.achievements
            }
            onChange={(
              items
            ) =>
              setArray(
                "achievements",
                items
              )
            }
            fields={[
              "category",
            ]}
            listField="items"
          />
        )}

        {/* EXPERIENCE */}

        {active ===
          "experience" && (
          <ArrayEditor
            title="Experience timeline"
            items={
              data.experience
            }
            onChange={(
              items
            ) =>
              setArray(
                "experience",
                items
              )
            }
            fields={[
              "role",
              "place",
              "desc",
              "time",
            ]}
          />
        )}

        {/* EDUCATION */}

        {active ===
          "education" && (
          <ArrayEditor
            title="Education"
            items={
              data.education
            }
            onChange={(
              items
            ) =>
              setArray(
                "education",
                items
              )
            }
            fields={[
              "title",
              "inst",
            ]}
          />
        )}

        {/* SKILLS */}

        {active ===
          "skills" && (
          <div className="admin-card">
            <h3>
              Skills
            </h3>

            <Field
              label="One skill per line"
              value={(
                data.skills ||
                []
              ).join(
                "\n"
              )}
              full
              multiline
              onChange={(
                value
              ) =>
                setArray(
                  "skills",
                  value
                    .split(
                      "\n"
                    )
                    .filter(
                      Boolean
                    )
                )
              }
            />
          </div>
        )}

        {/* GALLERY */}

        {active ===
          "gallery" && (
          <div className="admin-card">
            <div className="admin-array-head">
              <div>
                <h3>
                  Gallery
                  images
                </h3>

                <p>
                  Upload
                  multiple
                  JPG,
                  JPEG,
                  PNG or
                  WEBP
                  photographs.
                </p>
              </div>

              <UploadButton
                label="+ Upload photos"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={
                  uploadGalleryImages
                }
              />
            </div>

            <div className="admin-gallery-grid">
              {(
                data.gallery ||
                []
              ).map(
                (
                  image,
                  index
                ) => (
                  <div
                    className="admin-gallery-item"
                    key={
                      index
                    }
                  >
                    {image.src && (
                      <img
                        src={assetUrl(
                          image.src
                        )}
                        alt={
                          image.caption ||
                          "Gallery"
                        }
                      />
                    )}

                    <Field
                      label="Caption"
                      value={
                        image.caption
                      }
                      onChange={(
                        value
                      ) =>
                        setArray(
                          "gallery",
                          data.gallery.map(
                            (
                              item,
                              i
                            ) =>
                              i ===
                              index
                                ? {
                                    ...item,

                                    caption:
                                      value,
                                  }
                                : item
                          )
                        )
                      }
                    />

                    <Field
                      label="Category"
                      value={
                        image.category
                      }
                      onChange={(
                        value
                      ) =>
                        setArray(
                          "gallery",
                          data.gallery.map(
                            (
                              item,
                              i
                            ) =>
                              i ===
                              index
                                ? {
                                    ...item,

                                    category:
                                      value,
                                  }
                                : item
                          )
                        )
                      }
                    />

                    <Field
                      label="Date / year"
                      value={
                        image.date
                      }
                      onChange={(
                        value
                      ) =>
                        setArray(
                          "gallery",
                          data.gallery.map(
                            (
                              item,
                              i
                            ) =>
                              i ===
                              index
                                ? {
                                    ...item,

                                    date:
                                      value,
                                  }
                                : item
                          )
                        )
                      }
                    />

                    <label className="admin-featured-toggle">
                      <input
                        type="checkbox"
                        checked={
                          !!image.featured
                        }
                        onChange={(
                          e
                        ) =>
                          setArray(
                            "gallery",
                            data.gallery.map(
                              (
                                item,
                                i
                              ) =>
                                i ===
                                index
                                  ? {
                                      ...item,

                                      featured:
                                        e
                                          .target
                                          .checked,
                                    }
                                  : item
                            )
                          )
                        }
                      />

                      Featured
                      on
                      homepage
                    </label>

                    <button
                      className="admin-small-button danger"
                      onClick={() =>
                        setArray(
                          "gallery",
                          data.gallery.filter(
                            (
                              _,
                              i
                            ) =>
                              i !==
                              index
                          )
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}

              {(
                data.gallery ||
                []
              ).length ===
                0 && (
                <p className="admin-notice">
                  No
                  gallery
                  photos
                  yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CONTACT */}

        {active ===
          "contact" && (
          <div className="admin-card">
            <h3>
              Contact
              details
            </h3>

            <div className="admin-grid">
              {Object.entries(
                data.contact ||
                  {}
              ).map(
                ([
                  key,
                  value,
                ]) => (
                  <Field
                    key={
                      key
                    }
                    label={
                      key
                    }
                    value={
                      value
                    }
                    full={
                      key ===
                      "intro"
                    }
                    multiline={
                      key ===
                      "intro"
                    }
                    onChange={(
                      value
                    ) =>
                      setObjectValue(
                        "contact",
                        key,
                        value
                      )
                    }
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* MESSAGES */}

        {active ===
          "messages" && (
          <div className="admin-card">
            <h3>
              Contact
              messages
            </h3>

            {messages.length ===
              0 && (
              <p className="admin-notice">
                No
                messages
                yet.
              </p>
            )}

            {messages.map(
              (
                message
              ) => (
                <article
                  className="admin-message"
                  key={
                    message._id
                  }
                >
                  <div className="admin-message-head">
                    <div>
                      <h4>
                        {
                          message.subject
                        }
                      </h4>

                      <small>
                        {
                          message.name
                        }{" "}
                        •{" "}
                        {
                          message.email
                        }{" "}
                        •{" "}
                        {new Date(
                          message.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>

                    <button
                      className="admin-small-button danger"
                      onClick={() =>
                        removeMessage(
                          message._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <p>
                    {
                      message.message
                    }
                  </p>
                </article>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Generic Array Editor
|--------------------------------------------------------------------------
*/

function ArrayEditor({
  title,
  items = [],
  onChange,
  fields,
  listField,
}) {
  const updateItem = (
    index,
    key,
    value
  ) =>
    onChange(
      items.map(
        (
          item,
          i
        ) =>
          i === index
            ? {
                ...item,

                [key]:
                  value,
              }
            : item
      )
    );

  const add = () =>
    onChange([
      ...items,

      Object.fromEntries(
        [
          ...fields,

          ...(listField
            ? [
                listField,
              ]
            : []),
        ].map(
          (
            field
          ) => [
            field,

            field ===
            listField
              ? []
              : "",
          ]
        )
      ),
    ]);

  const remove = (
    index
  ) =>
    onChange(
      items.filter(
        (
          _,
          i
        ) =>
          i !== index
      )
    );

  return (
    <div className="admin-card">
      <div className="admin-array-head">
        <h3>
          {title}
        </h3>

        <button
          className="admin-small-button"
          onClick={
            add
          }
        >
          + Add item
        </button>
      </div>

      {items.map(
        (
          item,
          index
        ) => (
          <div
            className="admin-array-item"
            key={
              index
            }
          >
            <div className="admin-array-head">
              <strong>
                Item{" "}
                {index +
                  1}
              </strong>

              <button
                className="admin-small-button danger"
                onClick={() =>
                  remove(
                    index
                  )
                }
              >
                Remove
              </button>
            </div>

            <div className="admin-grid">
              {fields.map(
                (
                  field
                ) => (
                  <Field
                    key={
                      field
                    }
                    label={
                      field
                    }
                    value={
                      item[
                        field
                      ]
                    }
                    full={
                      field ===
                        "desc" ||
                      field ===
                        "src"
                    }
                    multiline={
                      field ===
                      "desc"
                    }
                    onChange={(
                      value
                    ) =>
                      updateItem(
                        index,
                        field,
                        value
                      )
                    }
                  />
                )
              )}

              {listField && (
                <Field
                  label={`${listField} (one per line)`}
                  value={(
                    item[
                      listField
                    ] ||
                    []
                  ).join(
                    "\n"
                  )}
                  full
                  multiline
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      index,
                      listField,
                      value
                        .split(
                          "\n"
                        )
                        .filter(
                          Boolean
                        )
                    )
                  }
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default AdminPanel;