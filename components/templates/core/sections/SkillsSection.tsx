/**
 * SkillsSection - Universal skills section component
 * 
 * Supports multiple display styles:
 * - grid: Skills grouped in columns with keywords
 * - level: Skills with proficiency indicators
 * - compact: Inline comma-separated keywords
 * - bubble: Tag/pill style display
 */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Skill, LayoutSettings } from "@/db";
import { SectionHeading } from "../primitives";
import { getLevelScore } from "@/lib/template-utils";
import type { FontConfig, GetColorFn, SectionHeadingStyle } from "../types";

export interface SkillsSectionProps {
  skills: Skill[];
  settings: LayoutSettings;
  fonts: FontConfig;
  fontSize: number;
  getColor: GetColorFn;
  lineHeight?: number;
  sectionTitle?: string;
  sectionMargin?: number;
  containerStyle?: object;
  /** Override display style */
  displayStyle?: "grid" | "level" | "compact" | "bubble";
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  settings,
  fonts,
  fontSize,
  getColor,
  lineHeight = 1.3,
  sectionTitle = "Skills",
  sectionMargin,
  containerStyle,
  displayStyle,
}) => {
  if (!skills || skills.length === 0) return null;

  const themeColor = getColor("decorations", "#3b82f6");
  const style = displayStyle || settings.skillsDisplayStyle || "grid";
  const levelStyle = settings.skillsLevelStyle || 0;

  const styles = StyleSheet.create({
    container: {
      marginBottom: sectionMargin ?? settings.sectionMargin ?? 12,
      ...containerStyle,
    },
    // Grid style
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    gridItem: {
      marginBottom: 6,
      minWidth: "45%",
    },
    skillName: {
      fontSize: fontSize + 1,
      fontFamily: fonts.bold,
      fontWeight: "bold",
      color: "#1a1a1a",
      marginBottom: 2,
    },
    skillKeywords: {
      fontSize,
      color: "#555555",
      lineHeight,
    },
    // Level style
    levelContainer: {
      marginBottom: 6,
    },
    levelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    levelName: {
      fontSize,
      fontFamily: fonts.base,
      color: "#333333",
    },
    levelIndicator: {
      flexDirection: "row",
      gap: 2,
    },
    levelDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    levelBar: {
      height: 4,
      borderRadius: 2,
    },
    levelBarContainer: {
      width: 60,
      height: 4,
      backgroundColor: "#e5e7eb",
      borderRadius: 2,
    },
    // Compact style
    compactContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    compactItem: {
      fontSize,
      color: "#444444",
    },
    // Bubble/Tag style
    bubbleContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    bubble: {
      backgroundColor: themeColor + "15",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    bubbleText: {
      fontSize: fontSize - 1,
      color: "#374151",
    },
    bubbleCategory: {
      marginBottom: 8,
    },
    bubbleCategoryName: {
      fontSize,
      fontFamily: fonts.bold,
      fontWeight: "bold",
      color: "#1a1a1a",
      marginBottom: 4,
    },
  });

  // Render level indicator based on style
  const renderLevelIndicator = (level: string) => {
    const score = getLevelScore(level);
    
    // Style 0: No indicator
    if (levelStyle === 0) return null;

    // Style 1: Dots
    if (levelStyle === 1) {
      return (
        <View style={styles.levelIndicator}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.levelDot,
                {
                  backgroundColor: i <= score ? themeColor : "#e5e7eb",
                },
              ]}
            />
          ))}
        </View>
      );
    }

    // Style 2: Squares
    if (levelStyle === 2) {
      return (
        <View style={styles.levelIndicator}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.levelDot,
                {
                  borderRadius: 0,
                  backgroundColor: i <= score ? themeColor : "#e5e7eb",
                },
              ]}
            />
          ))}
        </View>
      );
    }

    // Style 3: Signal bars (growing height)
    if (levelStyle === 3) {
      return (
        <View style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "flex-end",
          height: 10,
        }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{
                width: 4,
                height: i * 2,
                backgroundColor: i <= score ? themeColor : "#e5e7eb",
              }}
            />
          ))}
        </View>
      );
    }

    // Style 4: Text label
    if (levelStyle === 4) {
      return (
        <Text style={{ fontSize: fontSize - 1, color: "#666666" }}>
          {level}
        </Text>
      );
    }

    return null;
  };

  // Render based on display style
  const renderContent = () => {
    switch (style) {
      case "grid":
        return (
          <View style={styles.grid}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.gridItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                {skill.keywords.length > 0 && (
                  <Text style={styles.skillKeywords}>
                    {skill.keywords.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        );

      case "level":
        return (
          <View>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.levelContainer}>
                <View style={styles.levelRow}>
                  <Text style={styles.levelName}>{skill.name}</Text>
                  {skill.level && renderLevelIndicator(skill.level)}
                </View>
                {skill.keywords.length > 0 && (
                  <Text style={styles.skillKeywords}>
                    {skill.keywords.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        );

      case "compact":
        // Flatten all keywords into a single list
        const allKeywords = skills.flatMap((skill) => 
          skill.keywords.length > 0 ? skill.keywords : [skill.name]
        );
        return (
          <View style={styles.compactContainer}>
            <Text style={styles.compactItem}>
              {allKeywords.join(" • ")}
            </Text>
          </View>
        );

      case "bubble":
        return (
          <View>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.bubbleCategory}>
                {skill.name && (
                  <Text style={styles.bubbleCategoryName}>{skill.name}</Text>
                )}
                <View style={styles.bubbleContainer}>
                  {skill.keywords.map((keyword, i) => (
                    <View key={i} style={styles.bubble}>
                      <Text style={styles.bubbleText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Heading */}
      {(settings.skillsHeadingVisible ?? true) && (
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

      {renderContent()}
    </View>
  );
};

export default SkillsSection;
