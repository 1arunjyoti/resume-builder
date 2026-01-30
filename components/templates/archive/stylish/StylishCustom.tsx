/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from "@react-pdf/renderer";

export function StylishCustom({ custom, styles }: any) {
  if (!custom || custom.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Custom Section</Text>
      {/* Implementation depends on custom data structure, generic fallback */}
      <Text style={styles.entrySummary}>Custom content here</Text>
    </View>
  );
}
