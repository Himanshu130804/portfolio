import mongoose from "mongoose";

// Contact form submissions are kept separately from portfolio content so they
// can be reviewed/deleted without touching the public website data.
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 160 },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
