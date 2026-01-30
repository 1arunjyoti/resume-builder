import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface DeveloperLanguagesProps {
  languages: Resume["languages"];
  themeColor: string;
}

export const DeveloperLanguages = ({
  languages,
  themeColor,
}: DeveloperLanguagesProps) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: "#252526",
      borderRadius: 5,
      borderLeftWidth: 2,
      borderLeftColor: themeColor,
    },
    heading: {
      fontSize: 14,
      color: themeColor,
      fontFamily: "Courier",
      marginBottom: 5,
    },
    codeBlock: {
      fontFamily: "Courier",
      fontSize: 9,
      color: "#D4D4D4",
    },
    keyword: { color: "#C586C0" }, // Purple for 'const' etc if used, or just logical keywords
    bracket: { color: "#D4D4D4" },
    string: { color: "#CE9178" },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#Languages</Text>
      <View style={styles.codeBlock}>
        {languages.map((lang, index) => (
          <View key={index} style={{ marginBottom: 2 }}>
            <Text>
              <Text style={styles.keyword}>{lang.language}</Text>
              <Text style={styles.bracket}>: </Text>
              <Text style={styles.string}>&quot;{lang.fluency}&quot;</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
