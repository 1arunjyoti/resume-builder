/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface PolishedExperienceProps {
  work: Resume["work"];
  settings: any;
  themeColor: string;
  globalStyles?: any;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  italicFont: string;
  fontSize: number;
}

export function PolishedExperience({
  work,
  themeColor,
  baseFont,
  fontSize,
}: PolishedExperienceProps) {
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
      marginBottom: 10,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    position: {
      fontSize: fontSize + 1,
      fontFamily: baseFont, // Image seems to use normal weight but maybe larger
      fontWeight: "normal",
      color: "#333",
    },
    date: {
      fontSize: fontSize,
      fontFamily: baseFont,
      color: "#666",
    },
    companyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    company: {
      fontSize: fontSize,
      fontFamily: baseFont,
      color: themeColor, // Blue/Teal in image
      fontWeight: "bold",
    },
    location: {
      fontSize: fontSize,
      fontFamily: baseFont,
      color: "#666",
    },
    summary: {
      fontSize: fontSize,
      lineHeight: 1.4,
      color: "#444",
    },
    bullet: {
      flexDirection: "row",
      marginBottom: 2,
    },
    bulletPoint: {
      width: 10,
      fontSize: fontSize,
      color: "#444",
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize,
      color: "#444",
    },
  });

  if (!work || work.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>EXPERIENCE</Text>
      {work.map((job, index) => (
        <View key={index} style={styles.entry}>
          <View style={styles.headerRow}>
            <Text style={styles.position}>{job.position}</Text>
            <Text style={styles.date}>
              {job.startDate} - {job.endDate || "Present"}
            </Text>
          </View>
          <View style={styles.companyRow}>
            <Text style={styles.company}>{job.name}</Text>
            <Text style={styles.location}>{job.location}</Text>
          </View>
          {job.summary && (
            <View>
              {job.highlights && job.highlights.length > 0 ? (
                job.highlights.map((highlight, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.summary}>{job.summary}</Text>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
