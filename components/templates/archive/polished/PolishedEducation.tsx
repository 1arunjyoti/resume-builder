/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface PolishedEducationProps {
  education: Resume["education"];
  settings: any;
  themeColor: string;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  fontSize: number;
}

export function PolishedEducation({
  education,
  themeColor,
  baseFont,
  fontSize,
}: PolishedEducationProps) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    heading: {
      fontSize: fontSize + 2,
      fontFamily: baseFont,
      fontWeight: "normal",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: 4,
      color: "#333",
    },
    entry: {
      marginBottom: 8,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    institution: {
      fontSize: fontSize + 1,
      fontFamily: baseFont,
      color: themeColor,
      fontWeight: "bold",
    },
    date: {
      fontSize: fontSize,
      fontFamily: baseFont,
      color: "#666",
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    area: {
      fontSize: fontSize,
      fontFamily: baseFont,
      fontWeight: "bold",
      color: "#333",
    },
    location: {
      fontSize: fontSize, // Small font for location
      color: "#666",
    },
  });

  if (!education || education.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>EDUCATION</Text>
      {education.map((edu, index) => (
        <View key={index} style={styles.entry}>
          <View style={styles.headerRow}>
            <Text style={styles.area}>
              {edu.studyType} in {edu.area}
            </Text>
            <Text style={styles.date}>
              {edu.startDate} - {edu.endDate || "Present"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.institution}>{edu.institution}</Text>
            {/* Location might not be in standard schema, using city if available or skip */}
            <Text style={styles.location}>{/* Location? */}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
