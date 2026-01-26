/**
 * SectionRegistry - Centralized section rendering for all templates
 * 
 * This registry provides a single entry point for rendering any resume section.
 * Templates can use this to render sections dynamically based on section order,
 * or render sections directly using the exported components.
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import type { Resume, LayoutSettings } from "@/db";
import type { FontConfig, GetColorFn } from "./types";

import {
  WorkSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificatesSection,
  LanguagesSection,
  InterestsSection,
  PublicationsSection,
  AwardsSection,
  ReferencesSection,
  SummarySection,
  CustomSection,
} from "./sections";

/**
 * Common props passed to the section registry
 */
export interface SectionRegistryProps {
  resume: Resume;
  settings: LayoutSettings;
  fonts: FontConfig;
  fontSize: number;
  getColor: GetColorFn;
  lineHeight?: number;
  sectionMargin?: number;
}

/**
 * Section ID type
 */
export type SectionId = 
  | "summary"
  | "work"
  | "education"
  | "skills"
  | "projects"
  | "certificates"
  | "languages"
  | "interests"
  | "publications"
  | "awards"
  | "references"
  | "custom";

/**
 * Get data for a section from the resume
 */
export function getSectionData(resume: Resume, sectionId: SectionId): unknown {
  switch (sectionId) {
    case "summary":
      return resume.basics.summary;
    case "work":
      return resume.work;
    case "education":
      return resume.education;
    case "skills":
      return resume.skills;
    case "projects":
      return resume.projects;
    case "certificates":
      return resume.certificates;
    case "languages":
      return resume.languages;
    case "interests":
      return resume.interests;
    case "publications":
      return resume.publications;
    case "awards":
      return resume.awards;
    case "references":
      return resume.references;
    case "custom":
      return resume.custom;
    default:
      return null;
  }
}

/**
 * Check if a section has data
 */
export function hasSectionData(resume: Resume, sectionId: SectionId): boolean {
  const data = getSectionData(resume, sectionId);
  if (data === null || data === undefined) return false;
  if (typeof data === "string") return data.length > 0;
  if (Array.isArray(data)) return data.length > 0;
  return true;
}

/**
 * Render a single section by ID
 */
export function renderSection(
  sectionId: SectionId,
  props: SectionRegistryProps
): React.ReactNode {
  const { resume, settings, fonts, fontSize, getColor, lineHeight, sectionMargin } = props;
  
  const commonProps = {
    settings,
    fonts,
    fontSize,
    getColor,
    lineHeight,
    sectionMargin,
  };

  switch (sectionId) {
    case "summary":
      return resume.basics.summary ? (
        <SummarySection
          key="summary"
          summary={resume.basics.summary}
          {...commonProps}
        />
      ) : null;

    case "work":
      return resume.work.length > 0 ? (
        <WorkSection
          key="work"
          work={resume.work}
          {...commonProps}
        />
      ) : null;

    case "education":
      return resume.education.length > 0 ? (
        <EducationSection
          key="education"
          education={resume.education}
          {...commonProps}
        />
      ) : null;

    case "skills":
      return resume.skills.length > 0 ? (
        <SkillsSection
          key="skills"
          skills={resume.skills}
          {...commonProps}
        />
      ) : null;

    case "projects":
      return resume.projects.length > 0 ? (
        <ProjectsSection
          key="projects"
          projects={resume.projects}
          {...commonProps}
        />
      ) : null;

    case "certificates":
      return resume.certificates.length > 0 ? (
        <CertificatesSection
          key="certificates"
          certificates={resume.certificates}
          {...commonProps}
        />
      ) : null;

    case "languages":
      return resume.languages.length > 0 ? (
        <LanguagesSection
          key="languages"
          languages={resume.languages}
          {...commonProps}
        />
      ) : null;

    case "interests":
      return resume.interests.length > 0 ? (
        <InterestsSection
          key="interests"
          interests={resume.interests}
          {...commonProps}
        />
      ) : null;

    case "publications":
      return resume.publications.length > 0 ? (
        <PublicationsSection
          key="publications"
          publications={resume.publications}
          {...commonProps}
        />
      ) : null;

    case "awards":
      return resume.awards.length > 0 ? (
        <AwardsSection
          key="awards"
          awards={resume.awards}
          {...commonProps}
        />
      ) : null;

    case "references":
      return resume.references.length > 0 ? (
        <ReferencesSection
          key="references"
          references={resume.references}
          {...commonProps}
        />
      ) : null;

    case "custom":
      return resume.custom.length > 0 ? (
        <CustomSection
          key="custom"
          custom={resume.custom}
          {...commonProps}
        />
      ) : null;

    default:
      return null;
  }
}

/**
 * Render multiple sections based on order
 */
export function renderSections(
  sectionIds: SectionId[],
  props: SectionRegistryProps
): React.ReactNode {
  return (
    <>
      {sectionIds.map((id) => renderSection(id, props))}
    </>
  );
}

/**
 * Component version of section renderer for use in JSX
 */
export interface SectionProps {
  id: SectionId;
  resume: Resume;
  settings: LayoutSettings;
  fonts: FontConfig;
  fontSize: number;
  getColor: GetColorFn;
  lineHeight?: number;
  sectionMargin?: number;
}

export const Section: React.FC<SectionProps> = ({
  id,
  resume,
  settings,
  fonts,
  fontSize,
  getColor,
  lineHeight,
  sectionMargin,
}) => {
  const node = renderSection(id, {
    resume,
    settings,
    fonts,
    fontSize,
    getColor,
    lineHeight,
    sectionMargin,
  });

  return node ? <View>{node}</View> : null;
};

/**
 * Component to render all sections based on order
 */
export interface SectionsProps extends SectionRegistryProps {
  /** Section IDs to render in order */
  order?: SectionId[];
  /** Sections to exclude */
  exclude?: SectionId[];
  /** Only render these sections */
  include?: SectionId[];
}

export const Sections: React.FC<SectionsProps> = ({
  order,
  exclude = [],
  include,
  ...props
}) => {
  const defaultOrder: SectionId[] = props.settings.sectionOrder as SectionId[] || [
    "summary",
    "work",
    "education",
    "skills",
    "projects",
    "certificates",
    "languages",
    "interests",
    "publications",
    "awards",
    "references",
    "custom",
  ];

  let sectionsToRender = order || defaultOrder;
  
  // Apply include filter
  if (include && include.length > 0) {
    sectionsToRender = sectionsToRender.filter((id) => include.includes(id));
  }
  
  // Apply exclude filter
  if (exclude.length > 0) {
    sectionsToRender = sectionsToRender.filter((id) => !exclude.includes(id));
  }

  return <>{renderSections(sectionsToRender, props)}</>;
};

export default Section;
