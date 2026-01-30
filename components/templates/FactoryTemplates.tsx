/**
 * Factory-based Templates
 *
 * All templates are now created using the template factory system.
 * Each template is defined by a simple configuration object (~20-50 lines)
 * instead of 300-600 lines of duplicated rendering logic.
 *
 * Benefits:
 * - 90%+ code reduction per template
 * - Consistent behavior across all templates
 * - Easy to add new customization options globally
 * - New templates can be created in minutes
 */

import { createTemplate, type TemplateConfig } from "@/lib/template-factory";

// ============================================================================
// TEMPLATE CONFIGURATIONS
// ============================================================================

const atsConfig: TemplateConfig = {
  id: "ats",
  name: "ATS",
  layoutType: "single-column",
  defaultThemeColor: "#2563eb",
};

const classicConfig: TemplateConfig = {
  id: "classic",
  name: "Classic",
  layoutType: "single-column-centered", // Can be overridden by settings.columnCount
  defaultThemeColor: "#000000",
  // Support dynamic column layout - single or two-column based on settings
  leftColumnSections: [
    "skills",
    "education",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "custom",
    "publications",
  ],
  // Classic-specific customizations (only valid LayoutSettings properties)
  themeOverrides: {
    // Typography - Times-Roman
    fontFamily: "Times-Roman",
    // Header border for sectionHeadingStyle === 1 (handled in factory)
    headerBottomMargin: 4,
    // Section margins and spacing
    sectionMargin: 8,
    bulletMargin: 2,
    // Entry styling
    entryIndentBody: false,
    entryTitleSize: "M",
    entrySubtitleStyle: "italic",
    // Contact styling
    contactSeparator: "pipe",
  },
};

const modernConfig: TemplateConfig = {
  id: "modern",
  name: "Modern",
  layoutType: "single-column",
  defaultThemeColor: "#10b981",
};

const creativeConfig: TemplateConfig = {
  id: "creative",
  name: "Creative",
  layoutType: "creative-sidebar",
  defaultThemeColor: "#8b5cf6",
  sidebarBackground: true,
  sidebarBackgroundColor: "#f4f4f0",
  leftColumnSections: [
    "summary",
    "certificates",
    "languages",
    "interests",
    "awards",
  ],
  rightColumnSections: [
    "work",
    "education",
    "skills",
    "projects",
    "publications",
    "references",
    "custom",
  ],
};

const professionalConfig: TemplateConfig = {
  id: "professional",
  name: "Professional",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#0f172a",
  leftColumnSections: [
    "skills",
    "education",
    "languages",
    "certificates",
    "awards",
    "interests",
  ],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "publications",
    "references",
    "custom",
  ],
};

const elegantConfig: TemplateConfig = {
  id: "elegant",
  name: "Elegant",
  layoutType: "single-column",
  defaultThemeColor: "#2c3e50",
};

const classicSlateConfig: TemplateConfig = {
  id: "classic-slate",
  name: "Classic Slate",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#334155",
  leftColumnSections: ["summary", "work", "projects", "references", "custom"],
  rightColumnSections: [
    "skills",
    "education",
    "certificates",
    "publications",
    "awards",
    "languages",
    "interests",
  ],
};

const glowConfig: TemplateConfig = {
  id: "glow",
  name: "Glow",
  layoutType: "single-column",
  defaultThemeColor: "#F4D03F",
  fullWidthHeader: true,
  headerBackgroundColor: "#1F2937",
  headerTextColor: "#FFFFFF",
  themeOverrides: {
    sectionHeadingStyle: 4, // Background highlight
  },
};

const multicolumnConfig: TemplateConfig = {
  id: "multicolumn",
  name: "Multicolumn",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#0284c7",
  leftColumnSections: ["skills", "languages", "interests"],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "education",
    "certificates",
    "awards",
    "publications",
    "references",
    "custom",
  ],
};

const stylishConfig: TemplateConfig = {
  id: "stylish",
  name: "Stylish",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#ec4899",
  leftColumnSections: [
    "skills",
    "education",
    "languages",
    "certificates",
    "interests",
  ],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "awards",
    "publications",
    "references",
    "custom",
  ],
};

const timelineConfig: TemplateConfig = {
  id: "timeline",
  name: "Timeline",
  layoutType: "single-column",
  defaultThemeColor: "#6366f1",
};

const polishedConfig: TemplateConfig = {
  id: "polished",
  name: "Polished",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#0d9488",
  leftColumnSections: [
    "skills",
    "education",
    "languages",
    "certificates",
    "interests",
  ],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "awards",
    "publications",
    "references",
    "custom",
  ],
};

const developerConfig: TemplateConfig = {
  id: "developer",
  name: "Developer",
  layoutType: "single-column",
  defaultThemeColor: "#22c55e",
};

const developer2Config: TemplateConfig = {
  id: "developer2",
  name: "Developer 2",
  layoutType: "two-column-sidebar-left",
  defaultThemeColor: "#3b82f6",
  leftColumnSections: [
    "skills",
    "education",
    "languages",
    "certificates",
    "interests",
  ],
  rightColumnSections: [
    "summary",
    "work",
    "projects",
    "awards",
    "publications",
    "references",
    "custom",
  ],
};

// ============================================================================
// CREATE TEMPLATES
// ============================================================================

const ats = createTemplate(atsConfig);
const classic = createTemplate(classicConfig);
const modern = createTemplate(modernConfig);
const creative = createTemplate(creativeConfig);
const professional = createTemplate(professionalConfig);
const elegant = createTemplate(elegantConfig);
const classicSlate = createTemplate(classicSlateConfig);
const glow = createTemplate(glowConfig);
const multicolumn = createTemplate(multicolumnConfig);
const stylish = createTemplate(stylishConfig);
const timeline = createTemplate(timelineConfig);
const polished = createTemplate(polishedConfig);
const developer = createTemplate(developerConfig);
const developer2 = createTemplate(developer2Config);

// ============================================================================
// EXPORTS - Maintaining backwards compatibility with existing imports
// ============================================================================

// ATS Template
export const ATSTemplate = ats.Template;
export const generatePDF = ats.generatePDF;

// Classic Template
export const ClassicTemplate = classic.Template;
export const generateClassicPDF = classic.generatePDF;

// Modern Template
export const ModernTemplate = modern.Template;
export const generateModernPDF = modern.generatePDF;

// Creative Template
export const CreativeTemplate = creative.Template;
export const generateCreativePDF = creative.generatePDF;

// Professional Template
export const ProfessionalTemplate = professional.Template;
export const generateProfessionalPDF = professional.generatePDF;

// Elegant Template
export const ElegantTemplate = elegant.Template;
export const generateElegantPDF = elegant.generatePDF;

// Classic Slate Template
export const ClassicSlateTemplate = classicSlate.Template;
export const generateClassicSlatePDF = classicSlate.generatePDF;

// Glow Template
export const GlowTemplate = glow.Template;
export const generateGlowPDF = glow.generatePDF;

// Multicolumn Template
export const MulticolumnTemplate = multicolumn.Template;
export const generateMulticolumnPDF = multicolumn.generatePDF;

// Stylish Template
export const StylishTemplate = stylish.Template;
export const generateStylishPDF = stylish.generatePDF;

// Timeline Template
export const TimelineTemplate = timeline.Template;
export const generateTimelinePDF = timeline.generatePDF;

// Polished Template
export const PolishedTemplate = polished.Template;
export const generatePolishedPDF = polished.generatePDF;

// Developer Template
export const DeveloperTemplate = developer.Template;
export const generateDeveloperPDF = developer.generatePDF;

// Developer 2 Template
export const Developer2Template = developer2.Template;
export const generateDeveloper2PDF = developer2.generatePDF;

// ============================================================================
// TEMPLATE REGISTRY - For programmatic access
// ============================================================================

export const FACTORY_TEMPLATES = {
  ats,
  classic,
  modern,
  creative,
  professional,
  elegant,
  "classic-slate": classicSlate,
  glow,
  multicolumn,
  stylish,
  timeline,
  polished,
  developer,
  developer2,
} as const;

/**
 * Get a template by ID
 */
export function getFactoryTemplate(templateId: string) {
  return FACTORY_TEMPLATES[templateId as keyof typeof FACTORY_TEMPLATES] || ats;
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(FACTORY_TEMPLATES);
}
