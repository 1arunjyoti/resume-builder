import { Text, View } from "@react-pdf/renderer";

export function StylishProjects({ projects, settings, styles, getColor }: any) {
  if (!projects || projects.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((project: any, index: number) => (
        <View key={index} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{project.name}</Text>
            <Text style={[styles.entryDate, { textAlign: "left" }]}>
              {project.startDate} - {project.endDate || "Present"}
            </Text>
          </View>
          <Text style={styles.entrySummary}>{project.description}</Text>
          {project.highlights && project.highlights.length > 0 && (
            <View style={styles.bulletList}>
              {project.highlights.map((highlight: string, idx: number) => (
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
