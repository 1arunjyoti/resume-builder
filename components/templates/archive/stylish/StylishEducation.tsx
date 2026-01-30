/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from "@react-pdf/renderer";

export function StylishEducation({ education, styles }: any) {
  if (!education || education.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((edu: any, index: number) => (
        <View key={index} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>
              {edu.studyType} in {edu.area}
            </Text>
            <Text style={styles.entrySubtitle}>{edu.institution}</Text>
            <Text style={styles.entryDate}>
              {edu.startDate} - {edu.endDate || "Present"}
            </Text>
          </View>
          {edu.score && (
            <Text style={styles.entrySummary}>GPA: {edu.score}</Text>
          )}
          {edu.courses && edu.courses.length > 0 && (
            <View style={styles.bulletList}>
              <Text style={[styles.entrySummary, { fontStyle: "italic" }]}>
                Courses: {edu.courses.join(", ")}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
