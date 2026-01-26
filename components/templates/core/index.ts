/**
 * Core Template Components
 * 
 * This module provides a unified component library for building PDF resume templates.
 * All templates should use these components to ensure consistent styling and 
 * automatic support for all customization options.
 * 
 * ## Architecture
 * 
 * ### Primitives
 * Low-level building blocks used to compose sections:
 * - SectionHeading - Configurable section titles with 8 visual styles
 * - BulletList - Flexible bullet/numbered lists
 * - EntryHeader - Title/subtitle/date layouts for entries
 * - ProfileImage - Profile photo with shape/size options
 * - ContactInfo - Contact details with multiple display styles
 * - RichText - Markdown-like text formatting
 * 
 * ### Sections
 * Complete section components that handle all data and styling:
 * - WorkSection - Professional experience
 * - EducationSection - Education history
 * - SkillsSection - Skills with multiple display styles
 * - ProjectsSection - Projects and portfolio items
 * - CertificatesSection - Professional certifications
 * - LanguagesSection - Language proficiencies
 * - InterestsSection - Personal interests
 * - PublicationsSection - Academic publications
 * - AwardsSection - Awards and achievements
 * - ReferencesSection - Professional references
 * - SummarySection - Professional summary/objective
 * - CustomSection - User-defined sections
 * 
 * ### Registry
 * Dynamic section rendering based on configuration:
 * - Section - Render a single section by ID
 * - Sections - Render multiple sections with ordering
 * - renderSection / renderSections - Functional alternatives
 * 
 * ## Usage
 * 
 * ```tsx
 * import { 
 *   WorkSection, 
 *   SkillsSection, 
 *   SectionHeading,
 *   Sections,
 *   createFontConfig,
 *   createGetColorFn
 * } from "@/components/templates/core";
 * 
 * // In your template:
 * const fonts = createFontConfig(settings.fontFamily);
 * const getColor = createGetColorFn(themeColor, settings.themeColorTarget);
 * 
 * // Option 1: Render specific sections
 * <WorkSection 
 *   work={resume.work} 
 *   settings={settings} 
 *   fonts={fonts} 
 *   fontSize={fontSize}
 *   getColor={getColor}
 * />
 * 
 * // Option 2: Render all sections dynamically
 * <Sections
 *   resume={resume}
 *   settings={settings}
 *   fonts={fonts}
 *   fontSize={fontSize}
 *   getColor={getColor}
 *   exclude={["summary"]}  // Rendered separately in header
 * />
 * ```
 */

// Types
export * from "./types";

// Primitives
export * from "./primitives";

// Sections
export * from "./sections";

// Registry
export {
  Section,
  Sections,
  renderSection,
  renderSections,
  getSectionData,
  hasSectionData,
} from "./SectionRegistry";

export type {
  SectionId,
  SectionProps,
  SectionsProps,
  SectionRegistryProps,
} from "./SectionRegistry";
