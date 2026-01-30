import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface DeveloperSummaryProps {
  summary: string;
  themeColor: string;
}

export const DeveloperSummary = ({
  summary,
  themeColor,
}: DeveloperSummaryProps) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: "#252526", // Slightly lighter dark
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
    brace: {
      color: "#D4D4D4",
    },
    key: {
      color: "#9CDCFE",
    },
    string: {
      color: "#CE9178",
      lineHeight: 1.4,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#Summary</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.brace}>{"{"}</Text>
        <Text style={{ marginLeft: 15 }}>
          <Text style={styles.string}>&quot;{summary}&quot;</Text>
        </Text>
        <Text style={styles.brace}>{"}"}</Text>
      </View>
    </View>
  );
};
