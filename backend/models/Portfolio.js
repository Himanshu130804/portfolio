import mongoose from "mongoose";

// Mixed is intentional here: this portfolio is a small single-owner CMS and its
// sections may evolve. Keeping the document flexible makes later additions easy.
const portfolioSchema = new mongoose.Schema({
  hero: mongoose.Schema.Types.Mixed,
  about: mongoose.Schema.Types.Mixed,
  achievements: [mongoose.Schema.Types.Mixed],
  experience: [mongoose.Schema.Types.Mixed],
  education: [mongoose.Schema.Types.Mixed],
  skills: [String],
  gallery: [mongoose.Schema.Types.Mixed],
  contact: mongoose.Schema.Types.Mixed,
}, { timestamps: true, minimize: false });

export default mongoose.model("Portfolio", portfolioSchema);
