/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from "@react-pdf/renderer";

export function StylishExperience({ work, styles }: any) {
  if (!work || work.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {work.map((job: any, index: number) => (
        <View key={index} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{job.position}</Text>
            <Text style={styles.entrySubtitle}>{job.name}</Text>
            <Text style={styles.entryDate}>
              {job.startDate} - {job.endDate || "Present"} | {job.location}
            </Text>
          </View>
          <Text style={styles.entrySummary}>{job.summary}</Text>

          {job.highlights && job.highlights.length > 0 && (
            <View style={styles.bulletList}>
              {job.highlights.map((highlight: string, idx: number) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{highlight}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
