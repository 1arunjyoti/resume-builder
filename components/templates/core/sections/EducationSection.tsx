/**
 * EducationSection - Universal education section component
 * 
 * Replaces all template-specific education components with a single,
 * fully configurable component.
 */

import React from "react";
import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { Education, LayoutSettings } from "@/db";
import { formatDate } from "@/lib/template-utils";
import { SectionHeading, BulletList, EntryHeader, RichText } from "../primitives";
import type { FontConfig, GetColorFn, ListStyle, EntryLayoutStyle, SectionHeadingStyle } from "../types";

export interface EducationSectionProps {
  education: Education[];
  settings: LayoutSettings;
  fonts: FontConfig;
  fontSize: number;
  getColor: GetColorFn;
  lineHeight?: number;
  sectionTitle?: string;
  sectionMargin?: number;
  containerStyle?: object;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  settings,
  fonts,
  fontSize,
  getColor,
  lineHeight = 1.3,
  sectionTitle = "Education",
  sectionMargin,
  containerStyle,
}) => {
  if (!education || education.length === 0) return null;

  const styles = StyleSheet.create({
    container: {
      marginBottom: sectionMargin ?? settings.sectionMargin ?? 12,
      ...containerStyle,
    },
    entryBlock: {
      marginBottom: 8,
    },
    detailRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 2,
    },
    detailText: {
      fontSize,
      color: "#555555",
    },
    scoreText: {
      fontSize,
      fontFamily: settings.educationGpaBold ? fonts.bold : settings.educationGpaItalic ? fonts.italic : fonts.base,
      fontWeight: settings.educationGpaBold ? "bold" : "normal",
      fontStyle: settings.educationGpaItalic ? "italic" : "normal",
      color: "#555555",
    },
    link: {
      fontSize: fontSize - 1,
      color: getColor("links", "#3b82f6"),
      textDecoration: "none",
    },
    coursesWrapper: {
      marginTop: 4,
    },
    coursesLabel: {
      fontSize,
      fontWeight: "bold",
      color: "#444444",
      marginBottom: 2,
    },
    summaryText: {
      fontSize,
      color: "#444444",
      marginTop: 2,
      lineHeight,
    },
  });

  const institutionListStyle: ListStyle = settings.educationInstitutionListStyle || "none";

  return (
    <View style={styles.container}>
      {/* Section Heading */}
      {(settings.educationHeadingVisible ?? true) && (
        <SectionHeading
          title={sectionTitle}
          style={settings.sectionHeadingStyle as SectionHeadingStyle}
          align={settings.sectionHeadingAlign}
          bold={settings.sectionHeadingBold}
          capitalization={settings.sectionHeadingCapitalization}
          size={settings.sectionHeadingSize}
          fontSize={fontSize}
          fontFamily={fonts.base}
          getColor={getColor}
          letterSpacing={(settings as unknown as Record<string, unknown>).sectionHeadingLetterSpacing as number}
        />
      )}

      {/* Education Entries */}
      {education.map((edu, index) => {
        const dateRange = `${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`;
        
        // Build degree string
        let degreeStr = edu.studyType || "";
        if (edu.area) {
          degreeStr += degreeStr ? ` in ${edu.area}` : edu.area;
        }

        return (
          <View key={edu.id} style={styles.entryBlock}>
            {/* Entry Header */}
            <EntryHeader
              title={edu.institution}
              subtitle={degreeStr}
              dateRange={dateRange}
              url={edu.url}
              layoutStyle={settings.entryLayoutStyle as EntryLayoutStyle}
              fontSize={fontSize}
              fonts={fonts}
              getColor={getColor}
              titleBold={settings.educationInstitutionBold}
              titleItalic={settings.educationInstitutionItalic}
              subtitleBold={settings.educationDegreeBold}
              subtitleItalic={settings.educationDegreeItalic}
              dateBold={settings.educationDateBold}
              dateItalic={settings.educationDateItalic}
              listStyle={institutionListStyle}
              index={index}
              showUrl={Boolean(edu.url)}
            />

            {/* Score/GPA */}
            {edu.score && (
              <Text style={styles.scoreText}>
                {edu.score.includes(":") || edu.score.toLowerCase().includes("gpa") 
                  ? edu.score 
                  : `GPA: ${edu.score}`}
              </Text>
            )}

            {/* URL if not shown in header */}
            {edu.url && settings.entryLayoutStyle !== 2 && (
              <Link src={edu.url} style={styles.link}>
                <Text style={styles.link}>
                  {edu.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </Text>
              </Link>
            )}

            {/* Summary */}
            {edu.summary && (
              <RichText
                text={edu.summary}
                fontSize={fontSize}
                fonts={fonts}
                lineHeight={lineHeight}
                style={styles.summaryText}
              />
            )}

            {/* Courses */}
            {edu.courses && edu.courses.length > 0 && (
              <View style={styles.coursesWrapper}>
                <Text style={styles.coursesLabel}>Relevant Coursework:</Text>
                <BulletList
                  items={edu.courses}
                  style="inline"
                  fontSize={fontSize}
                  fonts={fonts}
                  bold={settings.educationCoursesBold}
                  italic={settings.educationCoursesItalic}
                  textColor="#555555"
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default EducationSection;
