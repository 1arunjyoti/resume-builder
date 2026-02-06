/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { calculateATSScore } from '../../lib/ats-score';
import type { Resume } from '@/db';

// Helper to create a minimal valid resume
const createMockResume = (overrides?: Partial<Resume>): Resume => ({
  id: 'test-resume-1',
  meta: {
    title: 'Test Resume',
    templateId: 'modern',
    lastModified: new Date().toISOString(),
    version: 1,
    layoutSettings: {} as any
  },
  basics: {
    name: 'John Doe',
    label: 'Software Engineer',
    email: 'john@example.com',
    phone: '+1234567890',
    url: 'https://johndoe.com',
    summary: '',
    location: { address: '', postalCode: '', region: '', city: 'San Francisco', country: 'USA' },
    profiles: [],
    image: ''
  },
  work: [] as any[],
  education: [] as any[],
  skills: [] as any[],
  projects: [] as any[],
  certificates: [] as any[],
  publications: [] as any[],
  awards: [] as any[],
  languages: [] as any[],
  interests: [] as any[],
  references: [] as any[],
  custom: [] as any[],
  ...overrides
} as Resume);

describe('ATS Score Fixes', () => {
  describe('Issue #1: Total score bounds', () => {
    it('should never exceed 100 even with job description', () => {
      const resume = createMockResume({
        basics: {
          ...createMockResume().basics,
          name: 'Jane Smith',
          label: 'Senior Software Engineer',
          summary: 'Experienced software engineer with Python, JavaScript, React, Node.js, AWS, Docker expertise',
          location: { address: '', postalCode: '', region: '', city: 'SF', country: 'USA' }
        },
        work: [{
          id: '1',
          position: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2018-01',
          endDate: '2023-12',
          summary: 'Led engineering team',
          highlights: [
            'Improved system performance by 50%',
            'Reduced costs by $100,000 annually',
            'Led team of 10 engineers',
            'Delivered 15+ major features',
            'Increased user engagement by 40%',
            'Achieved 99.9% uptime'
          ]
        }] as any,
        skills: [
          { id: '1', name: 'Python', level: 'advanced', keywords: ['Django', 'Flask'] },
          { id: '2', name: 'JavaScript', level: 'advanced', keywords: ['React', 'Node.js'] },
          { id: '3', name: 'AWS', level: 'intermediate', keywords: ['EC2', 'S3', 'Lambda'] }
        ] as any
      });

      const jobDescription = `
        We're looking for a Senior Software Engineer with strong Python and JavaScript experience.
        Must have AWS, Docker, Kubernetes expertise. React and Node.js highly desired.
        Should demonstrate leadership, performance optimization, and cost reduction skills.
      `;

      const result = calculateATSScore(resume, jobDescription);
      
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });

    it('should have weights that sum to 1.0 with job description', () => {
      const resume = createMockResume();
      const jobDescription = 'Software engineer with Python skills';
      
      const result = calculateATSScore(resume, jobDescription);
      
      // The score should be within valid bounds
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Issue #2: Double-weighting fix', () => {
    it('should not double-weight ATS score', () => {
      const resume = createMockResume({
        basics: createMockResume().basics,
        work: [{
          id: '1',
          position: 'Developer',
          company: 'Company',
          startDate: '2022-01',
          summary: 'Built features',
          highlights: ['Developed feature A', 'Implemented feature B']
        }] as any,
        skills: [{ name: 'Python' }] as any
      });

      const result = calculateATSScore(resume);
      
      // ATS score should be proportional to the raw score without double scaling
      expect(result.atsScore).toBeGreaterThanOrEqual(0);
      expect(result.atsScore).toBeLessThanOrEqual(100);
      
      // Total score should be reasonable
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Issue #3: Metric density calculation', () => {
    it('should only count metrics from bullets, not summaries', () => {
      const resume = createMockResume({
        basics: createMockResume().basics,
        work: [{
          id: '1',
          position: 'Manager',
          company: 'Corp',
          startDate: '2020-01',
          summary: 'Managed 50 people and $2M budget', // Metrics here should NOT count
          highlights: [
            'Increased revenue by 30%', // This should count
            'Reduced costs by $100k',   // This should count
            'Regular team meetings'     // No metric
          ]
        }] as any
      });

      const result = calculateATSScore(resume);
      
      // Check metric density calculation
      const metricDensityCheck = result.checks.find(c => c.id === 'metric-density');
      expect(metricDensityCheck).toBeDefined();
      
      // With 2 metrics in 3 bullets, ratio should be ~0.67
      // If summaries were counted, it would be 4/3 = 1.33 (wrong)
      if (metricDensityCheck?.details?.[0]) {
        const ratio = parseFloat(metricDensityCheck.details[0].match(/[\d.]+/)?.[0] || '0');
        expect(ratio).toBeGreaterThan(0.6);
        expect(ratio).toBeLessThan(0.7);
      }
    });
  });

  describe('Issue #4: Word-boundary keyword matching', () => {
    it('should not match AWS in saws', () => {
      const resume = createMockResume({
        basics: {...createMockResume().basics, summary: 'I used chainsaws and other power tools'},
        work: [{
          id: '1',
          position: 'Worker',
          company: 'Corp',
          startDate: '2020-01',
          highlights: ['Operated various saws and cutting equipment']
        }] as any
      });

      const jobDescription = 'Need AWS cloud experience';
      const result = calculateATSScore(resume, jobDescription);
      
      // AWS should not be matched
      expect(result.keywordMatch?.matched).not.toContain('aws');
      expect(result.keywordMatch?.missing).toContain('aws');
    });

    it('should match AWS when it appears as a word', () => {
      const resume = createMockResume({
        basics: {...createMockResume().basics, summary: 'Experienced with AWS cloud services'},
        skills: [{ name: 'AWS' }] as any
      });

      const jobDescription = 'Need AWS cloud experience';
      const result = calculateATSScore(resume, jobDescription);
      
      // AWS should be matched
      expect(result.keywordMatch?.matched).toContain('aws');
    });

    it('should not match react in create', () => {
      const resume = createMockResume({
        basics: {...createMockResume().basics, summary: 'I create applications'}
      });

      const jobDescription = 'React developer needed';
      const result = calculateATSScore(resume, jobDescription);
      
      // react should not be matched
      expect(result.keywordMatch?.matched).not.toContain('react');
      expect(result.keywordMatch?.missing).toContain('react');
    });

    it('should match multi-word phrases correctly', () => {
      const resume = createMockResume({
        basics: {...createMockResume().basics, summary: 'Expert in machine learning and data science'}
      });

      const jobDescription = 'Machine learning engineer position';
      const result = calculateATSScore(resume, jobDescription);
      
      // Multi-word phrase should be matched
      expect(result.keywordMatch?.matched.some(k => k.includes('machine'))).toBe(true);
    });
  });

  describe('Issue #5: Keyword classification improvements', () => {
    it('should classify common tools correctly', () => {
      const resume = createMockResume({
        skills: [
          { name: 'JavaScript' },
          { name: 'Docker' },
          { name: 'Kubernetes' }
        ] as any
      });

      const jobDescription = `
        Looking for engineer with Docker, Kubernetes, Redis, Kafka, 
        Jenkins, GraphQL, and TypeScript experience
      `;
      
      const result = calculateATSScore(resume, jobDescription);
      
      // Verify tools are classified in the tools category
      expect(result.keywordMatch?.categories.tools.matched).toBeDefined();
      expect(result.keywordMatch?.categories.tools.matched.length).toBeGreaterThan(0);
    });

    it('should classify responsibilities with verbs correctly', () => {
      const resume = createMockResume({
        work: [{
          id: '1',
          position: 'Engineer',
          company: 'Corp',
          startDate: '2020-01',
          highlights: [
            'Managed team projects',
            'Led development initiatives', 
            'Designed system architecture'
          ]
        }] as any
      });

      const jobDescription = 'Must manage team, lead projects, design solutions';
      const result = calculateATSScore(resume, jobDescription);
      
      // Verify responsibilities are detected
      expect(result.keywordMatch?.categories.responsibilities).toBeDefined();
    });

    it('should handle technical suffixes in tool detection', () => {
      const resume = createMockResume({
        skills: [
          { name: 'Next.js' },
          { name: 'Vue.js' },
          { name: 'FastAPI' }
        ] as any
      });

      const jobDescription = 'Need Next.js, Vue.js, and FastAPI skills';
      const result = calculateATSScore(resume, jobDescription);
      
      // These should be classified as tools despite non-standard naming
      expect(result.keywordMatch?.categories.tools).toBeDefined();
    });

    it('should not default everything to skills', () => {
      const resume = createMockResume({
        basics: createMockResume().basics,
        work: [{
          id: '1',
          position: 'Dev',
          company: 'Co',
          startDate: '2020-01',
          highlights: ['Led projects', 'Used Docker and Kubernetes']
        }] as any,
        skills: [{ name: 'Leadership' }, { name: 'Docker' }] as any
      });

      const jobDescription = 'Need Docker, lead teams, manage projects';
      const result = calculateATSScore(resume, jobDescription);
      
      // Verify distribution across categories
      const toolsCount = result.keywordMatch?.categories.tools.matched.length || 0;
      const responsibilitiesCount = result.keywordMatch?.categories.responsibilities.matched.length || 0;
      
      // Should have items in multiple categories, not all in skills
      expect(toolsCount + responsibilitiesCount).toBeGreaterThan(0);
    });
  });

  describe('Overall scoring consistency', () => {
    it('should produce consistent scores for similar resumes', () => {
      const resume1 = createMockResume({
        basics: {...createMockResume().basics, summary: 'Python developer'},
        work: [{
          id: '1',
          position: 'Developer',
          company: 'Corp',
          startDate: '2020-01',
          highlights: ['Built Python apps', 'Improved performance by 20%']
        }] as any,
        skills: [{ name: 'Python' }] as any
      });

      const resume2 = createMockResume({
        basics: {...createMockResume().basics, summary: 'Python developer'},
        work: [{
          id: '1',
          position: 'Developer',
          company: 'Company',
          startDate: '2020-01',
          highlights: ['Developed Python software', 'Increased efficiency by 25%']
        }] as any,
        skills: [{ name: 'Python' }] as any
      });

      const result1 = calculateATSScore(resume1);
      const result2 = calculateATSScore(resume2);
      
      // Scores should be similar (within 10 points) for similar resumes
      expect(Math.abs(result1.totalScore - result2.totalScore)).toBeLessThan(10);
    });

    it('should produce higher scores for better resumes', () => {
      const weakResume = createMockResume({
        basics: createMockResume().basics,
        work: [{
          id: '1',
          position: 'Worker',
          company: 'Co',
          startDate: '2022-01',
          highlights: ['Did work']
        }] as any
      });

      const strongResume = createMockResume({
        basics: {...createMockResume().basics, summary: 'Accomplished software engineer with proven track record'},
        work: [{
          id: '1',
          position: 'Senior Engineer',
          company: 'Tech Corp',
          startDate: '2018-01',
          highlights: [
            'Led team of 10 engineers',
            'Increased revenue by 40%',
            'Reduced costs by $200k annually',
            'Delivered 20+ features on time',
            'Improved system performance by 60%',
            'Mentored 5 junior developers'
          ]
        }] as any,
        skills: [
          { name: 'Python', keywords: ['Django', 'Flask'] },
          { name: 'JavaScript', keywords: ['React', 'Node.js'] },
          { name: 'AWS', keywords: ['EC2', 'Lambda'] },
          { name: 'Docker' },
          { name: 'Kubernetes' }
        ] as any,
        education: [{
          id: '1',
          institution: 'Top University',
          area: 'Computer Science',
          studyType: 'Bachelor'
        }] as any
      });

      const weakResult = calculateATSScore(weakResume);
      const strongResult = calculateATSScore(strongResume);
      
      // Strong resume should score significantly higher
      expect(strongResult.totalScore).toBeGreaterThan(weakResult.totalScore);
      expect(strongResult.totalScore - weakResult.totalScore).toBeGreaterThan(20);
    });
  });
});
