export function processGrammarOutput(input: string, output: string): {
  text?: string;
  noChanges?: boolean;
  error?: string;
} {
  const cleaned = output.trim();
  if (!cleaned) {
    return { error: "Grammar check returned empty output." };
  }
  if (cleaned === "NO_CHANGES") {
    return { noChanges: true };
  }
  // Normalize whitespace for comparison
  const normalizedInput = input.trim().replace(/\s+/g, " ");
  const normalizedOutput = cleaned.replace(/\s+/g, " ");
  if (normalizedInput === normalizedOutput) {
    return { noChanges: true };
  }
  return { text: cleaned };
}
