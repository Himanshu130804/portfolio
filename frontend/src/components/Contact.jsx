import { useState } from "react";
import { api } from "../services/api";

function Contact({ data }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setStatus("Sending…");
    try {
      // Messages are stored by the backend and can be viewed from /admin.
      await api.sendMessage(form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus("Message sent successfully.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="contact-panel">
        <div className="contact-copy">
          <span className="section-index">06 / Contact</span>
          <h2>Start a<br /><em>conversation.</em></h2>
          <p>{data.intro}</p>
          <div className="contact-links">
            <a href={`mailto:${data.email}`}><small>Email</small><strong>{data.email}</strong></a>
            <a href={`tel:${data.phone}`}><small>Phone</small><strong>{data.phone}</strong></a>
            <div className="social-row">
              <a href={data.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
              <a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-row"><label>Name<input required name="name" value={form.name} onChange={update} placeholder="Your name" /></label><label>Email<input required type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" /></label></div>
          <label>Subject<input required name="subject" value={form.subject} onChange={update} placeholder="How can I help?" /></label>
          <label>Message<textarea required name="message" value={form.message} onChange={update} rows="5" placeholder="Write your message…" /></label>
          <button className="button primary" type="submit">Send message <span>↗</span></button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
export default Contact;
