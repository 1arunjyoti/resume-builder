export type TemplateType = "ats" | "creative" | "modern" | "professional" | "elegant";

export const TEMPLATES: { id: TemplateType; name: string; description: string }[] = [
  {
    id: "ats",
    name: "ATS Scanner",
    description: "Clean, single-column, ATS-friendly",
  },
  { id: "creative", name: "Creative", description: "Two-column with sidebar" },
  {
    id: "modern",
    name: "Modern",
    description: "Minimalist, typography-focused",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional serif, executive style",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated with full-width banner",
  },
];

export const THEME_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Slate", value: "#64748b" },
  { name: "Black", value: "#1a1a1a" },
];

export const SECTIONS = [
  { id: "custom", label: "Custom Section" }, // Dynamic, handled specially usually, but here for ordering
  { id: "work", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "languages", label: "Languages" },
  { id: "interests", label: "Interests" },
  { id: "publications", label: "Publications" },
  { id: "awards", label: "Awards" },
  { id: "references", label: "References" },
];
