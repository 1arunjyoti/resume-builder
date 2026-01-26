import { Document, Page, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { Resume } from "@/db";
import { getTemplateDefaults } from "@/lib/template-defaults";
import { mmToPt } from "@/lib/template-utils";
import "@/lib/fonts"; // Auto-registers all fonts
import { getSectionHeadingWrapperStyles } from "@/lib/template-styles";

// Sub-components
import { ClassicHeader } from "./ClassicHeader";
import { ClassicSummary } from "./ClassicSummary";
import { ClassicExperience } from "./ClassicExperience";
import { ClassicEducation } from "./ClassicEducation";
import { ClassicSkills } from "./ClassicSkills";
import { ClassicProjects } from "./ClassicProjects";
import { ClassicCertificates } from "./ClassicCertificates";
import { ClassicAwards } from "./ClassicAwards";
import { ClassicPublications } from "./ClassicPublications";
import { ClassicReferences } from "./ClassicReferences";
import { ClassicLanguages } from "./ClassicLanguages";
import { ClassicInterests } from "./ClassicInterests";
import { ClassicCustom } from "./ClassicCustom";

interface ClassicTemplateProps {
  resume: Resume;
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    certificates,
    languages,
    interests,
    publications,
    awards,
    references,
    custom,
  } = resume;

  // Merge template defaults with resume settings to ensure all values are defined
  const templateDefaults = getTemplateDefaults(
    resume.meta.templateId || "classic",
  );
  const settings = { ...templateDefaults, ...resume.meta.layoutSettings };

  // Defaults
  const fontSize = settings.fontSize;
  const lineHeight = settings.lineHeight;
  const sectionMargin = settings.sectionMargin;
  const bulletMargin = settings.bulletMargin;
  const marginH = mmToPt(settings.marginHorizontal);
  const marginV = mmToPt(settings.marginVertical);

  // Layout Controls
  const columnCount = settings.columnCount;
  const leftColumnWidthPercent = settings.leftColumnWidth;
  const rightColumnWidthPercent = 100 - leftColumnWidthPercent;
  const layoutHeaderPos = settings.headerPosition;
  const headerAlign: "left" | "center" | "right" =
    layoutHeaderPos === "left" || layoutHeaderPos === "right"
      ? layoutHeaderPos
      : "center";

  // Typography Constants
  const selectedFont = settings.fontFamily;
  const baseFont = selectedFont;
  const boldFont = selectedFont;
  const italicFont = selectedFont;

  // Helper to get color
  const colorTargets = settings.themeColorTarget;
  const getColor = (target: string, fallback: string = "#000000") => {
    return colorTargets.includes(target) ? resume.meta.themeColor : fallback;
  };

  // Styles
  const styles = StyleSheet.create({
    page: {
      paddingHorizontal: marginH,
      paddingVertical: marginV,
      fontFamily: baseFont,
      fontSize: fontSize,
      lineHeight: lineHeight,
      color: "#000",
      flexDirection: "column",
    },
    // Header
    header: {
      marginBottom: settings.headerBottomMargin,
      textAlign: headerAlign,
      borderBottomWidth: settings.sectionHeadingStyle === 1 ? 2 : 0,
      borderBottomColor: getColor("decorations"),
      borderBottomStyle: "solid",
      paddingBottom: 8,
      width: "100%",
    },
    name: {
      fontSize: settings.nameFontSize,
      fontFamily:
        settings.nameFont === "creative"
          ? "Helvetica"
          : settings.nameBold
            ? boldFont
            : baseFont,
      fontWeight:
        settings.nameBold || settings.nameFont === "creative"
          ? "bold"
          : "normal",
      marginBottom: 4,
      lineHeight: settings.nameLineHeight,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: getColor("name"),
    },
    label: {
      fontSize: settings.titleFontSize,
      marginBottom: 3,
      fontWeight: settings.titleBold ? "bold" : "normal",
      fontStyle: settings.titleItalic ? "italic" : "normal",
      fontFamily: settings.titleBold
        ? boldFont
        : settings.titleItalic
          ? italicFont
          : baseFont,
      lineHeight: settings.titleLineHeight,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent:
        headerAlign === "left"
          ? "flex-start"
          : headerAlign === "right"
            ? "flex-end"
            : "center",
      flexWrap: "wrap",
      rowGap: 2,
      columnGap: 0,
      fontSize: settings.contactFontSize,
      marginTop: 2,
    },

    // Columns
    columnsContainer: {
      flexDirection: "row",
      gap: 12, // Gap between columns
    },
    leftColumn: {
      width: `${leftColumnWidthPercent}%`,
    },
    rightColumn: {
      width: `${rightColumnWidthPercent}%`,
    },

    // Section Common
    section: {
      marginBottom: sectionMargin,
    },
    sectionTitleWrapper: getSectionHeadingWrapperStyles(settings, getColor),
    sectionTitle: {
      fontSize:
        settings.sectionHeadingSize === "L" ? fontSize + 4 : fontSize + 2,
      fontFamily: settings.sectionHeadingBold ? boldFont : baseFont,
      fontWeight: settings.sectionHeadingBold ? "bold" : "normal",
      textTransform: settings.sectionHeadingCapitalization,
      letterSpacing: 0.8,
      color: getColor("headings"),
    },

    // Entries
    entryBlock: {
      marginBottom: 6,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 2,
      flexWrap: "wrap",
    },
    entryTitle: {
      fontSize: settings.entryTitleSize === "L" ? fontSize + 3 : fontSize + 1,
      fontFamily: boldFont,
      fontWeight: "bold",
    },
    entryDate: {
      fontSize: fontSize,
      fontFamily: italicFont,
      fontStyle: "italic",
      textAlign: "right",
      minWidth: 60,
    },
    entrySubtitle: {
      fontSize: fontSize,
      fontFamily:
        settings.entrySubtitleStyle === "bold"
          ? boldFont
          : settings.entrySubtitleStyle === "italic"
            ? italicFont
            : baseFont,
      fontWeight: settings.entrySubtitleStyle === "bold" ? "bold" : "normal",
      fontStyle: settings.entrySubtitleStyle === "italic" ? "italic" : "normal",
      marginBottom: 2,
    },
    entrySummary: {
      fontSize: fontSize,
      marginTop: 1,
      marginBottom: 2,
      textAlign: settings.entryIndentBody ? "left" : "justify",
      marginLeft: settings.entryIndentBody ? 8 : 0,
    },

    // Lists/Bullets
    bulletList: {
      marginLeft: 10,
      marginTop: 1,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: bulletMargin,
    },
    bullet: {
      width: 8,
      fontSize: fontSize,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize,
    },

    // Grids (Skills etc)
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
  });

  // Common Props to pass to sub-components
  const commonProps = {
    settings,
    styles,
    getColor,
    fontSize,
    baseFont,
    boldFont,
    italicFont,
    lineHeight, // Passed although strict components define explicit props, but it's fine
  };

  const SECTION_RENDERERS = {
    summary: () => <ClassicSummary summary={basics.summary} {...commonProps} />,
    work: () => <ClassicExperience work={work} {...commonProps} />,
    education: () => (
      <ClassicEducation education={education} {...commonProps} />
    ),
    skills: () => (
      <ClassicSkills skills={skills} {...commonProps} lineHeight={lineHeight} />
    ),
    projects: () => <ClassicProjects projects={projects} {...commonProps} />,
    certificates: () => (
      <ClassicCertificates certificates={certificates} {...commonProps} />
    ),
    awards: () => <ClassicAwards awards={awards} {...commonProps} />,
    publications: () => (
      <ClassicPublications publications={publications} {...commonProps} />
    ),
    languages: () => (
      <ClassicLanguages languages={languages} {...commonProps} />
    ),
    interests: () => (
      <ClassicInterests interests={interests} {...commonProps} />
    ),
    references: () => (
      <ClassicReferences references={references} {...commonProps} />
    ),
    custom: () => <ClassicCustom custom={custom} {...commonProps} />,
  };

  const order =
    settings.sectionOrder && settings.sectionOrder.length > 0
      ? settings.sectionOrder
      : [
          "summary",
          "work",
          "education",
          "skills",
          "projects",
          "certificates",
          "languages",
          "interests",
          "awards",
          "publications",
          "references",
          "custom",
        ];

  // Logic to split sections if columnCount === 2
  const LHS_SECTIONS = [
    "skills",
    "education",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ];
  const RHS_SECTIONS = ["summary", "work", "projects", "custom"];

  const leftColumnContent = order.filter((id) => LHS_SECTIONS.includes(id));
  const rightColumnContent = order.filter((id) => RHS_SECTIONS.includes(id));

  // If a section is NOT in either list (e.g. unknown custom), put it in Right (Main).
  const knownSections = [...LHS_SECTIONS, ...RHS_SECTIONS];
  const orphans = order.filter((id) => !knownSections.includes(id));
  rightColumnContent.push(...orphans);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ClassicHeader basics={basics} {...commonProps} />

        {columnCount === 1 ? (
          <View>
            {order.map((sectionId) => {
              const renderer =
                SECTION_RENDERERS[sectionId as keyof typeof SECTION_RENDERERS];
              return renderer ? (
                <View key={sectionId}>{renderer()}</View>
              ) : null;
            })}
          </View>
        ) : (
          <View style={styles.columnsContainer}>
            {/* Left Column (Sidebar) */}
            <View style={styles.leftColumn}>
              {leftColumnContent.map((sectionId) => {
                const renderer =
                  SECTION_RENDERERS[
                    sectionId as keyof typeof SECTION_RENDERERS
                  ];
                return renderer ? (
                  <View key={sectionId}>{renderer()}</View>
                ) : null;
              })}
            </View>

            {/* Right Column (Main) */}
            <View style={styles.rightColumn}>
              {rightColumnContent.map((sectionId) => {
                const renderer =
                  SECTION_RENDERERS[
                    sectionId as keyof typeof SECTION_RENDERERS
                  ];
                return renderer ? (
                  <View key={sectionId}>{renderer()}</View>
                ) : null;
              })}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function generateClassicPDF(resume: Resume): Promise<Blob> {
  const doc = <ClassicTemplate resume={resume} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
