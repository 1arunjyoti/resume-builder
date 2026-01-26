/**
 * Template Exports
 * 
 * All templates are now created using the factory system.
 * Each template is defined by a simple configuration object (~20-50 lines)
 * instead of 300-600 lines of duplicated rendering logic.
 * 
 * Usage:
 *   import { ATSTemplate, generatePDF } from '@/components/templates';
 *   import { FACTORY_TEMPLATES, getFactoryTemplate } from '@/components/templates';
 */

// Factory template exports (primary system)
export { 
  FACTORY_TEMPLATES, 
  getFactoryTemplate, 
  getTemplateIds 
} from './FactoryTemplates';

// All templates now exported from FactoryTemplates
export {
  ATSTemplate,
  generatePDF,
  ClassicTemplate,
  generateClassicPDF,
  ModernTemplate,
  generateModernPDF,
  CreativeTemplate,
  generateCreativePDF,
  ProfessionalTemplate,
  generateProfessionalPDF,
  ElegantTemplate,
  generateElegantPDF,
  ClassicSlateTemplate,
  generateClassicSlatePDF,
  GlowTemplate,
  generateGlowPDF,
  MulticolumnTemplate,
  generateMulticolumnPDF,
  StylishTemplate,
  generateStylishPDF,
  TimelineTemplate,
  generateTimelinePDF,
  PolishedTemplate,
  generatePolishedPDF,
  DeveloperTemplate,
  generateDeveloperPDF,
  Developer2Template,
  generateDeveloper2PDF,
} from './FactoryTemplates';





