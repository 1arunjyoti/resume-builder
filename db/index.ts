import Dexie, { type EntityTable } from 'dexie';

// Resume data model based on JSON Resume standard
export interface ResumeBasics {
  name: string;
  label: string;
  image?: Blob;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: {
    city: string;
    country: string;
  };
  profiles: {
    network: string;
    username: string;
    url: string;
  }[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  summary?: string;
  courses: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  startDate: string;
  endDate: string;
  url: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  summary: string;
}

export interface Language {
  id: string;
  language: string;
  fluency: string;
}

export interface Interest {
  id: string;
  name: string;
  keywords: string[];
}

export interface Publication {
  id: string;
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

export interface Award {
  id: string;
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  reference: string;
}

export interface CustomSection {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    description: string;
    date: string;
    url: string;
    summary: string;
  }[];
}

export interface LayoutSettings {
  fontSize: number; // 8-12, default 9
  lineHeight: number; // 1.2-1.8, default 1.4
  sectionMargin: number; // 8-20, default 12
  bulletMargin: number; // 2-8, default 4
  useBullets: boolean; // default true
  // Advanced Layout
  columnCount: 1 | 2 | 3; // 1=One, 2=Two, 3=Mix/Custom
  headerPosition: 'top' | 'left' | 'right';
  leftColumnWidth: number; // percentage 20-80
  sectionOrder: string[];
  marginHorizontal: number; // 0-30mm
  marginVertical: number; // 0-30mm
  // Section Headings
  sectionHeadingStyle: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 8 visual styles
  sectionHeadingCapitalization: 'capitalize' | 'uppercase';
  sectionHeadingSize: 'S' | 'M' | 'L' | 'XL';
  sectionHeadingIcons: 'none' | 'outline' | 'filled';
  // Entry Layout
  entryLayoutStyle: 1 | 2 | 3 | 4 | 5; // 5 layout styles
  entryColumnWidth: 'auto' | 'manual';
  entryTitleSize: 'S' | 'M' | 'L';
  entrySubtitleStyle: 'normal' | 'bold' | 'italic';
  entrySubtitlePlacement: 'sameLine' | 'nextLine';
  entryIndentBody: boolean;
  entryListStyle: 'bullet' | 'hyphen';
  // Personal Details
  personalDetailsAlign: 'left' | 'center' | 'right';
  personalDetailsArrangement: 1 | 2; // 2 arrangement styles
  personalDetailsContactStyle: 'icon' | 'bullet' | 'bar';
  personalDetailsIconStyle: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  // Name
  nameSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  nameBold: boolean;
  nameFont: 'body' | 'creative';
  // Skills
  skillsDisplayStyle: 'grid' | 'level' | 'compact' | 'bubble';
  skillsLevelStyle: 1 | 2 | 3 | 4;
  // Languages
  languagesDisplayStyle: 'grid' | 'level' | 'compact' | 'bubble';
  languagesLevelStyle: 'text' | 'dots' | 'bar';
  // Interests
  interestsDisplayStyle: 'grid' | 'compact' | 'bubble';
  interestsSeparator: 'bullet' | 'pipe' | 'newLine' | 'comma';
  interestsSubinfoStyle: 'dash' | 'colon' | 'bracket';
  // Certificates
  certificatesDisplayStyle: 'grid' | 'compact' | 'bubble';
  certificatesLevelStyle: 1 | 2 | 3 | 4;
}

export interface Resume {
  id: string;
  meta: {
    title: string;
    templateId: string;
    themeColor: string;
    lastModified: string;
    layoutSettings: LayoutSettings;
  };
  basics: ResumeBasics;
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
  interests: Interest[];
  publications: Publication[];
  awards: Award[];
  references: Reference[];
  custom: CustomSection[];
}

export interface AppSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  defaultTemplateId: string;
}

// Dexie database definition
const db = new Dexie('ResumeBuilderDB') as Dexie & {
  resumes: EntityTable<Resume, 'id'>;
  settings: EntityTable<AppSettings, 'id'>;
};

// Schema version 1
db.version(1).stores({
  resumes: 'id, meta.title, meta.lastModified',
  settings: 'id',
});

export { db };
