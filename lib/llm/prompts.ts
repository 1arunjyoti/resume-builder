export function buildSummaryPrompt(input: string): string {
  return [
    "You are a resume assistant.",
    "Write a concise professional summary (3-5 sentences).",
    "Use active voice, avoid first-person pronouns, and keep it ATS-friendly.",
    "Ensure each sentence is complete and ends with proper punctuation.",
    "The summary should be original and introduce the candidate based on the details provided.",
    "",
    "Input:",
    input.trim(),
  ].join("\n");
}

export function buildSectionSummaryPrompt(section: string, input: string): string {
  return [
    "You are a resume assistant.",
    `Write a concise summary for the ${section} section (2-4 sentences).`,
    "Use active voice, avoid first-person pronouns, and keep it ATS-friendly.",
    "Ensure each sentence is complete and ends with proper punctuation.",
    "Generate original content that accurately represents the details provided.",
    "",
    "Input:",
    input.trim(),
  ].join("\n");
}

export function buildHighlightsPrompt(section: string, input: string): string {
  return [
    "You are a resume assistant.",
    `Generate 3-5 bullet achievements for the ${section} section.`,
    "Use action verbs, quantify impact where possible, and keep each bullet under 20 words.",
    "Each bullet must be a complete sentence and end with a period.",
    "Return one bullet per line without numbering.",
    "",
    "Input:",
    input.trim(),
  ].join("\n");
}

export function buildJobMatchPrompt(input: string): string {
  return [
    "You are a resume assistant.",
    "Analyze the job description and resume context.",
    "Return a JSON object with keys: summary, keywords, gaps, suggestions.",
    "summary: 3-5 sentences, ATS-friendly, tailored to the specific job.",
    "keywords: array of 8-15 single or multi-word keywords from the job description that should appear in the resume.",
    "gaps: array of 3-6 strings describing notable gaps between the resume and job requirements.",
    "suggestions: array of 3-6 actionable improvement suggestions to better match the job.",
    "Return only valid JSON without markdown or extra text.",
    "Return JSON on a single line and escape any quotes inside values.",
    "",
    "Input:",
    input.trim(),
  ].join("\n");
}

export function buildRewritePrompt(
  section: string,
  input: string,
  tone: "neutral" | "formal" | "concise",
  context?: string,
): string {
  const toneLine =
    tone === "formal"
      ? "Use a formal, polished tone."
      : tone === "concise"
        ? "Be concise and minimize filler words."
        : "Use a neutral, professional tone.";
  const contextLines = context
    ? ["", "Context about the candidate:", context]
    : [];
  return [
    "You are a resume assistant.",
    `Improve the tone and clarity of the ${section} content.`,
    toneLine,
    "Keep all factual details and avoid first-person pronouns.",
    "Ensure sentences are complete and end with proper punctuation.",
    "Return only the improved text without quotes or markdown.",
    "Do NOT generate entirely new content — refine the existing text.",
    ...contextLines,
    "",
    "Existing text to improve:",
    input.trim(),
  ].join("\n");
}

export function buildGrammarPrompt(section: string, input: string): string {
  return [
    "You are a grammar checker for a resume.",
    `Fix grammar, spelling, and punctuation errors in the ${section} content.`,
    "IMPORTANT RULES:",
    "- Do NOT change the meaning, facts, tone, or style.",
    "- Do NOT rephrase or restructure sentences.",
    "- Only fix actual grammar, spelling, and punctuation mistakes.",
    "- Keep sentence structure as close as possible to the original.",
    "- If there are NO grammar, spelling or punctuation errors, return exactly: NO_CHANGES",
    "- Return only the corrected text without quotes or markdown.",
    "",
    "Text to check:",
    input.trim(),
  ].join("\n");
}

/**
 * Build a prompt for AI-enhanced job match analysis
 */
export function buildJobMatchAnalysisPrompt(
  jobDescription: string,
  resumeContext: string,
): string {
  return [
    "You are an expert resume consultant and ATS optimization specialist.",
    "Analyze the job description against the resume and provide a detailed assessment.",
    "",
    "Return a JSON object with these keys:",
    "  overallFit: number (0-100) - how well the resume matches the job",
    "  summary: string - 3-5 sentence assessment of the fit",
    "  strengths: string[] - 3-5 things the resume does well for this job",
    "  weaknesses: string[] - 3-5 gaps or missing elements",
    "  keywords: string[] - 10-20 important keywords from the JD (include those both matched and missing)",
    "  matchedKeywords: string[] - keywords already in the resume",
    "  missingKeywords: string[] - keywords NOT in the resume that should be added",
    "  suggestions: string[] - 5-8 specific, actionable improvements",
    "  tailoredSummary: string - a rewritten professional summary tailored to this specific job",
    "",
    "Return only valid JSON without markdown code blocks.",
    "",
    "Job Description:",
    jobDescription.trim(),
    "",
    "Resume:",
    resumeContext.trim(),
  ].join("\n");
}

/**
 * Build a prompt for AI-enhanced ATS analysis
 */
export function buildATSAnalysisPrompt(
  resumeText: string,
  jobDescription?: string,
): string {
  const jdSection = jobDescription
    ? [
        "",
        "Target Job Description:",
        jobDescription.trim(),
      ]
    : [];
  return [
    "You are an expert ATS (Applicant Tracking System) analyst.",
    "Analyze the resume for ATS compatibility and provide actionable feedback.",
    "",
    "Return a JSON object with these keys:",
    "  score: number (0-100) - overall ATS compatibility score",
    "  strengths: string[] - 3-5 things done well for ATS",
    "  criticalIssues: string[] - 2-5 issues that could cause ATS rejection",
    "  improvements: string[] - 5-8 specific improvements ranked by impact",
    "  keywordSuggestions: string[] - 5-10 industry keywords to add",
    "  formatIssues: string[] - any formatting concerns for ATS parsing",
    "  summaryFeedback: string - specific feedback on the professional summary",
    "  bulletFeedback: { original: string, improved: string, reason: string }[] - up to 3 bullet rewrites",
    "",
    "Return only valid JSON without markdown code blocks.",
    ...jdSection,
    "",
    "Resume:",
    resumeText.trim(),
  ].join("\n");
}
