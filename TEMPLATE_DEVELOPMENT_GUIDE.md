# Template Development Guide

Complete guide for creating and modifying resume templates using the factory-based template system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Creating a New Template](#creating-a-new-template)
3. [Modifying Existing Templates](#modifying-existing-templates)
4. [Configuration Reference](#configuration-reference)
5. [Theme System](#theme-system)
6. [Core Components](#core-components)
7. [Advanced Customization](#advanced-customization)
8. [Best Practices](#best-practices)

---

## Architecture Overview

The new template system uses a **factory pattern** with **composable themes** and **universal components**:

```
Template = Factory Function + Configuration + Theme + Core Components
```

### System Hierarchy (Priority Order)

1. **Template-Specific Overrides** (Highest Priority)
   - File: `lib/template-factory.tsx` → `TEMPLATE_CONFIGS[templateId].themeOverrides`
   - Purpose: Template-specific styling and behavior

2. **Theme-Level Configuration** (Medium Priority)  
   - File: `lib/theme-system.ts` → `THEME_PRESETS[themeId].overrides`
   - Purpose: Shared styling for templates using the same theme

3. **Base Defaults** (Lowest Priority)
   - File: `lib/theme-system.ts` → `BASE_SETTINGS`
   - Purpose: Fallback values for all templates

### File Structure

```
lib/
├── template-factory.tsx     # Factory function + template configs
├── theme-system.ts          # Theme presets + base settings
components/templates/
├── FactoryTemplates.tsx     # Generated template exports
├── core/                    # Universal components
│   ├── primitives/         # Basic building blocks
│   └── sections/           # Content sections
└── index.ts                # Template exports
```

---

## Creating a New Template

### Step 1: Add Template Configuration

Add your template to `TEMPLATE_CONFIGS` in `lib/template-factory.tsx`:

```typescript
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // ... existing templates

  myTemplate: {
    id: "myTemplate",
    name: "My Custom Template",
    layoutType: "single-column",           // Layout structure
    defaultThemeColor: "#3b82f6",          // Default accent color
    
    // Optional: Custom section arrangements for multi-column layouts
    leftColumnSections: [
      "skills", "education", "languages"
    ],
    rightColumnSections: [
      "summary", "work", "projects"
    ],
    
    // Template-specific overrides
    themeOverrides: {
      fontFamily: "Open Sans",
      fontSize: 10,
      sectionMargin: 8,
      headerBottomMargin: 15,
      sectionHeadingStyle: 2,              // No decoration
      entryTitleSize: "L",                 // Large entry titles
      contactSeparator: "pipe",            // Use | between contact items
    },
  },
};
```

### Step 2: Export Template

Add your template to `components/templates/FactoryTemplates.tsx`:

```typescript
// Auto-generated templates using factory
export const MyTemplate = createTemplate(TEMPLATE_CONFIGS.myTemplate);

// Export for PDF generation
export async function generateMyTemplatePDF(resume: Resume): Promise<Blob> {
  const doc = <MyTemplate resume={resume} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
```

### Step 3: Register Template

Add to `components/templates/index.ts`:

```typescript
export { MyTemplate, generateMyTemplatePDF } from "./FactoryTemplates";
```

### Step 4: Test Your Template

```typescript
import { MyTemplate } from "@/components/templates";

// Use in your application
<MyTemplate resume={resumeData} />
```

---

## Modifying Existing Templates

### Quick Styling Changes

#### Change Template Colors
```typescript
// In TEMPLATE_CONFIGS.classic.themeOverrides:
{
  themeColorTarget: ["headings", "links", "decorations"],
  // Template will use resume.meta.themeColor for these elements
}
```

#### Adjust Spacing
```typescript
{
  sectionMargin: 5,           // Space between sections
  headerBottomMargin: 2,      // Space after header
  bulletMargin: 1,            // Space for bullet lists
  lineHeight: 1.1,            // Text line spacing
}
```

#### Change Typography
```typescript
{
  fontFamily: "Times-Roman",
  fontSize: 9,
  nameFontSize: 24,
  sectionHeadingSize: "L",    // S, M, L, XL
  entryTitleSize: "M",
}
```

#### Modify Section Headings
```typescript
{
  sectionHeadingStyle: 1,           // 1=underline, 2=plain, 3=bold underline, etc.
  sectionHeadingAlign: "left",      // left, center, right
  sectionHeadingCapitalization: "uppercase",  // uppercase, lowercase, capitalize
  sectionHeadingBold: true,
}
```

#### Customize Entry Styling
```typescript
{
  entryLayoutStyle: 1,              // Layout variant
  entryTitleSize: "L",              // Entry title size
  entrySubtitleStyle: "italic",     // normal, bold, italic
  entrySubtitlePlacement: "sameLine", // sameLine, nextLine
  entryListStyle: "bullet",         // bullet, number, hyphen, blank
  entryIndentBody: false,           // Indent entry descriptions
}
```

### Advanced Layout Changes

#### Column Layouts
```typescript
{
  layoutType: "two-column-sidebar-left",
  leftColumnWidth: 30,              // Percentage width
  leftColumnSections: ["skills", "education"],
  rightColumnSections: ["work", "projects"],
}
```

#### Section Order
```typescript
{
  sectionOrder: [
    "summary", "work", "skills", 
    "education", "projects", "certificates"
  ],
}
```

#### Header Positioning
```typescript
{
  headerPosition: "top",            // top, left, right
  headerAlignment: "center",        // left, center, right
  personalDetailsArrangement: 1,    // 1=horizontal, 2=vertical
}
```

---

## Configuration Reference

### Layout Types

| Type | Description | Columns | Header |
|------|-------------|---------|---------|
| `single-column` | Traditional single column | 1 | Top |
| `single-column-centered` | Single column, centered header | 1 | Top (centered) |
| `two-column-sidebar-left` | Sidebar on left | 2 | Top |
| `two-column-sidebar-right` | Sidebar on right | 2 | Top |
| `two-column-wide` | Two columns, wider main | 2 | Top |
| `creative-sidebar` | Creative layout with background | 2 | Left |

### Section Heading Styles

| Style | Visual | Description |
|-------|--------|-------------|
| 1 | `Title` &#x0332; | Solid underline |
| 2 | `Title` | No decoration |
| 3 | `Title` &#x0332;&#x0332; | Bold/double underline |
| 4 | &#x25AC;`Title`&#x25AC; | Background highlight |
| 5 | &#x2503; `Title` | Left accent bar |
| 6 | &#x0305;`Title`&#x0332; | Top & bottom border |
| 7 | `Title` &#x2508; | Dashed underline |
| 8 | `Title` &#x00B7;&#x00B7; | Dotted underline |

### Size Options

| Size | Multiplier | Use Case |
|------|------------|----------|
| `S` | +0 | Small headings |
| `M` | +1 | Standard size |
| `L` | +2 | Large headings |
| `XL` | +4 | Extra large |

### List Styles

| Style | Visual | Description |
|-------|--------|-------------|
| `bullet` | • Item | Bullet points |
| `number` | 1. Item | Numbered list |
| `hyphen` | - Item | Hyphen bullets |
| `blank` | Item | No bullets |

---

## Theme System

### Creating Custom Themes

Add to `THEME_PRESETS` in `lib/theme-system.ts`:

```typescript
myTheme: {
  typography: "modern",              // Base typography preset
  headings: "underline",             // Heading style preset
  layout: "singleColumn",            // Layout preset
  entries: "compact",                // Entry style preset
  contact: "iconPipe",               // Contact style preset
  
  overrides: {
    // Custom overrides for this theme
    fontSize: 9.5,
    headerBottomMargin: 10,
    sectionHeadingCapitalization: "capitalize",
  },
},
```

### Typography Presets

```typescript
// In TYPOGRAPHY_PRESETS:
myTypography: {
  fontFamily: "Source Sans Pro",
  nameFontSize: 28,
  nameLineHeight: 1.2,
  nameBold: true,
  nameLetterSpacing: 0.5,
  titleFontSize: 12,
  titleBold: false,
  titleItalic: true,
  contactFontSize: 10,
},
```

### Heading Presets

```typescript
// In HEADING_PRESETS:
myHeadings: {
  sectionHeadingStyle: 4,            // Background highlight
  sectionHeadingAlign: "left",
  sectionHeadingBold: true,
  sectionHeadingCapitalization: "uppercase",
  sectionHeadingSize: "L",
  sectionHeadingLetterSpacing: 1,
},
```

---

## Core Components

### Available Components

#### Primitives
- **SectionHeading**: Section titles with 8 visual styles
- **EntryHeader**: Job titles, company names, dates, URLs
- **ContactInfo**: Email, phone, location, social links
- **BulletList**: Formatted lists with various bullet styles
- **ProfileImage**: Profile photo with shape/border options
- **RichText**: Rich text with bold, italic, links

#### Sections
- **WorkSection**: Employment history
- **EducationSection**: Academic background
- **SkillsSection**: Skills with proficiency levels
- **ProjectsSection**: Projects with descriptions
- **CertificatesSection**: Certifications
- **AwardsSection**: Awards and achievements
- **PublicationsSection**: Published works
- **ReferencesSection**: References
- **LanguagesSection**: Language proficiency
- **InterestsSection**: Personal interests
- **SummarySection**: Professional summary
- **CustomSection**: User-defined content

### Component Props Pattern

All core components follow this pattern:

```typescript
export interface ComponentProps {
  // Data
  data: DataType[];              // The content to render
  
  // Settings  
  settings: LayoutSettings;      // Layout configuration
  fonts: FontConfig;             // Font configuration
  fontSize: number;              // Base font size
  getColor: GetColorFn;          // Color resolver function
  
  // Optional overrides
  lineHeight?: number;           // Line spacing
  sectionTitle?: string;         // Custom section title
  sectionMargin?: number;        // Custom spacing
  containerStyle?: object;       // Custom container styles
}
```

---

## Advanced Customization

### Custom Section Components

Create template-specific section components:

```typescript
// components/templates/myTemplate/MyCustomSection.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";

export const MyCustomSection: React.FC<MyCustomSectionProps> = ({
  data, settings, fonts, fontSize, getColor
}) => {
  // Custom implementation
  return (
    <View>
      <Text>Custom section content</Text>
    </View>
  );
};
```

Register in template config:

```typescript
{
  customComponents: {
    work: MyCustomWorkSection,        // Override work section
    skills: MyCustomSkillsSection,    // Override skills section
  }
}
```

### Theme Color Targeting

Control which elements use the theme color:

```typescript
{
  themeColorTarget: [
    "headings",      // Section headings
    "links",         // URLs and links
    "icons",         // Contact icons
    "decorations",   // Borders, underlines
    "accents",       // Accent elements
    "name",          // Name in header
  ]
}
```

### Custom Color Functions

```typescript
// Custom color logic
const getColor = (target: string, fallback: string = "#000000") => {
  const colorTargets = settings.themeColorTarget || [];
  
  if (target === "headings" && colorTargets.includes("headings")) {
    return resume.meta.themeColor;
  }
  
  if (target === "custom") {
    return "#ff6b35";  // Custom orange for special elements
  }
  
  return fallback;
};
```

### Dynamic Layouts

```typescript
// Conditional column assignment
const getSectionColumns = (settings: LayoutSettings) => {
  if (settings.skillsInSidebar) {
    return {
      leftColumnSections: [...defaultLeft, "skills"],
      rightColumnSections: defaultRight.filter(s => s !== "skills")
    };
  }
  return { leftColumnSections: defaultLeft, rightColumnSections: defaultRight };
};
```

---

## Best Practices

### 1. Configuration Hierarchy

**Use the right level for your changes:**

- **Template overrides**: Template-specific styling that should always apply
- **Theme overrides**: Shared styling for related templates
- **Base settings**: Global defaults that work for most templates

### 2. Spacing Guidelines

**Recommended spacing values:**

```typescript
// Compact templates (Classic, Professional)
{ 
  sectionMargin: 4-6,
  headerBottomMargin: 2-8,
  bulletMargin: 1-2 
}

// Standard templates (Modern, Elegant)
{ 
  sectionMargin: 8-10,
  headerBottomMargin: 12-15,
  bulletMargin: 2-3 
}

// Spacious templates (Creative, Designer)
{ 
  sectionMargin: 12-16,
  headerBottomMargin: 20-25,
  bulletMargin: 3-4 
}
```

### 3. Typography Scale

**Font size relationships:**

```typescript
{
  fontSize: 10,           // Base size
  nameFontSize: 24,       // ~2.4x base
  titleFontSize: 12,      // ~1.2x base  
  contactFontSize: 9,     // ~0.9x base
  sectionHeadingSize: "L" // +2 from base = 12pt
}
```

### 4. Theme Consistency

**Keep related templates consistent:**

```typescript
// All "professional" variants should share:
{
  typography: "professional",
  headings: "bottomBorder", 
  contact: "iconPipe",
  // Then customize with overrides
}
```

### 5. Component Reuse

**Leverage existing components:**

```typescript
// Good: Use existing primitives
<EntryHeader 
  title={job.company}
  subtitle={job.position}
  date={job.dateRange}
  // ... other props
/>

// Avoid: Custom implementations unless necessary
<Text>{job.company}</Text>
<Text>{job.position}</Text>  
```

### 6. Performance

**Minimize StyleSheet.create() calls:**

```typescript
// Good: Single stylesheet per component
const styles = StyleSheet.create({
  container: { marginBottom: sectionMargin },
  entry: { marginBottom: 8 },
  // ... all styles
});

// Avoid: Multiple stylesheets
const containerStyles = StyleSheet.create({...});
const entryStyles = StyleSheet.create({...});
```

### 7. Testing

**Test your templates:**

1. **Multiple resume sizes**: Test with minimal and extensive content
2. **Column layouts**: Ensure sections fit properly in assigned columns  
3. **Color combinations**: Test with different theme colors
4. **Font variations**: Test with different font families
5. **Spacing edge cases**: Very long names, many entries, etc.

---

## Migration from Legacy Templates

### Converting Existing Templates

1. **Identify unique styling** in the legacy template
2. **Map to configuration options** in the new system
3. **Create template config** with appropriate overrides
4. **Test and refine** spacing and styling
5. **Remove legacy files** once verified

### Example Migration

**Before (Legacy):**
```typescript
// 300+ lines of custom component code
export const MyLegacyTemplate = ({ resume }) => {
  // Lots of custom styling and layout code
};
```

**After (Factory):**
```typescript
// ~20 lines of configuration
myTemplate: {
  id: "myTemplate", 
  name: "My Template",
  layoutType: "single-column",
  defaultThemeColor: "#3b82f6",
  themeOverrides: {
    fontFamily: "Open Sans",
    sectionMargin: 8,
    sectionHeadingStyle: 2,
    // ... other unique styling
  },
}
```

---

## Troubleshooting

### Common Issues

**1. Styles not applying:**
- Check configuration hierarchy (template > theme > base)
- Verify property names match exactly
- Ensure template is using correct theme preset

**2. Layout problems:**
- Check column section assignments
- Verify layout type matches intended structure
- Test with different content amounts

**3. Spacing issues:**
- Check sectionMargin, headerBottomMargin, bulletMargin
- Verify lineHeight isn't too tight/loose
- Test SectionHeading marginBottom override

**4. Typography problems:**
- Ensure font family is registered in `lib/fonts.ts`
- Check fontSize relationships (name, title, contact)
- Verify letterSpacing values are reasonable

### Debug Mode

Add debug styling to visualize layouts:

```typescript
{
  // Add to themeOverrides for debugging
  debugMode: true,  // Adds borders to sections
  showGrid: true,   // Shows column boundaries
}
```

---

## Quick Reference

### Template Creation Checklist

- [ ] Add configuration to `TEMPLATE_CONFIGS`
- [ ] Export template in `FactoryTemplates.tsx`  
- [ ] Register in `index.ts`
- [ ] Test with sample resume data
- [ ] Verify spacing and typography
- [ ] Test column layouts (if applicable)
- [ ] Check color theme integration
- [ ] Validate with different content sizes

### Essential Configuration Properties

```typescript
{
  // Identity
  id: string,
  name: string,
  
  // Layout
  layoutType: LayoutType,
  defaultThemeColor: string,
  
  // Spacing
  sectionMargin: number,
  headerBottomMargin: number,
  bulletMargin: number,
  
  // Typography  
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  
  // Styling
  sectionHeadingStyle: number,
  sectionHeadingAlign: string,
  entryTitleSize: string,
}
```

This guide covers the complete template development workflow. The factory-based system provides powerful customization while maintaining consistency and reducing code duplication.