import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2SkillsProps {
  skills: Resume["skills"];
  fontFamily?: string;
}

export const Developer2Skills = ({
  skills,
  fontFamily = "Helvetica",
}: Developer2SkillsProps) => {
  const styles = StyleSheet.create({
    group: {
      marginBottom: 8,
    },
    label: {
      fontSize: 10,
      color: "#CCCCCC",
      fontFamily: fontFamily,
      flexDirection: "row",
    },
    bullet: {
      width: 3,
      height: 3,
      backgroundColor: "#CCCCCC",
      borderRadius: 2,
      marginRight: 5,
      marginTop: 4, // Align with text
    },
    row: {
      flexDirection: "row",
      marginBottom: 2,
    },
  });

  return (
    <View>
      {skills.map((skillGroup, index) => (
        <View key={index} style={styles.group}>
          {/* Flattening skills essentially or showing categories as bullets */}
          {/* Design shows: "- Programming Languages: Java, Python" */}
          <View style={styles.row}>
            <View style={styles.bullet} />
            <Text style={styles.label}>
              {skillGroup.name}: {skillGroup.keywords.join(", ")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
