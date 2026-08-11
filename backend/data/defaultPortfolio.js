// Initial database content. It mirrors the existing deployed portfolio so the
// first backend deployment does not start with an empty website.
export const defaultPortfolio = {
  hero: {
    name: "Dr. Karamvir Singh Attri",
    eyebrow: "International Kabaddi Player • India",
    title: "Sports Leader. Mentor. International Kabaddi Athlete.",
    description: "Director of Sports & Physical Education with a career spanning elite competition, university sports leadership and athlete development.",
    image: "/images/25.jpg",
    primaryCta: "Explore Journey",
    secondaryCta: "Get in Touch"
  },
  about: {
    image: "/images/61.jpg",
    text: "Dr. Karamvir Singh Attri is a professional Kabaddi player and Director of Sports at Rayat Bahra University. He brings extensive experience in sports leadership, athlete development, institutional sports administration and mentorship.",
    highlights: ["International Kabaddi Player", "Sports Administration", "Athlete Development", "Leadership & Mentorship"]
  },
  achievements: [
    { category: "International Level", items: ["1st - Invitational Kabaddi World Cup (2012)", "1st - India vs Bhutan Kabaddi Exhibition Match (2010)", "1st - India vs Nepal Kabaddi Exhibition Match (2008)", "1st - Sri Lanka vs India Kabaddi Test (2005)"] },
    { category: "National Level", items: ["Participant - Sr. National Championship (2008)", "Participant - Sr. National Championship (2007)", "2nd Position - Sr. National Championship (2006)", "2nd Position - Sr. National Championship (2005)", "1st Position - North Zone Championship (2005)", "Participant - Sr. National Championship (2004)"] }
  ],
  experience: [
    { role: "Director Sports and Physical Education", place: "Rayat Bahra University, Mohali", desc: "Also handling Staff Residence & Guest House Incharge", time: "Nov 2025 - Present" },
    { role: "Sports Officer (H.O.D)", place: "World University of Design, Sonipat", desc: "Admin Officer", time: "Apr 2022 - Oct 2025" },
    { role: "Sports Officer (H.O.D)", place: "SGT University, Gurugram", desc: "", time: "Mar 2019 - Apr 2022" },
    { role: "Director Sports", place: "Lingayas University, Faridabad", desc: "", time: "Aug 2016 - Sep 2017" },
    { role: "DPE", place: "NGF College of Engineering & Technology, Palwal", desc: "", time: "Sep 2011 - Aug 2016" },
    { role: "Sr. Security Officer", place: "IOCL, Tamil Nadu", desc: "Job under Sports Quota", time: "Oct 2006 - Sep 2008" }
  ],
  education: [
    { title: "Honorary Doctorate - Physical Education", inst: "Bharath Virtual University for Peace and Education" },
    { title: "PG Diploma in Kabaddi (N.I.S)", inst: "Indira Gandhi Technological and Medical Sciences University" },
    { title: "Master Degree (M.A Physical)", inst: "Eastern Institute for Integrated Learning in Management University" },
    { title: "Bachelor of Physical Education (B.P.Ed)", inst: "BSP Lucknow University" },
    { title: "Bachelor of Arts (B.A)", inst: "Vinayaka Missions University" },
    { title: "12th Passed", inst: "S.D. Memorial Sr. Sec. School of Sports, Faridabad" },
    { title: "10th Passed", inst: "S.D. Memorial Sr. Sec. School of Sports, Faridabad" }
  ],
  skills: ["Kabaddi Strategy", "Coaching", "Leadership", "Fitness Training", "Team Management"],
  gallery: Array.from({ length: 71 }, (_, i) => ({ src: `/images/${i + 1}.${i >= 61 ? "jpeg" : "jpg"}`, caption: "" })),
  contact: {
    intro: "Connect for sports training, mentorship, speaking opportunities and collaborations.",
    phone: "+91 8800283112",
    email: "karamvirsinghattri@gmail.com",
    instagram: "https://www.instagram.com/karamattri?igsh=bDZob3duMG14aHM3",
    linkedin: "https://www.linkedin.com/in/dr-karamvir-singh-attri-35a58b215"
  }
};
