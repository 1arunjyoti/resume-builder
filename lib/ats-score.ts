import { Resume } from '@/db';

export interface ATSCheck {
  id: string;
  name: string;
  category: 'content' | 'formatting' | 'impact' | 'readability';
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  details?: string[];
}

export interface KeywordMatchSummary {
  matched: string[];
  missing: string[];
  topKeywords: string[];
  matchScore: number;
  categories: {
    skills: { matched: string[]; missing: string[] };
    tools: { matched: string[]; missing: string[] };
    responsibilities: { matched: string[]; missing: string[] };
  };
  prioritizedMissing: {
    skills: string[];
    tools: string[];
    responsibilities: string[];
  };
  suggestedPlacement: {
    skills: string;
    tools: string;
    responsibilities: string;
  };
}

export interface ATSScoreResult {
  totalScore: number;
  atsScore: number;
  readabilityScore: number;
  matchScore?: number;
  coverageScore: number;
  checks: ATSCheck[];
  feedback: string[];
  prioritizedFixes: FeedbackItem[];
  bulletSuggestions: BulletSuggestion[];
  readabilityNotes: string[];
  parsingPreview: string;
  parsingRisks: ParsingRisk[];
  keywordMatch?: KeywordMatchSummary;
}

export interface FeedbackItem {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  reason: string;
  action: string;
  rationale: string;
  impactScore: number;
}

export interface BulletSuggestion {
  section: 'work' | 'projects';
  companyOrProject: string;
  original: string;
  issue: string;
  template: string;
}

export interface ParsingRisk {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
}

const ACTION_VERBS = new Set([
  'achieved', 'accelerated', 'awarded', 'advanced', 'amplified', 'boosted', 'built',
  'created', 'coordinated', 'collaborated', 'completed', 'controlled', 'converted',
  'decreased', 'delivered', 'developed', 'designed', 'driven', 'doubled', 'directed',
  'established', 'expanded', 'enhanced', 'exceeded', 'executed', 'engineered',
  'founded', 'focused', 'generated', 'guided', 'grew', 'headed', 'improved',
  'increased', 'initiated', 'implemented', 'innovated', 'integrated', 'introduced',
  'led', 'managed', 'maximized', 'mentored', 'minimized', 'modernized', 'negotiated',
  'optimized', 'orchestrated', 'organized', 'outperformed', 'planned', 'produced',
  'promoted', 'pioneered', 'reduced', 'resolved', 'restructured', 'revitalized',
  'saved', 'secured', 'spearheaded', 'streamlined', 'strengthened', 'supervised',
  'surpassed', 'targeted', 'transformed', 'trained', 'upgraded', 'utilized', 'won'
]);

const CLICHES = new Set([
  'hard worker', 'team player', 'motivated', 'self-starter', 'detail-oriented',
  'results-oriented', 'think outside the box', 'go-getter', 'thought leader',
  'visionary', 'guru', 'ninja', 'rockstar', 'synergy', 'value-add',
  'best of breed', 'bottom line', 'strategic thinker', 'proven track record',
  'dynamic', 'proactive', 'perfectionist', 'people person'
]);

const STOP_WORDS = new Set([
  'and', 'the', 'is', 'in', 'at', 'of', 'to', 'for', 'with', 'a', 'an', 'on', 'by',
  'as', 'from', 'that', 'this', 'it', 'be', 'are', 'was', 'were', 'or', 'if', 'but',
  'we', 'you', 'they', 'their', 'our', 'your', 'i', 'me', 'my'
]);

const FILLER_WORDS = new Set([
  'very', 'really', 'basically', 'actually', 'just', 'quite', 'pretty', 'somewhat',
  'maybe', 'perhaps', 'probably', 'largely', 'mostly', 'kind', 'sort'
]);

const PASSIVE_VOICE_REGEX = /\b(am|is|are|was|were|be|been|being)\s+\w+(ed|en)\b/i;
const RESPONSIBILITY_VERBS = new Set([
  'build', 'design', 'develop', 'deliver', 'manage', 'lead', 'own', 'drive',
  'optimize', 'improve', 'create', 'implement', 'execute', 'coordinate',
  'collaborate', 'analyze', 'support', 'maintain', 'scale', 'test', 'deploy',
  'architect', 'monitor', 'automate'
]);

const COMMON_TOOLS = new Set([
  'sql', 'python', 'java', 'javascript', 'typescript', 'react', 'node', 'nodejs',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'git', 'linux',
  'excel', 'powerbi', 'tableau', 'jira', 'figma', 'salesforce', 'mongodb', 'postgres',
  'mysql', 'snowflake', 'spark', 'redis', 'kafka', 'jenkins', 'circleci', 'github',
  'gitlab', 'bitbucket', 'webpack', 'vite', 'angular', 'vue', 'svelte', 'nextjs',
  'express', 'fastapi', 'django', 'flask', 'spring', 'dotnet', 'graphql', 'rest',
  'api', 'microservices', 'serverless', 'lambda', 'cloudformation', 'ansible',
  'puppet', 'chef', 'prometheus', 'grafana', 'elasticsearch', 'kibana', 'nginx',
  'apache', 'tomcat', 'redux', 'mobx', 'jest', 'cypress', 'playwright', 'selenium',
  'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'opencv', 'rabbitmq',
  'celery', 'airflow', 'matlab', 'r', 'sas', 'spss', 'powerpoint', 'word', 'outlook',
  'photoshop', 'illustrator', 'sketch', 'adobexd', 'invision', 'slack', 'teams',
  'zoom', 'hubspot', 'marketo', 'dynamics', 'sap', 'oracle', 'workday', 'zendesk',
  'intercom', 'segment', 'amplitude', 'mixpanel', 'looker', 'dbt', 'fivetran',
  'stitch', 'hadoop', 'hive', 'pig', 'hbase', 'cassandra', 'dynamodb', 'neo4j',
  'memcached', 'varnish', 'fastly', 'cloudflare', 'datadog', 'newrelic', 'splunk',
  'sumo', 'pagerduty', 'statuspage', 'postman', 'swagger', 'insomnia', 'charles'
]);

const normalizeText = (text: string) =>
  text
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\w\s.%+$-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const splitSentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

const tokenize = (text: string) =>
  normalizeText(text)
    .match(/\b[a-z0-9][a-z0-9+.-]*\b/g) || [];

const extractPhrases = (tokens: string[], maxN = 3) => {
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let n = 2; n <= maxN; n++) {
      const slice = tokens.slice(i, i + n);
      if (slice.length === n) {
        phrases.push(slice.join(' '));
      }
    }
  }
  return phrases;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const severityRank = (severity: FeedbackItem['severity']) =>
  severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;

// Escape special regex characters for word-boundary matching
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Word-boundary aware keyword matching
const matchesWithWordBoundary = (text: string, term: string): boolean => {
  // For multi-word phrases, use exact phrase matching
  if (term.includes(' ')) {
    return text.includes(term);
  }
  // For single words, use word boundary regex to avoid false positives
  const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
  return regex.test(text);
};

const parseYearMonth = (value: string) => {
  const match = value.match(/^(\d{4})(?:-(\d{2}))?$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 1;
  if (Number.isNaN(year) || Number.isNaN(month)) return null;
  return { year, month };
};

const estimateYears = (start?: string, end?: string) => {
  if (!start) return 0;
  const startParts = parseYearMonth(start);
  if (!startParts) return 0;
  const endParts = end ? parseYearMonth(end) : null;
  const endDate = endParts
    ? new Date(endParts.year, Math.max(0, endParts.month - 1), 1)
    : new Date();
  const startDate = new Date(startParts.year, Math.max(0, startParts.month - 1), 1);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;
  const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  return Math.max(0, diffMonths / 12);
};

export const calculateATSScore = (resume: Resume, jobDescription?: string): ATSScoreResult => {
  const checks: ATSCheck[] = [];
  const feedback: string[] = [];
  const readabilityChecks: ATSCheck[] = [];
  const fixCandidates: Array<Omit<FeedbackItem, 'impactScore' | 'rationale'> & { checkId: string; rationaleHint: string }> = [];
  const bulletSuggestions: BulletSuggestion[] = [];
  const readabilityNotes: string[] = [];
  const parsingRisks: ParsingRisk[] = [];

  const sectionTexts = {
    summary: resume.basics.summary || '',
    work: resume.work.map(w => `${w.position} ${w.company} ${w.summary} ${w.highlights?.join(' ') || ''}`).join(' '),
    education: resume.education.map(e => `${e.studyType} ${e.area} ${e.institution} ${e.summary || ''}`).join(' '),
    skills: resume.skills.map(s => `${s.name} ${s.keywords?.join(' ') || ''}`).join(' '),
    projects: resume.projects.map(p => `${p.name} ${p.description} ${p.highlights?.join(' ') || ''}`).join(' '),
    certificates: resume.certificates.map(c => `${c.name} ${c.issuer} ${c.summary}`).join(' '),
    publications: resume.publications.map(p => `${p.name} ${p.publisher} ${p.summary}`).join(' '),
    awards: resume.awards.map(a => `${a.title} ${a.awarder} ${a.summary}`).join(' '),
  };
  const fullText = Object.values(sectionTexts).join(' ');
  const fullTextNormalized = normalizeText(fullText);
  const sectionNormalized = {
    summary: normalizeText(sectionTexts.summary),
    work: normalizeText(sectionTexts.work),
    skills: normalizeText(sectionTexts.skills),
    education: normalizeText(sectionTexts.education),
    projects: normalizeText(sectionTexts.projects),
    certificates: normalizeText(sectionTexts.certificates),
    publications: normalizeText(sectionTexts.publications),
    awards: normalizeText(sectionTexts.awards),
  };

  const totalExperienceYears = resume.work.reduce((acc, job) => acc + estimateYears(job.startDate, job.endDate), 0);
  const experienceLevel = totalExperienceYears < 2 ? 'entry' : totalExperienceYears < 6 ? 'mid' : 'senior';

  const normalizeHeading = (value?: string) =>
    (value || '')
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const standardHeadings: Record<string, string[]> = {
    summary: ['summary', 'professional summary', 'profile'],
    work: ['work experience', 'experience', 'professional experience'],
    education: ['education', 'academic background'],
    skills: ['skills', 'technical skills', 'core skills'],
    projects: ['projects', 'project experience'],
    certificates: ['certifications', 'certificates'],
    languages: ['languages'],
    publications: ['publications'],
    awards: ['awards', 'honors'],
  };

  const sectionTitles = resume.meta?.layoutSettings?.sectionTitles || {};
  const headingFor = (key: keyof typeof standardHeadings, fallback: string) =>
    sectionTitles[key] || fallback;

  // 1. IMPACT: Contact Information (10 pts)
  const hasEmail = !!resume.basics.email;
  const hasPhone = !!resume.basics.phone;
  const hasLocation = !!resume.basics.location?.city || !!resume.basics.location?.country;

  checks.push({
    id: 'contact-info',
    name: 'Contact Information',
    category: 'impact',
    passed: hasEmail && hasPhone && hasLocation,
    score: (hasEmail ? 4 : 0) + (hasPhone ? 3 : 0) + (hasLocation ? 3 : 0),
    maxScore: 10,
    message: hasEmail && hasPhone && hasLocation
      ? 'Contact info is complete.'
      : 'Missing essential contact information.',
    details: [
      !hasEmail && 'Missing email',
      !hasPhone && 'Missing phone',
      !hasLocation && 'Missing location'
    ].filter(Boolean) as string[],
  });

  // 2. CONTENT: Professional Summary (10 pts)
  const summaryLength = resume.basics.summary?.length || 0;
  const hasGoodSummary = summaryLength > 150 && summaryLength < 600;
  const hasSummary = summaryLength > 0;

  checks.push({
    id: 'summary-quality',
    name: 'Professional Summary',
    category: 'content',
    passed: hasGoodSummary,
    score: hasGoodSummary ? 10 : (hasSummary ? 5 : 0),
    maxScore: 10,
    message: hasGoodSummary
      ? 'Summary length is optimal.'
      : (hasSummary ? 'Summary should be 3-5 sentences long.' : 'Missing professional summary.'),
  });

  const metricRegex = /(\d+%|\$\d+|€\d+|£\d+|\d+\+?\s*(users|clients|customers|revenue|sales|people|staff|team|budget|hours|projects|tickets|pipelines)|\d+(?:\.\d+)?\s*(k|m|b)\b|\b\d+x\b)/i;

  // 3. IMPACT: Work Experience & Action Verbs (25 pts)
  const experienceCount = resume.work.length;
  const hasExperience = experienceCount > 0;
  let actionVerbCount = 0;
  let totalBullets = 0;
  const weakBullets: string[] = [];

  const allBullets = resume.work.flatMap(job => job.highlights || []);
  const normalizedBulletsAll = allBullets.map(b => normalizeText(b));
  const bulletCounts = normalizedBulletsAll.reduce((acc, b) => {
    if (!b) return acc;
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (hasExperience) {
    resume.work.forEach(job => {
      if (job.highlights) {
        job.highlights.forEach(bullet => {
          totalBullets++;
          const firstWord = bullet.trim().split(' ')[0]?.toLowerCase().replace(/[^a-z]/g, '');
          const normalizedBullet = normalizeText(bullet);
          const bulletWordCount = tokenize(bullet).length;
          const hasMetric = metricRegex.test(bullet);
          const isPassive = PASSIVE_VOICE_REGEX.test(bullet);
          const isRepeated = normalizedBullet && (bulletCounts[normalizedBullet] || 0) > 1;

          if (firstWord && ACTION_VERBS.has(firstWord)) {
            actionVerbCount++;
          } else {
            if (weakBullets.length < 3) weakBullets.push(`${bullet.substring(0, 30)}...`);
            if (bulletSuggestions.length < 8) {
              bulletSuggestions.push({
                section: 'work',
                companyOrProject: job.company || job.position || 'Work Experience',
                original: bullet,
                issue: 'Weak action verb opener',
                template: 'Led/Improved/Delivered X by Y%, resulting in Z.'
              });
            }
          }

          if (!hasMetric && bulletSuggestions.length < 8) {
            bulletSuggestions.push({
              section: 'work',
              companyOrProject: job.company || job.position || 'Work Experience',
              original: bullet,
              issue: 'Missing measurable impact',
              template: 'Increased/Reduced/Delivered X by Y% through Z.'
            });
          }

          if (isPassive && bulletSuggestions.length < 8) {
            bulletSuggestions.push({
              section: 'work',
              companyOrProject: job.company || job.position || 'Work Experience',
              original: bullet,
              issue: 'Passive voice',
              template: 'Action verb + direct object + result (e.g., “Built X that achieved Y”).'
            });
          }

          if (bulletWordCount > 28 && bulletSuggestions.length < 8) {
            bulletSuggestions.push({
              section: 'work',
              companyOrProject: job.company || job.position || 'Work Experience',
              original: bullet,
              issue: 'Too long for quick scanning',
              template: 'Split into two bullets, each with one impact and one metric.'
            });
          }

          if (isRepeated && bulletSuggestions.length < 8) {
            bulletSuggestions.push({
              section: 'work',
              companyOrProject: job.company || job.position || 'Work Experience',
              original: bullet,
              issue: 'Repetitive phrasing',
              template: 'Use a different verb and focus on a distinct outcome.'
            });
          }
        });
      }
    });
  }

  const actionVerbRatio = totalBullets > 0 ? actionVerbCount / totalBullets : 0;
  const goodActionVerbUsage = actionVerbRatio > 0.6;

  checks.push({
    id: 'action-verbs',
    name: 'Action Verbs',
    category: 'impact',
    passed: goodActionVerbUsage,
    score: goodActionVerbUsage ? 25 : (actionVerbRatio > 0.3 ? 15 : 5),
    maxScore: 25,
    message: goodActionVerbUsage
      ? 'Strong use of action verbs.'
      : 'Start more bullet points with strong action verbs (e.g., Led, Developed, Created).',
    details: !goodActionVerbUsage && weakBullets.length > 0
      ? [`Weak openers found: "${weakBullets.join('", "')}"`]
      : undefined
  });

  // 4. IMPACT: Quantifiable Results (20 pts)
  let metricsCount = 0;

  if (hasExperience) {
    resume.work.forEach(job => {
      // Only count metrics from highlights (bullets), not from summaries
      const text = job.highlights?.join(' ') || '';
      const matches = text.match(new RegExp(metricRegex, 'gi'));
      if (matches) metricsCount += matches.length;
    });
  }

  const hasGoodMetrics = metricsCount >= 3;

  checks.push({
    id: 'quantifiable-results',
    name: 'Quantifiable Results',
    category: 'impact',
    passed: hasGoodMetrics,
    score: hasGoodMetrics ? 20 : (metricsCount > 0 ? 10 : 0),
    maxScore: 20,
    message: hasGoodMetrics
      ? 'Great use of specific metrics and numbers.'
      : 'Add more numbers to quantify your impact (e.g., "Increased revenue by 20%").',
  });

  if (!hasGoodMetrics) {
    fixCandidates.push({
      id: 'fix-metrics',
      title: 'Add quantifiable impact',
      severity: 'high',
      reason: 'Few or no metrics detected in work achievements.',
      action: 'Add numbers (%, $, time, volume) to at least 3 bullets.',
      checkId: 'quantifiable-results',
      rationaleHint: 'High impact on ATS scoring for impact evidence.'
    });
  }

  // 5. CONTENT: Cliches & Buzzwords (Negatives)
  let clicheCount = 0;
  const foundCliches: string[] = [];

  const fullTextLower = fullTextNormalized;
  CLICHES.forEach(cliche => {
    if (fullTextLower.includes(cliche)) {
      clicheCount++;
      if (foundCliches.length < 5) foundCliches.push(cliche);
    }
  });

  const noCliches = clicheCount === 0;

  checks.push({
    id: 'cliches',
    name: 'Cliches & Buzzwords',
    category: 'content',
    passed: noCliches,
    score: noCliches ? 15 : Math.max(0, 15 - (clicheCount * 3)),
    maxScore: 15,
    message: noCliches
      ? 'No overused buzzwords found.'
      : `Avoid using vague buzzwords. Found: ${foundCliches.join(', ')}.`,
  });

  if (!goodActionVerbUsage) {
    fixCandidates.push({
      id: 'fix-action-verbs',
      title: 'Strengthen bullet openers',
      severity: 'medium',
      reason: 'Many bullets do not start with strong action verbs.',
      action: 'Rewrite bullets to start with verbs like Led, Built, Improved.',
      checkId: 'action-verbs',
      rationaleHint: 'Improves scannability and impact perception.'
    });
  }

  // 6. FORMATTING: Consistency (10 pts)
  let endsWithPeriod = 0;
  let noPeriod = 0;

  if (hasExperience) {
    resume.work.forEach(job => {
      job.highlights?.forEach(bullet => {
        if (bullet.trim().endsWith('.')) endsWithPeriod++;
        else noPeriod++;
      });
    });
  }

  const isConsistent = (endsWithPeriod === 0 && noPeriod > 0) || (endsWithPeriod > 0 && noPeriod === 0);

  checks.push({
    id: 'consistency',
    name: 'Formatting Consistency',
    category: 'formatting',
    passed: isConsistent,
    score: isConsistent ? 10 : 5,
    maxScore: 10,
    message: isConsistent
      ? 'Consistent punctuation formatting.'
      : 'Inconsistent usage of periods at the end of bullet points.',
  });

  // 7. CONTENT: Skills & Core Check (10 pts)
  const skillsCount = resume.skills.length + resume.skills.reduce((acc, s) => acc + (s.keywords?.length || 0), 0);
  const hasSkills = skillsCount >= 5;

  checks.push({
    id: 'skills-section',
    name: 'Skills Section',
    category: 'content',
    passed: hasSkills,
    score: hasSkills ? 10 : 0,
    maxScore: 10,
    message: hasSkills
      ? 'Skills section is well-populated.'
      : 'List at least 5 relevant skills.',
  });

  if (!hasSkills) {
    fixCandidates.push({
      id: 'fix-skills',
      title: 'Expand skills section',
      severity: 'medium',
      reason: 'Skills section is thin or missing.',
      action: 'Add at least 5 relevant skills and tools from the JD.',
      checkId: 'skills-section',
      rationaleHint: 'ATS matching relies heavily on skills coverage.'
    });
  }

  // 8. KEYWORD MATCHING (Optional)
  let keywordMatchSummary: KeywordMatchSummary | undefined;
  if (jobDescription) {
    const resumeSkillTerms = new Set(
      [
        ...resume.skills.map(s => s.name),
        ...resume.skills.flatMap(s => s.keywords || []),
        ...resume.projects.flatMap(p => p.keywords || [])
      ]
        .map(normalizeText)
        .filter(Boolean)
    );

    const classifyTerm = (term: string) => {
      const tokens = term.split(' ').filter(Boolean);
      const hasVerb = tokens.some(t => RESPONSIBILITY_VERBS.has(t));
      const isTool = tokens.some(t => COMMON_TOOLS.has(t)) || COMMON_TOOLS.has(term);
      const isSkill = resumeSkillTerms.has(term) || tokens.some(t => resumeSkillTerms.has(t));
      
      // Check for multi-word tool patterns
      const multiWordTools = [
        'machine learning', 'deep learning', 'natural language', 'computer vision',
        'data science', 'cloud computing', 'continuous integration', 'continuous deployment',
        'version control', 'agile methodologies', 'scrum master', 'devops engineer'
      ];
      const isMultiWordTool = multiWordTools.some(tool => term.includes(tool));
      
      // Prioritize tools and responsibilities over generic "skills" fallback
      if (hasVerb) return 'responsibilities';
      if (isTool || isMultiWordTool) return 'tools';
      if (isSkill) return 'skills';
      
      // If term contains technical indicators, classify as tool
      if (tokens.some(t => t.endsWith('js') || t.endsWith('py') || t.startsWith('ci') || t.startsWith('cd'))) {
        return 'tools';
      }
      
      // Default to skills only if no other pattern matches
      return 'skills';
    };

    const jdTokens = tokenize(jobDescription).filter(w => w.length >= 3 && !STOP_WORDS.has(w));
    const jdPhrases = extractPhrases(jdTokens, 3);
    const jdTerms = [...jdTokens, ...jdPhrases];

    const keywordCounts: Record<string, number> = {};
    jdTerms.forEach(term => {
      if (!term) return;
      keywordCounts[term] = (keywordCounts[term] || 0) + 1;
    });

    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word]) => word);

    const resumeTextNormalized = fullTextNormalized;
    // Use word-boundary matching to avoid false positives (e.g., "aws" matching "saws")
    const matchedKeywords = topKeywords.filter(term => matchesWithWordBoundary(resumeTextNormalized, term));
    const missingKeywords = topKeywords.filter(term => !matchesWithWordBoundary(resumeTextNormalized, term));
    const categorized = {
      skills: { matched: [] as string[], missing: [] as string[] },
      tools: { matched: [] as string[], missing: [] as string[] },
      responsibilities: { matched: [] as string[], missing: [] as string[] }
    };

    const termWeights: Record<string, number> = {};
    topKeywords.forEach(term => {
      const base = keywordCounts[term] || 1;
      termWeights[term] = base * (term.includes(' ') ? 1.5 : 1);
    });

    const sectionMatchScore = (term: string, category: 'skills' | 'tools' | 'responsibilities') => {
      const inSkills = matchesWithWordBoundary(sectionNormalized.skills, term);
      const inWork = matchesWithWordBoundary(sectionNormalized.work, term);
      const inSummary = matchesWithWordBoundary(sectionNormalized.summary, term);
      const inProjects = matchesWithWordBoundary(sectionNormalized.projects, term);

      if (category === 'responsibilities') {
        if (inWork) return 1;
        if (inProjects) return 0.7;
        if (inSummary) return 0.5;
        return 0.3;
      }

      if (inSkills) return 1;
      if (inSummary || inWork) return 0.6;
      return 0.4;
    };

    const categoryWeighted = {
      skills: { score: 0, max: 0 },
      tools: { score: 0, max: 0 },
      responsibilities: { score: 0, max: 0 }
    };

    topKeywords.forEach(term => {
      const bucket = classifyTerm(term) as keyof typeof categorized;
      const isMatched = matchesWithWordBoundary(resumeTextNormalized, term);
      if (isMatched) categorized[bucket].matched.push(term);
      else categorized[bucket].missing.push(term);

      const weight = termWeights[term] || 1;
      categoryWeighted[bucket].max += weight;
      if (isMatched) {
        categoryWeighted[bucket].score += weight * sectionMatchScore(term, bucket);
      }
    });

    const categoryScores = {
      skills: categoryWeighted.skills.max ? categoryWeighted.skills.score / categoryWeighted.skills.max : 0,
      tools: categoryWeighted.tools.max ? categoryWeighted.tools.score / categoryWeighted.tools.max : 0,
      responsibilities: categoryWeighted.responsibilities.max
        ? categoryWeighted.responsibilities.score / categoryWeighted.responsibilities.max
        : 0
    };

    const baseWeights = { skills: 0.5, tools: 0.2, responsibilities: 0.3 };
    const activeWeights = Object.entries(categoryScores).reduce((acc, [key, value]) => {
      if (value > 0 || (key === 'skills' && categorized.skills.missing.length > 0)) {
        acc[key as keyof typeof baseWeights] = baseWeights[key as keyof typeof baseWeights];
      }
      return acc;
    }, {} as typeof baseWeights);
    const weightSum = Object.values(activeWeights).reduce((a, b) => a + b, 0) || 1;
    const weightedMatch =
      (categoryScores.skills * (activeWeights.skills || 0)) +
      (categoryScores.tools * (activeWeights.tools || 0)) +
      (categoryScores.responsibilities * (activeWeights.responsibilities || 0));
    const matchScore = clamp(Math.round((weightedMatch / weightSum) * 100));

    const prioritize = (terms: string[]) =>
      terms
        .slice()
        .sort((a, b) => (termWeights[b] || 0) - (termWeights[a] || 0))
        .slice(0, 5);

    keywordMatchSummary = {
      matched: matchedKeywords.slice(0, 20),
      missing: missingKeywords.slice(0, 20),
      topKeywords,
      matchScore,
      categories: {
        skills: {
          matched: categorized.skills.matched.slice(0, 15),
          missing: categorized.skills.missing.slice(0, 15)
        },
        tools: {
          matched: categorized.tools.matched.slice(0, 10),
          missing: categorized.tools.missing.slice(0, 10)
        },
        responsibilities: {
          matched: categorized.responsibilities.matched.slice(0, 10),
          missing: categorized.responsibilities.missing.slice(0, 10)
        }
      },
      prioritizedMissing: {
        skills: prioritize(categorized.skills.missing),
        tools: prioritize(categorized.tools.missing),
        responsibilities: prioritize(categorized.responsibilities.missing)
      },
      suggestedPlacement: {
        skills: 'Skills section, Summary',
        tools: 'Skills section, Projects',
        responsibilities: 'Work experience bullets'
      }
    };

    const keywordMatchPassed = matchScore >= 60;
    checks.push({
      id: 'keyword-match',
      name: 'Job Description Match',
      category: 'content',
      passed: keywordMatchPassed,
      score: Math.round((matchScore / 100) * 20),
      maxScore: 20,
      message: keywordMatchPassed
        ? 'Good keyword overlap with the job description.'
        : 'Increase overlap with the job description keywords.',
      details: [
        `Matched: ${matchedKeywords.length}/${topKeywords.length} key terms.`,
        categorized.skills.missing.length > 0 ? `Missing skills: ${prioritize(categorized.skills.missing).join(', ')}` : 'No major skill gaps.',
        categorized.responsibilities.missing.length > 0 ? `Missing responsibilities: ${prioritize(categorized.responsibilities.missing).slice(0, 3).join(', ')}` : 'Responsibilities alignment looks good.'
      ]
    });

    if (!keywordMatchPassed) {
      fixCandidates.push({
        id: 'fix-keyword-match',
        title: 'Improve job description alignment',
        severity: 'high',
        reason: 'Low overlap with job description keywords.',
        action: 'Add missing keywords to Skills, Summary, and Work bullets.',
        checkId: 'keyword-match',
        rationaleHint: 'Keyword match strongly affects ATS ranking.'
      });
    }
  }

  // 9. PARSING: Section Headings (5 pts)
  const hasWork = resume.work.length > 0;
  const hasEducation = resume.education.length > 0;
  const hasSkillsData = resume.skills.length > 0;
  const allStandardSections = hasWork && hasEducation && hasSkillsData;

  checks.push({
    id: 'parsing-standard-sections',
    name: 'Standard Sections',
    category: 'formatting',
    passed: allStandardSections,
    score: allStandardSections ? 5 : 0,
    maxScore: 5,
    message: allStandardSections
      ? 'Standard sections (Work, Education, Skills) are present.'
      : 'Ensure you have Work, Education, and Skills sections for better ATS parsing.',
  });

  (['summary', 'work', 'education', 'skills', 'projects', 'certificates', 'languages', 'publications', 'awards'] as const)
    .forEach((sectionKey) => {
      const customTitle = sectionTitles[sectionKey];
      if (!customTitle) return;
      const normalized = normalizeHeading(customTitle);
      const allowed = standardHeadings[sectionKey];
      if (allowed && !allowed.includes(normalized)) {
        parsingRisks.push({
          id: `risk-heading-${sectionKey}`,
          severity: 'medium',
          message: `Non-standard heading "${customTitle}" may reduce ATS recognition.`,
          suggestion: `Use a standard heading like "${allowed[0]}".`
        });
      }
    });

  // 10. FORMATTING: Layout risk for ATS parsing (10 pts)
  const layout = resume.meta?.layoutSettings;
  const hasColumns = layout?.columnCount && layout.columnCount > 1;
  const hasSidebarHeader = layout?.headerPosition && layout.headerPosition !== 'top';
  const hasIcons = layout?.sectionHeadingIcons && layout.sectionHeadingIcons !== 'none';
  const hasProfilePhoto = !!resume.basics.image;
  const layoutRiskCount = [hasColumns, hasSidebarHeader, hasIcons, hasProfilePhoto].filter(Boolean).length;
  const layoutSafe = layoutRiskCount === 0;

  checks.push({
    id: 'layout-ats-risk',
    name: 'ATS Parsing Safety',
    category: 'formatting',
    passed: layoutSafe,
    score: layoutSafe ? 10 : Math.max(3, 10 - layoutRiskCount * 2),
    maxScore: 10,
    message: layoutSafe
      ? 'Layout is ATS-friendly.'
      : 'Layout may reduce ATS parsing accuracy (columns, icons, or photos).',
    details: [
      hasColumns && 'Multi-column layout detected.',
      hasSidebarHeader && 'Sidebar header layout detected.',
      hasIcons && 'Section heading icons enabled.',
      hasProfilePhoto && 'Profile photo detected.'
    ].filter(Boolean) as string[],
  });

  if (!layoutSafe) {
    fixCandidates.push({
      id: 'fix-layout',
      title: 'Use ATS-safe layout',
      severity: 'high',
      reason: 'Multi-column layout, icons, or photo can reduce ATS parsing.',
      action: 'Switch to a single-column template without icons/photos.',
      checkId: 'layout-ats-risk',
      rationaleHint: 'Layout issues can hide content from ATS parsing.'
    });
  }

  if (hasColumns) {
    parsingRisks.push({
      id: 'risk-columns',
      severity: 'high',
      message: 'Multi-column layouts can break ATS parsing order.',
      suggestion: 'Use a single-column template for ATS submissions.'
    });
  }
  if (hasSidebarHeader) {
    parsingRisks.push({
      id: 'risk-sidebar-header',
      severity: 'medium',
      message: 'Sidebar headers may cause ATS to miss contact details.',
      suggestion: 'Move contact details to a top header.'
    });
  }
  if (hasIcons) {
    parsingRisks.push({
      id: 'risk-icons',
      severity: 'medium',
      message: 'Icons can interfere with ATS text extraction.',
      suggestion: 'Disable icons for ATS-focused resumes.'
    });
  }
  if (hasProfilePhoto) {
    parsingRisks.push({
      id: 'risk-photo',
      severity: 'medium',
      message: 'Profile photos can confuse ATS parsers.',
      suggestion: 'Remove photos for ATS submissions.'
    });
  }

  // 11. CONTENT: Date consistency (10 pts)
  const dateIssues: string[] = [];
  const datePattern = /^\d{4}(-\d{2})?$/;
  resume.work.forEach(job => {
    if (job.startDate && !datePattern.test(job.startDate)) dateIssues.push(`${job.company}: start date format`);
    if (job.endDate && !datePattern.test(job.endDate)) dateIssues.push(`${job.company}: end date format`);
  });
  resume.education.forEach(edu => {
    if (edu.startDate && !datePattern.test(edu.startDate)) dateIssues.push(`${edu.institution}: start date format`);
    if (edu.endDate && !datePattern.test(edu.endDate)) dateIssues.push(`${edu.institution}: end date format`);
  });

  const dateConsistencyPassed = dateIssues.length === 0;
  checks.push({
    id: 'date-consistency',
    name: 'Date Consistency',
    category: 'content',
    passed: dateConsistencyPassed,
    score: dateConsistencyPassed ? 10 : 4,
    maxScore: 10,
    message: dateConsistencyPassed
      ? 'Dates are consistent and parsable.'
      : 'Use consistent date formats (YYYY or YYYY-MM).',
    details: dateIssues.slice(0, 4)
  });

  if (!dateConsistencyPassed) {
    fixCandidates.push({
      id: 'fix-dates',
      title: 'Standardize date formats',
      severity: 'medium',
      reason: 'Dates are inconsistent or non-parsable.',
      action: 'Use YYYY or YYYY-MM consistently across sections.',
      checkId: 'date-consistency',
      rationaleHint: 'Improves ATS parsing accuracy for timelines.'
    });
  }

  // 12. CONTENT: Bullet metric density (10 pts)
  const bulletMetricRatio = totalBullets > 0 ? metricsCount / totalBullets : 0;
  const goodMetricDensity = bulletMetricRatio >= 0.35;
  checks.push({
    id: 'metric-density',
    name: 'Metric Density',
    category: 'impact',
    passed: goodMetricDensity,
    score: goodMetricDensity ? 10 : (bulletMetricRatio >= 0.2 ? 6 : 2),
    maxScore: 10,
    message: goodMetricDensity
      ? 'Metrics are well distributed across bullets.'
      : 'Add metrics to more bullet points for stronger impact.',
    details: totalBullets ? [`Metrics per bullet: ${bulletMetricRatio.toFixed(2)}`] : undefined
  });

  if (!goodMetricDensity) {
    fixCandidates.push({
      id: 'fix-metric-density',
      title: 'Increase metric density',
      severity: 'medium',
      reason: 'Metrics appear in too few bullets.',
      action: 'Add numbers to at least 35% of bullets.',
      checkId: 'metric-density',
      rationaleHint: 'Balanced metrics improve perceived impact.'
    });
  }

  // 13. CONTENT: Redundancy & repetition (10 pts)
  const uniqueBullets = new Set(normalizedBulletsAll.filter(Boolean));
  const redundancyRatio = normalizedBulletsAll.length
    ? 1 - uniqueBullets.size / Math.max(1, normalizedBulletsAll.length)
    : 0;
  const redundancyOk = redundancyRatio < 0.2;
  checks.push({
    id: 'redundancy',
    name: 'Repetition',
    category: 'content',
    passed: redundancyOk,
    score: redundancyOk ? 10 : 5,
    maxScore: 10,
    message: redundancyOk
      ? 'Bullets are varied and non-repetitive.'
      : 'Reduce repetitive bullet phrasing.',
    details: normalizedBulletsAll.length ? [`Approx redundancy: ${Math.round(redundancyRatio * 100)}%`] : undefined
  });

  if (!redundancyOk) {
    fixCandidates.push({
      id: 'fix-redundancy',
      title: 'Reduce repetition',
      severity: 'low',
      reason: 'Several bullets repeat phrasing or structure.',
      action: 'Vary verbs and focus each bullet on a unique outcome.',
      checkId: 'redundancy',
      rationaleHint: 'Reduces redundancy and improves recruiter engagement.'
    });
  }

  // 14. CONTENT: Tense consistency (10 pts)
  const tenseLabels = resume.work.map(job => {
    const text = normalizeText(`${job.summary || ''} ${job.highlights?.join(' ') || ''}`);
    const hasPast = /\b(achieved|led|built|created|managed|improved|increased|reduced|delivered|developed|designed|drove|launched)\b/.test(text);
    const hasPresent = /\b(manage|lead|build|create|drive|deliver|develop|design|optimize|collaborate|coordinate)\b/.test(text);
    if (hasPast && !hasPresent) return 'past';
    if (hasPresent && !hasPast) return 'present';
    return 'mixed';
  });
  const dominantTense = tenseLabels.filter(t => t !== 'mixed').sort((a, b) => {
    const countA = tenseLabels.filter(t => t === a).length;
    const countB = tenseLabels.filter(t => t === b).length;
    return countB - countA;
  })[0];
  const tenseConsistencyOk = !dominantTense || tenseLabels.every(t => t === dominantTense || t === 'mixed');
  checks.push({
    id: 'tense-consistency',
    name: 'Tense Consistency',
    category: 'content',
    passed: tenseConsistencyOk,
    score: tenseConsistencyOk ? 10 : 5,
    maxScore: 10,
    message: tenseConsistencyOk
      ? 'Verb tense is consistent.'
      : 'Use past tense for past roles and present tense for current roles.',
  });

  if (!tenseConsistencyOk) {
    fixCandidates.push({
      id: 'fix-tense',
      title: 'Fix tense consistency',
      severity: 'low',
      reason: 'Mixed verb tenses in work experience.',
      action: 'Use past tense for past roles and present tense for current roles.',
      checkId: 'tense-consistency',
      rationaleHint: 'Consistency improves readability and professionalism.'
    });
  }

  // READABILITY CHECKS
  const sentences = splitSentences(fullText);
  const sentenceWordCounts = sentences.map(s => tokenize(s).length).filter(n => n > 0);
  const avgSentenceLength = sentenceWordCounts.length
    ? sentenceWordCounts.reduce((a, b) => a + b, 0) / sentenceWordCounts.length
    : 0;
  const longSentenceRatio = sentenceWordCounts.length
    ? sentenceWordCounts.filter(n => n >= 30).length / sentenceWordCounts.length
    : 0;
  const passiveCount = sentences.filter(s => PASSIVE_VOICE_REGEX.test(s)).length;
  const passiveRatio = sentences.length ? passiveCount / sentences.length : 0;
  const fillerCount = tokenize(fullText).filter(w => FILLER_WORDS.has(w)).length;
  const fillerRatio = fullText.length ? fillerCount / Math.max(1, tokenize(fullText).length) : 0;

  const readableLength = avgSentenceLength > 0 && avgSentenceLength <= 22 && longSentenceRatio < 0.2;
  readabilityChecks.push({
    id: 'sentence-clarity',
    name: 'Sentence Clarity',
    category: 'readability',
    passed: readableLength,
    score: readableLength ? 20 : 12,
    maxScore: 20,
    message: readableLength
      ? 'Sentence length is easy to scan.'
      : 'Shorten long sentences for recruiter readability.',
    details: avgSentenceLength ? [`Avg sentence length: ${avgSentenceLength.toFixed(1)} words`] : undefined
  });

  if (!readableLength) {
    fixCandidates.push({
      id: 'fix-sentence-length',
      title: 'Shorten long sentences',
      severity: 'medium',
      reason: 'Sentences are too long for quick recruiter scanning.',
      action: 'Split long sentences into 1–2 shorter bullets.',
      checkId: 'sentence-clarity',
      rationaleHint: 'Shorter sentences improve recruiter scan speed.'
    });
  }

  const passiveOk = passiveRatio <= 0.2;
  readabilityChecks.push({
    id: 'active-voice',
    name: 'Active Voice',
    category: 'readability',
    passed: passiveOk,
    score: passiveOk ? 15 : 8,
    maxScore: 15,
    message: passiveOk
      ? 'Good use of active voice.'
      : 'Reduce passive voice for clearer impact.',
    details: sentences.length ? [`Passive voice in ${Math.round(passiveRatio * 100)}% of sentences.`] : undefined
  });

  if (!passiveOk) {
    fixCandidates.push({
      id: 'fix-passive-voice',
      title: 'Use active voice',
      severity: 'low',
      reason: 'Passive voice reduces clarity and impact.',
      action: 'Rewrite sentences to start with an action verb.',
      checkId: 'active-voice',
      rationaleHint: 'Active voice improves clarity and ownership.'
    });
  }

  const fillerOk = fillerRatio <= 0.02;
  readabilityChecks.push({
    id: 'concise-language',
    name: 'Concise Language',
    category: 'readability',
    passed: fillerOk,
    score: fillerOk ? 15 : 8,
    maxScore: 15,
    message: fillerOk
      ? 'Language is concise.'
      : 'Remove filler words to sharpen statements.',
    details: fillerCount > 0 ? [`Filler word count: ${fillerCount}`] : undefined
  });

  if (!fillerOk) {
    fixCandidates.push({
      id: 'fix-filler-words',
      title: 'Remove filler words',
      severity: 'low',
      reason: 'Filler words reduce punchiness.',
      action: 'Remove terms like “very”, “really”, “just”.',
      checkId: 'concise-language',
      rationaleHint: 'Concise language increases impact.'
    });
  }

  const bulletCount = totalBullets;
  const bulletDensityOk = bulletCount >= 6;
  readabilityChecks.push({
    id: 'bullet-density',
    name: 'Bullet Density',
    category: 'readability',
    passed: bulletDensityOk,
    score: bulletDensityOk ? 10 : 4,
    maxScore: 10,
    message: bulletDensityOk
      ? 'Bullets provide a scannable format.'
      : 'Use more bullet points for scan-friendly impact.',
    details: bulletCount ? [`Total bullets: ${bulletCount}`] : undefined
  });

  if (avgSentenceLength) {
    readabilityNotes.push(`Average sentence length: ${avgSentenceLength.toFixed(1)} words.`);
  }
  if (passiveRatio > 0) {
    readabilityNotes.push(`Passive voice detected in ${Math.round(passiveRatio * 100)}% of sentences.`);
  }
  if (fillerCount > 0) {
    readabilityNotes.push(`Filler words found: ${fillerCount}.`);
  }
  if (!bulletDensityOk) {
    readabilityNotes.push('Add more bullets to improve scanability.');
  }

  if (!bulletDensityOk) {
    fixCandidates.push({
      id: 'fix-bullet-density',
      title: 'Add more bullets',
      severity: 'medium',
      reason: 'Resume is not scannable enough.',
      action: 'Use bullets for key accomplishments instead of paragraphs.',
      checkId: 'bullet-density',
      rationaleHint: 'Bullets improve scanability.'
    });
  }

  checks.push(...readabilityChecks);

  const atsChecks = checks.filter(c => c.category !== 'readability');
  const readabilityOnly = checks.filter(c => c.category === 'readability');
  const categoryWeights =
    experienceLevel === 'entry'
      ? { impact: 0.4, content: 0.4, formatting: 0.2 }
      : experienceLevel === 'mid'
        ? { impact: 0.45, content: 0.35, formatting: 0.2 }
        : { impact: 0.5, content: 0.3, formatting: 0.2 };

  const categoryTotals = atsChecks.reduce((acc, c) => {
    const category = c.category as 'impact' | 'content' | 'formatting';
    acc[category].score += c.score;
    acc[category].max += c.maxScore;
    return acc;
  }, {
    impact: { score: 0, max: 0 },
    content: { score: 0, max: 0 },
    formatting: { score: 0, max: 0 }
  } as Record<'impact' | 'content' | 'formatting', { score: number; max: number }>);

  const weightedScoreSum =
    (categoryTotals.impact.max ? (categoryTotals.impact.score / categoryTotals.impact.max) * categoryWeights.impact : 0) +
    (categoryTotals.content.max ? (categoryTotals.content.score / categoryTotals.content.max) * categoryWeights.content : 0) +
    (categoryTotals.formatting.max ? (categoryTotals.formatting.score / categoryTotals.formatting.max) * categoryWeights.formatting : 0);
  const totalWeight = categoryWeights.impact + categoryWeights.content + categoryWeights.formatting;
  const atsScoreRaw = Math.round((weightedScoreSum / totalWeight) * 100);
  const readabilityScore = readabilityOnly.length
    ? Math.round(
        (readabilityOnly.reduce((acc, c) => acc + c.score, 0) /
          readabilityOnly.reduce((acc, c) => acc + c.maxScore, 0)) * 100
      )
    : 0;

  const matchScore = keywordMatchSummary?.matchScore;

  const coverageFactors = [
    resume.basics.summary?.length ? 1 : 0,
    resume.work.length > 0 ? 1 : 0,
    resume.skills.length > 0 ? 1 : 0,
    resume.education.length > 0 ? 1 : 0,
    totalBullets >= 6 ? 1 : 0
  ];
  const coverageScore = Math.round((coverageFactors.reduce((a, b) => a + b, 0) / coverageFactors.length) * 100);

  // Normalize weights to sum to 1.0 when JD is provided, preventing totalScore > 100
  const experienceWeights = jobDescription
    ? (experienceLevel === 'entry' ? { ats: 0.5, readability: 0.3, match: 0.2 }
       : experienceLevel === 'mid' ? { ats: 0.55, readability: 0.25, match: 0.2 }
       : { ats: 0.6, readability: 0.2, match: 0.2 })
    : (experienceLevel === 'entry' ? { ats: 0.6, readability: 0.4, match: 0 }
       : experienceLevel === 'mid' ? { ats: 0.65, readability: 0.35, match: 0 }
       : { ats: 0.7, readability: 0.3, match: 0 });

  // Remove double-weighting: atsScore is already a 0-100 score, don't scale it again
  const atsScore = clamp(Math.round(atsScoreRaw));
  
  // Calculate weighted total and clamp to ensure bounds
  const totalScore = clamp(
    Math.round(
      (experienceWeights.ats * atsScore) +
      (experienceWeights.readability * readabilityScore) +
      (experienceWeights.match * (matchScore || 0))
    )
  );

  const checkById = checks.reduce((acc, check) => {
    acc[check.id] = check;
    return acc;
  }, {} as Record<string, ATSCheck>);

  const prioritizedFixes = fixCandidates
    .map(candidate => {
      const check = checkById[candidate.checkId];
      const impactScore = check ? Math.max(0, check.maxScore - check.score) : 0;
      const rationale = check
        ? `${candidate.rationaleHint} (${check.score}/${check.maxScore} on ${check.name}).`
        : candidate.rationaleHint;
      return {
        id: candidate.id,
        title: candidate.title,
        severity: candidate.severity,
        reason: candidate.reason,
        action: candidate.action,
        rationale,
        impactScore
      };
    })
    .sort((a, b) => {
      if (b.impactScore !== a.impactScore) return b.impactScore - a.impactScore;
      return severityRank(b.severity) - severityRank(a.severity);
    })
    .slice(0, 5);

  const parsingPreviewLines: string[] = [];
  const contactLine = [
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location?.city,
    resume.basics.location?.country
  ].filter(Boolean).join(' | ');
  parsingPreviewLines.push(resume.basics.name || 'Your Name');
  if (resume.basics.label) parsingPreviewLines.push(resume.basics.label);
  if (contactLine) parsingPreviewLines.push(contactLine);
  parsingPreviewLines.push('');

  if (resume.basics.summary) {
    parsingPreviewLines.push(headingFor('summary', 'Summary').toUpperCase());
    parsingPreviewLines.push(resume.basics.summary);
    parsingPreviewLines.push('');
  }

  if (resume.work.length > 0) {
    parsingPreviewLines.push(headingFor('work', 'Work Experience').toUpperCase());
    resume.work.forEach(job => {
      const dateText = [job.startDate, job.endDate].filter(Boolean).join(' - ');
      parsingPreviewLines.push(`${job.position || ''} | ${job.company || ''} ${dateText ? `(${dateText})` : ''}`.trim());
      if (job.summary) parsingPreviewLines.push(job.summary);
      job.highlights?.forEach(b => parsingPreviewLines.push(`- ${b}`));
      parsingPreviewLines.push('');
    });
  }

  if (resume.education.length > 0) {
    parsingPreviewLines.push(headingFor('education', 'Education').toUpperCase());
    resume.education.forEach(edu => {
      const dateText = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
      parsingPreviewLines.push(`${edu.studyType || ''} ${edu.area || ''} | ${edu.institution || ''} ${dateText ? `(${dateText})` : ''}`.trim());
      if (edu.summary) parsingPreviewLines.push(edu.summary);
      parsingPreviewLines.push('');
    });
  }

  if (resume.skills.length > 0) {
    parsingPreviewLines.push(headingFor('skills', 'Skills').toUpperCase());
    parsingPreviewLines.push(
      resume.skills
        .map(s => [s.name, ...(s.keywords || [])].filter(Boolean).join(': '))
        .join(' | ')
    );
    parsingPreviewLines.push('');
  }

  if (resume.projects.length > 0) {
    parsingPreviewLines.push(headingFor('projects', 'Projects').toUpperCase());
    resume.projects.forEach(project => {
      const dateText = [project.startDate, project.endDate].filter(Boolean).join(' - ');
      parsingPreviewLines.push(`${project.name || ''} ${dateText ? `(${dateText})` : ''}`.trim());
      if (project.description) parsingPreviewLines.push(project.description);
      project.highlights?.forEach(b => parsingPreviewLines.push(`- ${b}`));
      parsingPreviewLines.push('');
    });
  }

  if (resume.certificates.length > 0) {
    parsingPreviewLines.push(headingFor('certificates', 'Certificates').toUpperCase());
    resume.certificates.forEach(cert => {
      const dateText = cert.date ? `(${cert.date})` : '';
      parsingPreviewLines.push(`${cert.name || ''} | ${cert.issuer || ''} ${dateText}`.trim());
    });
    parsingPreviewLines.push('');
  }

  const parsingPreview = parsingPreviewLines.join('\n').trim();

  checks.filter(c => !c.passed || c.score < c.maxScore).forEach(c => {
    if (c.id === 'cliches' && !c.passed) {
      feedback.push(`Remove cliches like "${foundCliches[0]}" to be more specific.`);
    } else if (c.id === 'action-verbs' && !c.passed) {
      feedback.push('Start bullets with strong action verbs (Achieved, Created, Led).');
    } else {
      feedback.push(c.message);
    }
  });

  if (feedback.length === 0) {
    feedback.push('Excellent! Your resume is optimized for ATS.');
  }

  return {
    totalScore,
    atsScore: clamp(atsScore),
    readabilityScore: clamp(readabilityScore),
    matchScore: keywordMatchSummary ? clamp(keywordMatchSummary.matchScore) : undefined,
    coverageScore: clamp(coverageScore),
    checks,
    feedback,
    prioritizedFixes,
    bulletSuggestions: bulletSuggestions.slice(0, 6),
    readabilityNotes,
    parsingPreview,
    parsingRisks,
    keywordMatch: keywordMatchSummary,
  };
};
