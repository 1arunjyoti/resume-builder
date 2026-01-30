/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View } from "@react-pdf/renderer";

export function StylishCertificates({
  certificates,
  settings,
  styles,
}: any) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certificates</Text>
      <View style={styles.bulletList}>
        {certificates.map((cert: any, index: number) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <View>
              <Text style={[styles.bulletText, { fontWeight: "bold" }]}>
                {cert.name}
              </Text>
              {cert.issuer && (
                <Text
                  style={[
                    styles.bulletText,
                    { fontSize: settings.fontSize - 1, color: "#666" },
                  ]}
                >
                  {cert.issuer}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
