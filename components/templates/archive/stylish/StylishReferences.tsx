import { Text, View } from "@react-pdf/renderer";

export function StylishReferences({
  references,
  settings,
  styles,
  getColor,
}: any) {
  if (!references || references.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>References</Text>
      {references.map((ref: any, index: number) => (
        <View key={index} style={styles.entryBlock}>
          <Text style={[styles.entryTitle, { fontSize: settings.fontSize }]}>
            {ref.name}
          </Text>
          <Text style={styles.entrySummary}>{ref.reference}</Text>
        </View>
      ))}
    </View>
  );
}
