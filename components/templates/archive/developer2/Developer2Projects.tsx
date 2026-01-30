import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2ProjectsProps {
  projects: Resume["projects"];
  fontFamily?: string;
}

export const Developer2Projects = ({
  projects,
  fontFamily = "Helvetica",
}: Developer2ProjectsProps) => {
  const styles = StyleSheet.create({
    item: {
      marginBottom: 10,
    },
    name: {
      fontSize: 12,
      color: "#FFFFFF",
      fontFamily: fontFamily,
      fontWeight: "bold",
      marginBottom: 2,
    },
    description: {
      fontSize: 10,
      color: "#CCCCCC",
      fontFamily: fontFamily,
      marginBottom: 2,
    },
    tech: {
      fontSize: 9,
      color: "#AAAAAA",
      fontStyle: "italic", // Optional styled
      fontFamily: fontFamily,
    },
  });

  return (
    <View>
      {projects.map((proj, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.name}>{proj.name}</Text>
          <Text style={styles.description}>{proj.description}</Text>
          {proj.keywords && proj.keywords.length > 0 && (
            <Text style={styles.tech}>using {proj.keywords.join(" and ")}</Text>
          )}
        </View>
      ))}
    </View>
  );
};
