import { create } from 'zustand';
import { db, type Resume } from '@/db';
import { v4 as uuidv4 } from 'uuid';

interface ResumeState {
  // Current active resume being edited
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadResume: (id: string) => Promise<void>;
  saveResume: (resume: Resume) => Promise<void>;
  createNewResume: (title?: string, templateId?: string) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  getAllResumes: () => Promise<Resume[]>;
  updateCurrentResume: (updates: Partial<Resume>) => void;
  resetResume: () => void;
  clearError: () => void;
}

const createEmptyResume = (title: string = 'Untitled Resume', templateId: string = 'ats'): Resume => ({
  id: uuidv4(),
  meta: {
    title,
    templateId,
    themeColor: '#3b82f6',
    lastModified: new Date().toISOString(),
    layoutSettings: {
      fontSize: 8.5,
      lineHeight: 1.2,
      sectionMargin: 8,
      bulletMargin: 2,
      useBullets: true,
      columnCount: 1,
      headerPosition: 'top',
      leftColumnWidth: 30,
      marginHorizontal: 15,
      marginVertical: 15,
      sectionOrder: [
        'work',
        'education',
        'skills',
        'projects',
        'certificates',
        'languages',
        'interests',
        'publications',
        'awards',
        'references',
        'custom'
      ],
      sectionHeadingStyle: 4,
      sectionHeadingCapitalization: 'uppercase',
      sectionHeadingSize: 'M',
      sectionHeadingIcons: 'none',
      entryLayoutStyle: 1,
      entryColumnWidth: 'auto',
      entryTitleSize: 'M',
      entrySubtitleStyle: 'italic',
      entrySubtitlePlacement: 'nextLine',
      entryIndentBody: false,
      entryListStyle: 'bullet',
      personalDetailsAlign: 'center',
      personalDetailsArrangement: 1,
      personalDetailsContactStyle: 'icon',
      personalDetailsIconStyle: 1,
      nameSize: 'M',
      nameBold: true,
      nameFont: 'body',
      skillsDisplayStyle: 'grid',
      skillsLevelStyle: 3,
      languagesDisplayStyle: 'level',
      languagesLevelStyle: 'dots',
      interestsDisplayStyle: 'compact',
      interestsSeparator: 'pipe',
      interestsSubinfoStyle: 'dash',
      certificatesDisplayStyle: 'grid',
      certificatesLevelStyle: 3,
    },
  },
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: { city: '', country: '' },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  interests: [],
  publications: [],
  awards: [],
  references: [],
  custom: [],
});

export const useResumeStore = create<ResumeState>((set, get) => ({
  currentResume: null,
  isLoading: false,
  error: null,

  loadResume: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const resume = await db.resumes.get(id);
      if (resume) {
        set({ currentResume: resume, isLoading: false });
      } else {
        set({ error: 'Resume not found', isLoading: false });
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  saveResume: async (resume: Resume) => {
    set({ isLoading: true, error: null });
    try {
      const updatedResume = {
        ...resume,
        meta: {
          ...resume.meta,
          lastModified: new Date().toISOString(),
        },
      };
      await db.resumes.put(updatedResume);
      set({ currentResume: updatedResume, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createNewResume: async (title?: string, templateId: string = 'ats') => {
    set({ isLoading: true, error: null });
    try {
      const newResume = createEmptyResume(title, templateId);
      await db.resumes.add(newResume);
      set({ currentResume: newResume, isLoading: false });
      return newResume;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteResume: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await db.resumes.delete(id);
      const { currentResume } = get();
      if (currentResume?.id === id) {
        set({ currentResume: null });
      }
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  getAllResumes: async () => {
    try {
      return await db.resumes.orderBy('meta.lastModified').reverse().toArray();
    } catch (err) {
      set({ error: (err as Error).message });
      return [];
    }
  },

  updateCurrentResume: (updates: Partial<Resume>) => {
    const { currentResume } = get();
    if (currentResume) {
      set({
        currentResume: {
          ...currentResume,
          ...updates,
          meta: {
            ...currentResume.meta,
            ...(updates.meta || {}),
            lastModified: new Date().toISOString(),
          },
        },
      });
    }
  },

  resetResume: () => {
    const { currentResume } = get();
    if (currentResume) {
      const empty = createEmptyResume(currentResume.meta.title, currentResume.meta.templateId);
      set({
        currentResume: {
          ...empty,
          id: currentResume.id, // Keep same ID
          meta: currentResume.meta, // Keep same meta (title, theme, template)
        }
      });
    }
  },

  clearError: () => set({ error: null }),
}));
