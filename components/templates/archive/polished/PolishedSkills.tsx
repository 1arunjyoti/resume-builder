/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface PolishedSkillsProps {
  skills: Resume["skills"];
  settings: any;
  themeColor: string;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  fontSize: number;
  isSidebar?: boolean; // To adjust text color
}

export function PolishedSkills({
  skills,
  isSidebar = true,
  baseFont,
  fontSize,
}: PolishedSkillsProps) {
  const textColor = isSidebar ? "#FFFFFF" : "#333333";
  const headingColor = isSidebar ? "#FFFFFF" : "#333333";
  const borderColor = isSidebar ? "#FFFFFF" : "#ccc";

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    heading: {
      fontSize: fontSize + 1,
      fontFamily: baseFont,
      fontWeight: "bold",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      paddingBottom: 4,
      color: headingColor,
    },
    skillItem: {
      marginBottom: 6,
    },
    skillName: {
      fontSize: fontSize,
      fontFamily: baseFont,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 2,
    },
    keywords: {
      fontSize: fontSize - 1,
      color: isSidebar ? "#EEE" : "#555",
      lineHeight: 1.3,
    },
  });

  if (!skills || skills.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SKILLS</Text>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillItem}>
          {/* If user inputs "Language" as name and "Typescript, Javascript" as keywords */}
          {skill.name && <Text style={styles.skillName}>{skill.name}</Text>}
          {skill.keywords && skill.keywords.length > 0 && (
            <Text style={styles.keywords}>{skill.keywords.join(", ")}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
