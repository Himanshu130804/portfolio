import { useEffect, useState } from "react";
import { api } from "../services/api";
import { fallbackPortfolio } from "../dataFallback";

const TOKEN_KEY = "portfolio_admin_token";
const sections = ["hero", "about", "achievements", "experience", "education", "skills", "gallery", "contact", "messages"];

function Field({ label, value, onChange, full = false, multiline = false }) {
  return (
    <label className={`admin-field ${full ? "full" : ""}`}>
      {label}
      {multiline ? <textarea rows="4" value={value || ""} onChange={(e) => onChange(e.target.value)} /> : <input value={value || ""} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [data, setData] = useState(fallbackPortfolio);
  const [active, setActive] = useState("hero");
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState("");

  // After login, fetch the editable content from the same API used by the public site.
  useEffect(() => {
    if (!token) return;
    api.getPortfolio().then(setData).catch((e) => setNotice(e.message));
  }, [token]);

  useEffect(() => {
    if (active === "messages" && token) loadMessages();
  }, [active, token]);

  async function login(e) {
    e.preventDefault();
    setNotice("Signing in…");
    try {
      const result = await api.login(credentials);
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setNotice("");
    } catch (error) {
      setNotice(error.message);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  async function save() {
    setNotice("Saving changes…");
    try {
      const saved = await api.savePortfolio(data, token);
      setData(saved);
      setNotice("Changes saved. Your public portfolio now uses the updated data.");
    } catch (error) {
      if (/token|unauthorized/i.test(error.message)) logout();
      setNotice(error.message);
    }
  }

  async function loadMessages() {
    try { setMessages(await api.getMessages(token)); }
    catch (error) { setNotice(error.message); }
  }

  async function removeMessage(id) {
    await api.deleteMessage(id, token);
    setMessages((current) => current.filter((message) => message._id !== id));
  }

  const setObjectValue = (section, key, value) => setData((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const setArray = (section, value) => setData((current) => ({ ...current, [section]: value }));

  if (!token) {
    return (
      <div className="admin-page admin-login">
        <div className="admin-login-card">
          <span className="section-index">Portfolio CMS</span>
          <h1>Admin access</h1>
          <p>Use the admin credentials stored in your backend environment variables. Never place the password in frontend code.</p>
          <form onSubmit={login}>
            <input type="email" placeholder="Admin email" required value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
            <input type="password" placeholder="Password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
            <button className="button primary" type="submit">Sign in</button>
            {notice && <span className="admin-notice">{notice}</span>}
          </form>
          <a className="button ghost" href="/" style={{ marginTop: 12 }}>← Back to portfolio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-shell">
      <aside className="admin-sidebar">
        <span className="section-index">Portfolio CMS</span><h2>Content editor</h2>
        <div className="admin-nav">
          {sections.map((section) => <button key={section} className={active === section ? "active" : ""} onClick={() => setActive(section)}>{section[0].toUpperCase() + section.slice(1)}</button>)}
        </div>
        <button className="button ghost" onClick={logout}>Log out</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div><h1>{active[0].toUpperCase() + active.slice(1)}</h1><p>Edit content here instead of changing React files manually.</p></div>
          <div className="admin-actions"><a className="button ghost" href="/" target="_blank">Preview ↗</a>{active !== "messages" && <button className="button primary" onClick={save}>Save changes</button>}</div>
        </div>
        {notice && <p className="admin-notice">{notice}</p>}

        {active === "hero" && <div className="admin-card"><h3>Hero section</h3><div className="admin-grid">
          {Object.entries(data.hero).map(([key, value]) => <Field key={key} label={key} value={value} full={["title","description","image"].includes(key)} multiline={key === "description"} onChange={(v) => setObjectValue("hero", key, v)} />)}
        </div></div>}

        {active === "about" && <div className="admin-card"><h3>About section</h3><div className="admin-grid">
          <Field label="Image path / URL" value={data.about.image} full onChange={(v) => setObjectValue("about", "image", v)} />
          <Field label="About text" value={data.about.text} full multiline onChange={(v) => setObjectValue("about", "text", v)} />
          <Field label="Highlights (one per line)" value={(data.about.highlights || []).join("\n")} full multiline onChange={(v) => setObjectValue("about", "highlights", v.split("\n").filter(Boolean))} />
        </div></div>}

        {active === "achievements" && <ArrayEditor title="Achievement groups" items={data.achievements} onChange={(items) => setArray("achievements", items)} fields={["category"]} listField="items" />}
        {active === "experience" && <ArrayEditor title="Experience timeline" items={data.experience} onChange={(items) => setArray("experience", items)} fields={["role","place","desc","time"]} />}
        {active === "education" && <ArrayEditor title="Education" items={data.education} onChange={(items) => setArray("education", items)} fields={["title","inst"]} />}

        {active === "skills" && <div className="admin-card"><h3>Skills</h3><Field label="One skill per line" value={(data.skills || []).join("\n")} full multiline onChange={(v) => setArray("skills", v.split("\n").filter(Boolean))} /></div>}
        {active === "gallery" && <ArrayEditor title="Gallery images" items={data.gallery} onChange={(items) => setArray("gallery", items)} fields={["src","caption"]} />}

        {active === "contact" && <div className="admin-card"><h3>Contact details</h3><div className="admin-grid">
          {Object.entries(data.contact).map(([key, value]) => <Field key={key} label={key} value={value} full={key === "intro"} multiline={key === "intro"} onChange={(v) => setObjectValue("contact", key, v)} />)}
        </div></div>}

        {active === "messages" && <div className="admin-card"><h3>Contact form messages</h3>{messages.length === 0 && <p className="admin-notice">No messages yet.</p>}{messages.map((message) => <article className="admin-message" key={message._id}><div className="admin-message-head"><div><h4>{message.subject}</h4><small>{message.name} • {message.email} • {new Date(message.createdAt).toLocaleString()}</small></div><button className="admin-small-button danger" onClick={() => removeMessage(message._id)}>Delete</button></div><p>{message.message}</p></article>)}</div>}
      </main>
    </div>
  );
}

function ArrayEditor({ title, items = [], onChange, fields, listField }) {
  const updateItem = (index, key, value) => onChange(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const add = () => onChange([...items, Object.fromEntries([...fields, ...(listField ? [listField] : [])].map((field) => [field, field === listField ? [] : ""]))]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return <div className="admin-card"><div className="admin-array-head"><h3>{title}</h3><button className="admin-small-button" onClick={add}>+ Add item</button></div>
    {items.map((item, index) => <div className="admin-array-item" key={index}><div className="admin-array-head"><strong>Item {index + 1}</strong><button className="admin-small-button danger" onClick={() => remove(index)}>Remove</button></div><div className="admin-grid">
      {fields.map((field) => <Field key={field} label={field} value={item[field]} full={field === "desc" || field === "src"} onChange={(value) => updateItem(index, field, value)} />)}
      {listField && <Field label={`${listField} (one per line)`} value={(item[listField] || []).join("\n")} full multiline onChange={(value) => updateItem(index, listField, value.split("\n").filter(Boolean))} />}
    </div></div>)}
  </div>;
}

export default AdminPanel;
