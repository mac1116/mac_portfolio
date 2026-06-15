/* ========================================================
   SHARED PROJECTS DATA
   ========================================================
   This is the single source of truth for all projects.
   - Add new projects by adding an object to the array below.
   - Set "featured: true" to show on the homepage carousel.
   - Set "featured: false" to show only on the All Projects page.
   - After editing, both the homepage and projects.html update automatically.
   ======================================================== */

var projects = [
  {
    id: 1,
    title: "Accoteq",
    category: "Managed IT Services Website",
    categoryKey: "web-design",
    description:
      "A professional IT services website focused on cybersecurity, managed services, infrastructure, and business technology solutions.",
    image: "assets/images/project-accoteq-placeholder.jpg",
    imageAlt: "Accoteq managed IT services website interface",
    url: "https://azure-cassowary-124062.hostingersite.com/",
    technologies: ["WordPress", "UI/UX Design", "Responsive Design"],
    featured: true
  },
  {
    id: 2,
    title: "UMerch",
    category: "University Merchandise Platform",
    categoryKey: "e-commerce",
    description:
      "An e-commerce and management platform for university merchandise, product variations, inventory, orders, and administrative operations.",
    image: "assets/images/project-umerch-placeholder.jpg",
    imageAlt: "UMerch university merchandise website interface",
    url: "https://umerch30-main-edex8f.free.laravel.cloud/",
    technologies: ["Laravel", "PHP", "Database", "UI/UX Design"],
    featured: true
  },
  {
    id: 3,
    title: "Don Machos",
    category: "Ordering Kiosk System",
    categoryKey: "e-commerce",
    description:
      "A user-friendly ordering kiosk experience designed to simplify browsing, ordering, and checkout for food and beverage customers.",
    image: "assets/images/project-donmachos-placeholder.jpg",
    imageAlt: "Don Machos ordering kiosk system interface",
    url: "https://www.figma.com/design/1f2s6v7Um5tpuFJDHSMCK5/Don-Macchiatos-UI-UX?node-id=0-1&p=f&t=uCRGYnqkViO0Cnzn-0",
    technologies: ["Web Design", "UI/UX Design", "Responsive Layout"],
    featured: true
  },
  {
  id: 4,
  title: "UM Band Shirt Design",
  category: "Graphic Design",
  categoryKey: "graphic-design",
  description:
    "A custom t-shirt design created for the University of Mindanao Band, combining typography, branding, and visual elements to reflect the organization's identity and school spirit.",
  image: "assets/images/project-umband-placeholder.png",
  imageAlt: "University of Mindanao Band t-shirt design",
  url: "YOUR_TSHIRT_DESIGN_LINK_HERE",
  technologies: ["Graphic Design", "Adobe Illustrator", "Typography", "Brand Identity"],
  featured: true
},

{
  id: 5,
  title: "UMERCH Mobile App UI/UX",
  category: "UI/UX Design",
  categoryKey: "ui-ux-design",
  description:
    "A complete mobile application prototype for UMERCH, an e-commerce platform designed for the University of Mindanao. The project includes user research, wireframes, high-fidelity interfaces, and an interactive prototype focused on delivering a seamless shopping experience.",
  image: "assets/images/project-umerchapp-placeholder.png",
  imageAlt: "UMERCH mobile application UI/UX design prototype",
  url: "https://www.figma.com/design/KrxZWRF1zHuEyjAf7SLO2G/Umerch-Protoyping-SuperFinal?node-id=179-1678&t=h5tOtnkfEkebljup-1",
  technologies: ["Figma", "UI/UX Design", "Mobile App Design", "Prototyping", "User Experience"],
  featured: true
},

  {
  id: 6,
  title: "SecureProBot Twitter Bot Detection",
  category: "Machine Learning System",
  categoryKey: "machine-learning",
  description:
    "An intelligent Twitter bot detection system that analyzes account metadata and profile descriptions to classify accounts as legitimate users or automated bots.",
  image: "assets/images/secureprobot-2-0.onrender.com_.png",
  imageAlt: "SecureProBot Twitter Bot Detection system interface",
  url: "https://secureprobot-2-0.onrender.com/",
  technologies: [
    "Machine Learning",
    "Natural Language Processing",
    "GloVe Embeddings",
    "Twitter Bot Detection"
  ],
  featured: true
}
];
