"use client";

import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeStore } from "@/store/useResumeStore";
import { getTemplateDefaults, getTemplateThemeColor } from "@/lib/template-defaults";
import { RotateCcw, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// Import new components
import { AwardsSettings } from "./design/sections/AwardsSettings";
import { CertificatesSettings } from "./design/sections/CertificatesSettings";
import { CustomSectionSettings } from "./design/sections/CustomSectionSettings";
import { EducationSettings } from "./design/sections/EducationSettings";
import { EntryLayoutSettings } from "./design/sections/EntryLayoutSettings";
import { ExperienceSettings } from "./design/sections/ExperienceSettings";
import { HeaderSettings } from "./design/sections/HeaderSettings";
import { InterestsSettings } from "./design/sections/InterestsSettings";
import { LanguagesSettings } from "./design/sections/LanguagesSettings";
import { PageLayoutSettings } from "./design/sections/PageLayoutSettings";
import { ProjectsSettings } from "./design/sections/ProjectsSettings";
import { PublicationsSettings } from "./design/sections/PublicationsSettings";
import { ReferencesSettings } from "./design/sections/ReferencesSettings";
import { SectionHeadingSettings } from "./design/sections/SectionHeadingSettings";
import { SkillsSettings } from "./design/sections/SkillsSettings";
import { ThemeSettings } from "./design/sections/ThemeSettings";
import { TypographySettings } from "./design/sections/TypographySettings";

import { LayoutSettings, LayoutSettingValue } from "./design/types";

export function DesignSettings() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateCurrentResume = useResumeStore(
    (state) => state.updateCurrentResume,
  );

  // Collapsible state
  const [openSections, setOpenSections] = useState({
    layout: true,
    header: false,
    spacing: false,
    entryLayout: false,
    sectionHeadings: false,
    skills: false,
    languages: false,
    interests: false,
    certificates: false,
    themeColor: false,
    work: false,
    education: false,
    publications: false,
    awards: false,
    references: false,
    custom: false,
    projects: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const expandAll = () => {
    setOpenSections((prev) => {
      const next = { ...prev };
      (Object.keys(next) as Array<keyof typeof prev>).forEach((k) => {
        next[k] = true;
      });
      return next;
    });
  };

  const collapseAll = () => {
    setOpenSections((prev) => {
      const next = { ...prev };
      (Object.keys(next) as Array<keyof typeof prev>).forEach((k) => {
        next[k] = false;
      });
      return next;
    });
  };

  const allExpanded = Object.values(openSections).every(Boolean);

  if (!currentResume) return null;

  const layoutSettings = currentResume.meta.layoutSettings || {
    fontSize: 8.5,
    lineHeight: 1.2,
    sectionMargin: 8,
    bulletMargin: 2,
    useBullets: true,
    columnCount: 1,
    headerPosition: "top",
    leftColumnWidth: 30,
    sectionOrder: [
      "education",
      "skills",
      "work",
      "projects",
      "certificates",
      "publications",
      "awards",
      "languages",
      "interests",
      "references",
      "custom",
    ],
    sectionHeadingStyle: 1,
    sectionHeadingAlign: "left",
    sectionHeadingBold: true,
    sectionHeadingCapitalization: "uppercase",
    sectionHeadingSize: "M",
    sectionHeadingIcons: "none",
    summaryHeadingVisible: true,
    workHeadingVisible: true,
    educationHeadingVisible: true,
    skillsHeadingVisible: true,
    languagesHeadingVisible: true,
    projectsHeadingVisible: true,
    certificatesHeadingVisible: true,
    interestsHeadingVisible: true,
    publicationsHeadingVisible: true,
    awardsHeadingVisible: true,
    referencesHeadingVisible: true,
    customHeadingVisible: true,
    entryLayoutStyle: 1,
    entryColumnWidth: "auto",
    entryTitleSize: "M",
    entrySubtitleStyle: "italic",
    entrySubtitlePlacement: "nextLine",
    entryIndentBody: false,
    entryListStyle: "bullet",
    personalDetailsAlign: "center",
    personalDetailsArrangement: 1,
    personalDetailsContactStyle: "icon",
    personalDetailsIconStyle: 1,
    nameSize: "M",
    nameFontSize: 28,
    nameLineHeight: 1.2,
    nameBold: true,
    nameFont: "body",
    titleFontSize: 14,
    titleLineHeight: 1.2,
    titleBold: false,
    titleItalic: true,
    contactFontSize: 10,
    contactBold: false,
    contactItalic: false,
    contactSeparator: "pipe",
    showProfileImage: true,
    profileImageSize: "M",
    profileImageShape: "circle",
    profileImageBorder: false,
    skillsDisplayStyle: "grid",
    skillsLevelStyle: 3,
    skillsListStyle: "blank",
    languagesListStyle: "bullet",
    languagesNameBold: true,
    languagesNameItalic: false,
    languagesFluencyBold: false,
    languagesFluencyItalic: false,
    interestsListStyle: "bullet",
    interestsNameBold: true,
    interestsNameItalic: false,
    interestsKeywordsBold: false,
    interestsKeywordsItalic: false,
    publicationsListStyle: "bullet",
    publicationsNameBold: true,
    publicationsNameItalic: false,
    publicationsPublisherBold: false,
    publicationsPublisherItalic: false,
    publicationsUrlBold: false,
    publicationsUrlItalic: false,
    publicationsDateBold: false,
    publicationsDateItalic: false,
    awardsListStyle: "bullet",
    awardsTitleBold: true,
    awardsTitleItalic: false,
    awardsAwarderBold: false,
    awardsAwarderItalic: false,
    awardsDateBold: false,
    awardsDateItalic: false,
    referencesListStyle: "bullet",
    referencesNameBold: true,
    referencesNameItalic: false,
    referencesPositionBold: false,
    referencesPositionItalic: false,
    // Custom Section Defaults
    customSectionListStyle: "bullet",
    customSectionNameBold: true,
    customSectionNameItalic: false,
    customSectionDescriptionBold: false,
    customSectionDescriptionItalic: false,
    customSectionDateBold: false,
    customSectionDateItalic: false,
    customSectionUrlBold: false,
    customSectionUrlItalic: false,
    // Certificate Defaults
    certificatesListStyle: "bullet",
    certificatesNameBold: true,
    certificatesNameItalic: false,
    certificatesIssuerBold: false,
    certificatesIssuerItalic: false,
    certificatesDateBold: false,
    certificatesDateItalic: false,
    certificatesUrlBold: false,
    certificatesUrlItalic: false,
    certificatesDisplayStyle: "compact",
    certificatesLevelStyle: 3,
    // Experience Defaults
    experienceCompanyListStyle: "none",
    experienceCompanyBold: true,
    experienceCompanyItalic: false,
    experiencePositionBold: false,
    experiencePositionItalic: false,
    experienceWebsiteBold: false,
    experienceWebsiteItalic: false,
    experienceDateBold: false,
    experienceDateItalic: false,
    experienceAchievementsListStyle: "bullet",
    experienceAchievementsBold: false,
    experienceAchievementsItalic: false,
    // Education Defaults
    educationInstitutionListStyle: "none",
    educationInstitutionBold: true,
    educationInstitutionItalic: false,
    educationDegreeBold: false,
    educationDegreeItalic: false,
    educationAreaBold: false,
    educationAreaItalic: false,
    educationDateBold: false,
    educationDateItalic: false,
    educationGpaBold: false,
    educationGpaItalic: false,
    educationCoursesBold: false,
    educationCoursesItalic: false,
  };

  const updateSetting = (
    key: keyof LayoutSettings,
    value: LayoutSettingValue,
  ) => {
    updateCurrentResume({
      meta: {
        ...currentResume.meta,
        layoutSettings: {
          ...layoutSettings,
          [key]: value,
        },
      },
    });
  };

  const updateThemeColor = (color: string) => {
    updateCurrentResume({
      meta: {
        ...currentResume.meta,
        themeColor: color,
      },
    });
  };

  const resetToDefaults = () => {
    if (confirm(`Reset all design settings to ${currentResume.meta.templateId.toUpperCase()} template defaults?`)) {
      const templateDefaults = getTemplateDefaults(currentResume.meta.templateId);
      const themeColor = getTemplateThemeColor(currentResume.meta.templateId);
      
      updateCurrentResume({
        meta: {
          ...currentResume.meta,
          themeColor,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          layoutSettings: templateDefaults as any,
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b shrink-0 bg-background z-10">
        <h2 className="font-semibold">Design Settings</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={allExpanded ? collapseAll : expandAll}
            title={allExpanded ? "Collapse All" : "Expand All"}
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetToDefaults}
            title="Reset to Defaults"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-b lg:border-none">
        <div className="p-4 md:p-6 space-y-4 sm:pb-20">
          <PageLayoutSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.layout}
            onToggle={() => toggleSection("layout")}
          />

          <HeaderSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.header}
            onToggle={() => toggleSection("header")}
          />

          <TypographySettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.spacing}
            onToggle={() => toggleSection("spacing")}
          />

          <ThemeSettings
            layoutSettings={layoutSettings}
            currentThemeColor={currentResume.meta.themeColor || "#000000"}
            updateSetting={updateSetting}
            updateThemeColor={updateThemeColor}
            isOpen={openSections.themeColor}
            onToggle={() => toggleSection("themeColor")}
          />

          <SectionHeadingSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.sectionHeadings}
            onToggle={() => toggleSection("sectionHeadings")}
          />

          <EntryLayoutSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.entryLayout}
            onToggle={() => toggleSection("entryLayout")}
          />

          <ExperienceSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.work}
            onToggle={() => toggleSection("work")}
          />

          <ProjectsSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.projects}
            onToggle={() => toggleSection("projects")}
          />

          <EducationSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.education}
            onToggle={() => toggleSection("education")}
          />

          <SkillsSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.skills}
            onToggle={() => toggleSection("skills")}
          />

          <LanguagesSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.languages}
            onToggle={() => toggleSection("languages")}
          />

          <InterestsSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.interests}
            onToggle={() => toggleSection("interests")}
          />

          <CertificatesSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.certificates}
            onToggle={() => toggleSection("certificates")}
          />

          <PublicationsSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.publications}
            onToggle={() => toggleSection("publications")}
          />

          <AwardsSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.awards}
            onToggle={() => toggleSection("awards")}
          />

          <ReferencesSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.references}
            onToggle={() => toggleSection("references")}
          />

          <CustomSectionSettings
            layoutSettings={layoutSettings}
            updateSetting={updateSetting}
            isOpen={openSections.custom}
            onToggle={() => toggleSection("custom")}
          />
        </div>
      </div>
    </div>
  );
}
