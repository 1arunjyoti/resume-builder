import { Text, View } from "@react-pdf/renderer";

export function StylishPublications({
  publications,
  settings,
  styles,
  getColor,
}: any) {
  if (!publications || publications.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Publications</Text>
      {publications.map((pub: any, index: number) => (
        <View key={index} style={styles.entryBlock}>
          <Text style={[styles.entryTitle, { fontSize: settings.fontSize }]}>
            {pub.name}
          </Text>
          <Text style={styles.entrySubtitle}>{pub.publisher}</Text>
          <Text style={styles.entrySummary}>{pub.summary}</Text>
        </View>
      ))}
    </View>
  );
}
