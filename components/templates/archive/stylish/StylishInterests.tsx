/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from "@react-pdf/renderer";

export function StylishInterests({
  interests,
  styles,
  title,
}: any) {
  if (!interests || interests.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title || "Interests"}</Text>
      <View style={styles.bulletList}>
        {interests.map((interest: any, index: number) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{interest.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
