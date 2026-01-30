import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface DeveloperSkillsProps {
  skills: Resume["skills"];
  themeColor: string;
}

export const DeveloperSkills = ({
  skills,
  themeColor,
}: DeveloperSkillsProps) => {
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
    // Array style
    bracket: { color: "#F1D700" }, // Yellow brackets
    string: { color: "#CE9178" },
    comma: { color: "#D4D4D4" },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#TechnicalSkills</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.bracket}>{"{"}</Text>
        <View style={{ marginLeft: 15 }}>
          {skills.map((skillGroup, index) => (
            <View key={index} style={{ marginBottom: 2 }}>
              <Text>
                <Text style={styles.bracket}>[</Text>
                {skillGroup.keywords.map((kw, kIndex) => (
                  <Text key={kIndex}>
                    <Text style={styles.string}>&quot;{kw}&quot;</Text>
                    {kIndex < skillGroup.keywords.length - 1 && (
                      <Text style={styles.comma}>, </Text>
                    )}
                  </Text>
                ))}
                <Text style={styles.bracket}>]</Text>
                {index < skills.length - 1 && (
                  <Text style={styles.comma}>,</Text>
                )}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.bracket}>{"}"}</Text>
      </View>
    </View>
  );
};
