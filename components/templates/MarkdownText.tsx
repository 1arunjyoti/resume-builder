import { Text, Link } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

interface MarkdownTextProps {
  text: string;
  style?: Style | Style[];
}

export const MarkdownText = ({ text, style }: MarkdownTextProps) => {
  if (!text) return null;

  // Handle alignment wrapper (e.g., <div align="center">...</div>)
  let align = "left";
  let content = text;
  const alignMatch = text.match(
    /^<div align="(left|center|right|justify)">([\s\S]*)<\/div>$/
  );
  if (alignMatch) {
    align = alignMatch[1];
    content = alignMatch[2];
  }

  // Split by markdown/formatting tokens
  // Support: **bold**, *italic*, <u>underline</u>, [link](url)
  const parts = content.split(
    /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|\[.*?\]\(.*?\))/g
  );

  return (
    <Text
      style={{
        ...style,
        textAlign: align as "left" | "right" | "center" | "justify",
      }}
    >
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={index} style={{ fontWeight: "bold" }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <Text key={index} style={{ fontStyle: "italic" }}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        if (part.startsWith("<u>") && part.endsWith("</u>")) {
          return (
            <Text key={index} style={{ textDecoration: "underline" }}>
              {part.slice(3, -4)}
            </Text>
          );
        }
        if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
          const split = part.slice(1, -1).split("](");
          if (split.length === 2) {
            return (
              <Link key={index} src={split[1]}>
                {split[0]}
              </Link>
            );
          }
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};
