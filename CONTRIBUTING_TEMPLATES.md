# Contributing New Templates

This guide will help you create and integrate new resume templates into the Resume Builder. Templates define the visual appearance and layout of the generated PDF resumes.

## Table of Contents

- [Overview](#overview)
- [Template Structure](#template-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Design Considerations](#design-considerations)
- [Template Settings](#template-settings)
- [Testing Your Template](#testing-your-template)
- [Best Practices](#best-practices)

## Overview

Templates in this project use `@react-pdf/renderer` to create PDF documents. Each template:

1. Receives resume data and layout settings
2. Renders the data using React components
3. Exports a PDF generation function
4. Has default layout settings and a theme color

## Best Practices
Start from an Existing Template

Copy an existing **completed** template as your starting point:
- **ClassicTemplate.tsx**: Traditional single-column layout, fully featured

## Template Structure

A template consists of three key parts:

### 1. Template Component File (`components/templates/YourTemplate.tsx`)

This is the main React component that renders the resume PDF.

### 2. Template Defaults (`lib/template-defaults.ts`)

Default layout settings that define the template's initial appearance.

### 3. Template Registration

Registering your template in:
- `components/templates/index.ts` - Export your template
- `lib/constants.ts` - Add to TEMPLATES array
- `app/templates/page.tsx` - Add template card (optional)

## Step-by-Step Guide

### Step 1: Create the Template Component

Create a new file: `components/templates/YourTemplate.tsx`

```tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { Resume, LayoutSettings } from "@/db";
import { PDFRichText } from "./PDFRichText";
import { getTemplateDefaults } from "@/lib/template-defaults";
import { formatDate, PROFILE_IMAGE_SIZES } from "@/lib/template-utils";
import { getSectionHeadingWrapperStyles } from "@/lib/template-styles";
import "@/lib/fonts";

interface YourTemplateProps {
  resume: Resume;
}

const createStyles = (
  themeColor: string,
  settings: any, // or use the full LayoutSettings type from @/db
) =>
  StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: settings.fontFamily || "Open Sans",
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      color: "#333",
    },
    // Define your styles here...
    header: {
      marginBottom: settings.sectionMargin * 1.5,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      color: themeColor,
    },
    // Add more styles as needed...
  });

export function YourTemplate({ resume }: YourTemplateProps) {
  const { basics, work, education, skills, projects } = resume;
  const themeColor = resume.meta.themeColor || "#3b82f6"; // Default theme color
  
  // Merge template defaults with resume settings
  const templateDefaults = getTemplateDefaults(resume.meta.templateId || 'yourtemplate');
  const settings = { ...templateDefaults, ...resume.meta.layoutSettings };

  // Extract commonly used settings
  const fontSize = settings.fontSize;
  const lineHeight = settings.lineHeight;
  const sectionMargin = settings.sectionMargin;
  const bulletMargin = settings.bulletMargin;
  const fontFamily = settings.fontFamily || "Open Sans";

  const styles = createStyles(themeColor, settings);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name}</Text>
          {basics.label && <Text>{basics.label}</Text>}
          {/* Add contact info, profile image, etc. */}
        </View>

        {/* Summary Section */}
        {basics.summary && (
          <View>
            {(settings.summaryHeadingVisible ?? true) && (
              <View style={getSectionHeadingWrapperStyles(settings, themeColor)}>
                <Text>Summary</Text>
              </View>
            )}
            <PDFRichText
              text={basics.summary}
              style={styles.summary}
              fontSize={settings.fontSize}
              fontFamily={fontFamily}
              boldFontFamily={fontFamily}
              italicFontFamily={fontFamily}
            />
          </View>
        )}

        {/* Work Experience Section */}
        {work.length > 0 && (
          <View>
            {(settings.workHeadingVisible ?? true) && (
              <View style={getSectionHeadingWrapperStyles(settings, themeColor)}>
                <Text>Work Experience</Text>
              </View>
            )}
            {work.map((job) => (
              <View key={job.id}>
                <Text>{job.position}</Text>
                <Text>{job.name}</Text>
                <Text>
                  {formatDate(job.startDate)} - {formatDate(job.endDate)}
                </Text>
                {job.summary && (
                  <PDFRichText
                    text={job.summary}
                    fontSize={settings.fontSize}
                    fontFamily={fontFamily}
                    boldFontFamily={fontFamily}
                    italicFontFamily={fontFamily}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Add more sections: education, skills, projects, etc. */}
      </Page>
    </Document>
  );
}

// Export PDF generation function
export async function generateYourTemplatePDF(resume: Resume): Promise<Blob> {
  const doc = <YourTemplate resume={resume} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
```

### Step 2: Add Template Defaults

In `lib/template-defaults.ts`, add your template's default settings:

```typescript
export const TEMPLATE_DEFAULTS: Record<string, Partial<LayoutSettings>> = {
  // ... existing templates ...
  
  yourtemplate: {
    ...baseDefaults,
    fontFamily: "Open Sans",
    columnCount: 1,
    headerPosition: "top",
    leftColumnWidth: 30,
    headerBottomMargin: 6,
    
    // Section order
    sectionOrder: [
      "summary",
      "work",
      "education",
      "skills",
      "projects",
      "certificates",
      "publications",
      "awards",
      "languages",
      "interests",
      "references",
      "custom",
    ],
    
    // Section Headings
    sectionHeadingStyle: 2, // 1-8, see template-styles.ts
    sectionHeadingAlign: "left",
    sectionHeadingBold: true,
    sectionHeadingCapitalization: "uppercase",
    sectionHeadingSize: "M",
    sectionHeadingIcons: "none",
    
    // Entry Layout
    entryLayoutStyle: 1,
    entryColumnWidth: "auto",
    entryTitleSize: "M",
    entrySubtitleStyle: "normal",
    entrySubtitlePlacement: "nextLine",
    entryIndentBody: false,
    entryListStyle: "bullet",
    
    // Header/Personal Details
    personalDetailsAlign: "left",
    personalDetailsArrangement: 1,
    personalDetailsContactStyle: "icon",
    personalDetailsIconStyle: 1,
    nameSize: "L",
    nameFontSize: 24,
    nameLineHeight: 1.2,
    nameBold: true,
    nameFont: "body",
    titleFontSize: 12,
    titleLineHeight: 1.2,
    titleBold: false,
    titleItalic: false,
    contactFontSize: 9,
    contactBold: false,
    contactItalic: false,
    contactSeparator: "pipe",
    
    showProfileImage: false,
    profileImageSize: "M",
    profileImageShape: "circle",
    profileImageBorder: false,
    profileImagePosition: "header",
  },
};
```

Also add a default theme color in the same file:

```typescript
export function getTemplateThemeColor(templateId: string): string {
  const themeColors: Record<string, string> = {
    // ... existing templates ...
    yourtemplate: "#3b82f6", // Your template's default color
  };

  return themeColors[templateId] || "#000000";
}
```

### Step 3: Register the Template

#### In `components/templates/index.ts`:

```typescript
export { YourTemplate, generateYourTemplatePDF } from './YourTemplate';
```

#### In `lib/constants.ts`:

```typescript
export type TemplateType = "ats" | "creative" | "modern" | "professional" | "elegant" | "classic" | "yourtemplate";

export const TEMPLATES: { id: TemplateType; name: string; description: string }[] = [
  // ... existing templates ...
  {
    id: "yourtemplate",
    name: "Your Template Name",
    description: "Brief description of your template",
  },
];
```

#### In `app/templates/page.tsx` (optional, for template gallery):

Add a template card to showcase your template:

```typescript
const templates = [
  // ... existing templates ...
  {
    id: "yourtemplate",
    name: "Your Template Name",
    description: "Detailed description of what makes your template unique and when to use it.",
    category: ["Modern", "Professional"], // Choose appropriate categories
    gradient: "bg-linear-to-br from-blue-50 to-indigo-50",
    image: "/images/yourtemplate.jpg", // Add a preview image
    features: [
      "Key Feature 1",
      "Key Feature 2",
      "Key Feature 3",
      "Key Feature 4",
    ],
  },
];
```

### Step 4: Update the Template Selector

The template should now be available in the design settings. The system automatically picks it up from the TEMPLATES array.

## Design Considerations

### Layout Patterns

**Single Column**: Simple, linear flow from top to bottom
```tsx
<Page>
  <Header />
  <Summary />
  <Work />
  <Education />
  <Skills />
</Page>
```

**Two Column**: Sidebar + main content
```tsx
<Page style={{ flexDirection: "row" }}>
  <View style={{ width: "35%" }}>
    <Photo />
    <Skills />
    <Languages />
  </View>
  <View style={{ width: "65%" }}>
    <Header />
    <Summary />
    <Work />
    <Education />
  </View>
</Page>
```

**Three Column**: Rare, but for compact designs
```tsx
<Page style={{ flexDirection: "row" }}>
  <View style={{ width: "25%" }}>...</View>
  <View style={{ width: "50%" }}>...</View>
  <View style={{ width: "25%" }}>...</View>
</Page>
```

### Typography

Available fonts (defined in `lib/fonts.ts`):
- **Open Sans**: Modern, clean (sans-serif)
- **Montserrat**: Bold, geometric (sans-serif)
- **Times-Roman**: Classic, traditional (serif)
- **Courier**: Monospace, technical

Set up font references:
```tsx
const selectedFont = settings.fontFamily;
const baseFont = selectedFont;
const boldFont = selectedFont;  // Same font for bold
const italicFont = selectedFont; // Same font for italic

// Use in component
fontFamily: baseFont,
fontFamily: settings.titleBold ? boldFont : baseFont,
fontFamily: settings.titleItalic ? italicFont : baseFont,
```

Font size guidelines:
- Name: 24-36px (controlled by `nameFontSize`)
- Section Headings: 12-16px (controlled by `sectionHeadingSize` + base `fontSize`)
- Body Text: 8.5-10px (controlled by `fontSize`)
- Small Text: 8-9px (`fontSize - 1` or `fontSize - 2`)

### Color Usage

Theme colors can be applied to specific elements based on user preferences. Use a helper function to apply colors conditionally:

```tsx
// Helper to get color based on settings
const colorTargets = settings.themeColorTarget; // Array of enabled targets
const getColor = (target: string, fallback: string = "#000000") => {
  return colorTargets.includes(target)
    ? resume.meta.themeColor
    : fallback;
};

// Usage in styles:
color: getColor("headings")       // Section titles
color: getColor("links")          // URLs and clickable elements
color: getColor("icons")          // Small decorative icons
color: getColor("decorations")    // Lines, borders, backgrounds
color: getColor("name")           // User's name in header
color: getColor("title", "#666")  // Job title (with fallback)
```

This pattern allows users to control which elements use the theme color through the `themeColorTarget` setting.

### Spacing

Control spacing with settings:
- `sectionMargin`: Space between sections (default: 6-10)
- `bulletMargin`: Space between bullet points (default: 1-2)
- `headerBottomMargin`: Space after header (default: 4-8)
- `marginHorizontal`: Page horizontal margins in mm (convert with `mmToPt()`)
- `marginVertical`: Page vertical margins in mm (convert with `mmToPt()`)

```tsx
import { mmToPt } from "@/lib/template-utils";

const marginH = mmToPt(settings.marginHorizontal);
const marginV = mmToPt(settings.marginVertical);

// Use in page styles
page: {
  paddingHorizontal: marginH,
  paddingVertical: marginV,
  // ...
}
```

### Profile Images

Support profile images using:
```tsx
const renderProfileImage = () => {
  if (!basics.image || !settings.showProfileImage) return null;

  const size = PROFILE_IMAGE_SIZES[settings.profileImageSize || "M"];

  return (
    <Image
      src={basics.image}
      style={{
        width: size,
        height: size,
        borderRadius: settings.profileImageShape === "square" ? 0 : size / 2,
        borderWidth: settings.profileImageBorder ? 1 : 0,
        borderColor: themeColor,
        objectFit: "cover",
      }}
    />
  );
};
```

### Rich Text

Use `PDFRichText` component for formatted text (bold, italic, bullets):
```tsx
<PDFRichText
  text={job.summary}
  style={styles.summary}
  fontSize={settings.fontSize}
  fontFamily={fontFamily}
  boldFontFamily={fontFamily}
  italicFontFamily={fontFamily}
/>
```

## Template Settings

### Core Settings

Your template should respect these settings from `LayoutSettings`:

**Typography**:
- `fontFamily`: Font choice
- `fontSize`: Base text size
- `lineHeight`: Line spacing

**Layout**:
- `columnCount`: 1, 2, or 3 columns
- `headerPosition`: "top", "left", "right"
- `leftColumnWidth`: Width of left sidebar (%)

**Section Headings** (use `getSectionHeadingWrapperStyles()`):
- `sectionHeadingStyle`: 1-8 visual styles
- `sectionHeadingAlign`: "left", "center", "right"
- `sectionHeadingBold`: Bold text
- `sectionHeadingCapitalization`: "uppercase", "lowercase", "none"
- `sectionHeadingSize`: "S", "M", "L"
- `sectionHeadingIcons`: "none", "style1", "style2"

**Entry Layout**:
- `entryLayoutStyle`: 1-4 different entry layouts
- `entryTitleSize`: "S", "M", "L"
- `entrySubtitleStyle`: "normal", "italic", "bold"
- `entrySubtitlePlacement`: "sameLine", "nextLine"
- `entryIndentBody`: Indent description text
- `entryListStyle`: "bullet", "dash", "number"

**Personal Details**:
- `personalDetailsAlign`: "left", "center", "right"
- `personalDetailsArrangement`: Layout pattern (1-4)
- `personalDetailsContactStyle`: "text", "icon", "inline"
- `nameSize`, `nameBold`, `nameFont`
- `titleFontSize`, `titleBold`, `titleItalic`
- `contactFontSize`, `contactSeparator`

**Profile Image**:
- `showProfileImage`: Boolean
- `profileImageSize`: "S", "M", "L"
- `profileImageShape`: "circle", "square"
- `profileImageBorder`: Boolean
- `profileImagePosition`: "header", "sidebar"

**Section Visibility** (respect these):
- `summaryHeadingVisible`
- `workHeadingVisible`
- `educationHeadingVisible`
- `skillsHeadingVisible`
- `projectsHeadingVisible`
- (and more for each section)

**Section Order**:
- `sectionOrder`: Array of section IDs defining render order

### Using Shared Style Functions

The project provides shared style generators in `lib/template-styles.ts`:

```tsx
import { getSectionHeadingWrapperStyles } from "@/lib/template-styles";

// In your component - pass getColor function OR direct theme color string:
// Option 1: Pass the getColor function
<View style={getSectionHeadingWrapperStyles(settings, getColor)}>
  <Text style={styles.sectionTitle}>Section Name</Text>
</View>

// Option 2: Pass theme color directly
<View style={getSectionHeadingWrapperStyles(settings, themeColor)}>
  <Text style={styles.sectionTitle}>Section Name</Text>
</View>
```

This function automatically handles all 8 section heading styles:
1. Solid Underline
2. No Decoration
3. Double/Bold Underline
4. Dotted Underline
5. Left Border Bar
6. Full Width Background
7. Pill/Rounded Background
8. Top and Bottom Border

The function adapts to `sectionHeadingAlign` (left, center, right) and applies the theme color appropriately.

## Testing Your Template

### 1. Local Development

```bash
npm run dev
```

Navigate to `/editor` and select your template from the design settings.

### 2. Test with Different Data

- Test with minimal data (just name and one job)
- Test with extensive data (multiple jobs, education, skills)
- Test with rich text formatting (bold, italic, bullets)
- Test with and without profile image
- Test different theme colors

### 3. Check Responsiveness

- Ensure content doesn't overflow pages
- Test page breaks (long work histories)
- Verify spacing is consistent
- Check two-column layouts don't overlap

### 4. Print Quality

- Download the PDF and verify:
  - Fonts render correctly
  - Colors print well (not too light)
  - Text is readable at actual size
  - No pixelation or artifacts

### 5. Settings Integration

Test that your template respects:
- Font size changes
- Line height adjustments
- Section reordering
- Section visibility toggles
- Entry layout styles
- Theme color changes

## Best Practices

### 1. Start from an Existing Template

Copy an existing **completed** template as your starting point:
- **ClassicTemplate.tsx**: Traditional single-column layout, fully featured
- **ProfessionalTemplate.tsx**: Two-column layout with sidebar

This ensures you don't miss any required features and follow established patterns.

> **Note**: Other templates (ATS, Creative, Modern, Elegant) are still in development and may not be complete references.

### 2. Use Semantic Styles

Group related styles logically:
```tsx
const styles = StyleSheet.create({
  // Page layout
  page: { ... },
  
  // Header styles
  header: { ... },
  name: { ... },
  title: { ... },
  contactInfo: { ... },
  
  // Section styles
  section: { ... },
  sectionTitle: { ... },
  
  // Entry styles (work, education, etc.)
  entryContainer: { ... },
  entryTitle: { ... },
  entrySubtitle: { ... },
  entryDate: { ... },
  
  // Content styles
  bulletList: { ... },
  bulletItem: { ... },
  bulletText: { ... },
});
```

### 3. Maintain Consistency

- Use the same spacing values throughout
- Keep typography hierarchy clear
- Apply theme color consistently
- Match the visual style across all sections

### 4. Optimize for Content Density

- Balance whitespace and information
- Ensure 1-2 pages can fit most resumes
- Use appropriate font sizes (not too small!)
- Consider multi-column layouts for dense content

### 5. Accessibility & ATS Compatibility

- Use standard fonts for body text
- Maintain good contrast ratios
- Keep logical reading order (top-to-bottom, left-to-right)
- Avoid overly complex layouts that confuse parsers

### 6. Performance

- Don't create new style objects in render loops
- Pre-calculate styles in `createStyles()`
- Use memoization for expensive operations
- Keep component tree shallow

### 7. Documentation

Add comments to explain:
- Non-obvious style choices
- Complex layout logic
- Calculations and magic numbers
- Browser/PDF-specific workarounds

### 8. Handle Edge Cases

```tsx
// Empty data
{work.length > 0 && <WorkSection />}

// Missing fields
{basics.label && <Text>{basics.label}</Text>}

// Long text
<Text style={{ wordWrap: "break-word" }}>{longText}</Text>

// Optional settings
{(settings.showProfileImage ?? false) && <ProfileImage />}
```

## Common Pitfalls

❌ **Don't hardcode values**: Use settings parameters
❌ **Don't ignore page breaks**: Content may overflow
❌ **Don't use unsupported CSS**: @react-pdf/renderer has limitations
❌ **Don't forget mobile preview**: Test in different viewports
❌ **Don't skip section visibility checks**: Respect user preferences
❌ **Don't use exotic fonts**: Stick to registered fonts
❌ **Don't create inaccessible layouts**: Keep logical structure

## Advanced Features

### Dynamic Columns

The ClassicTemplate supports dynamic column layouts based on `columnCount` setting:

```tsx
const columnCount = settings.columnCount;
const leftColumnWidthPercent = settings.leftColumnWidth;
const rightColumnWidthPercent = 100 - leftColumnWidthPercent;

// Split sections into columns
const allSections = ["summary", "work", "education", "skills", ...];
const leftColumnContent = allSections.slice(0, Math.ceil(allSections.length / columnCount));
const rightColumnContent = allSections.slice(Math.ceil(allSections.length / columnCount));

// Render with conditional layout
{columnCount === 1 ? (
  <View>
    {/* Single column - render all sections */}
  </View>
) : (
  <View style={{ flexDirection: "row", gap: 12 }}>
    <View style={{ width: `${leftColumnWidthPercent}%` }}>
      {/* Left column sections */}
    </View>
    <View style={{ width: `${rightColumnWidthPercent}%` }}>
      {/* Right column sections */}
    </View>
  </View>
)}
```

### Section Ordering

Respect user-defined section order using `settings.sectionOrder`:

```tsx
// Create a mapping of section renderers
const SECTION_RENDERERS = {
  summary: renderSummary,
  work: renderWork,
  education: renderEducation,
  skills: renderSkills,
  projects: renderProjects,
  certificates: renderCertificates,
  languages: renderLanguages,
  interests: renderInterests,
  publications: renderPublications,
  awards: renderAwards,
  references: renderReferences,
  custom: renderCustom,
};

// Render sections in user-defined order
{settings.sectionOrder.map((sectionId) => {
  const renderer = SECTION_RENDERERS[sectionId];
  return renderer ? renderer() : null;
})}
```

### Skill Level Indicators

Support visual skill level indicators (dots, bars, signal bars, or text):

```tsx
import { getLevelScore } from "@/lib/template-utils";

const RenderLevel = ({ level }: { level: string }) => {
  const levelStyle = settings.skillsLevelStyle ?? 0; // 0=None, 1=Dots, 2=Bars, 3=Signal, 4=Text
  if (!level || levelStyle === 0) return null;
  
  const score = getLevelScore(level); // Converts "Beginner"/"Expert" to 1-5
  const max = 5;

  // Style 1: Dots
  if (levelStyle === 1) {
    return (
      <View style={{ flexDirection: "row", gap: 2, marginLeft: 6 }}>
        {[...Array(max)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i < score ? getColor("decorations") : "#ddd",
            }}
          />
        ))}
      </View>
    );
  }
  
  // Style 3: Signal Bars (growing height)
  if (levelStyle === 3) {
    return (
      <View style={{ flexDirection: "row", gap: 2, alignItems: "flex-end", height: 10 }}>
        {[...Array(max)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 4,
              height: (i + 1) * 2,
              backgroundColor: i < score ? getColor("decorations") : "#ddd",
            }}
          />
        ))}
      </View>
    );
  }
  
  // Style 4: Text
  return (
    <Text style={{ fontSize: fontSize - 1, color: "#666", marginLeft: 6, fontStyle: "italic" }}>
      ({level})
    </Text>
  );
};

// Use in skills rendering
<RenderLevel level={skill.level} />
```

### Granular Typography Controls

The ClassicTemplate provides fine-grained control over typography for each section component:

```tsx
// Example: Work experience with separate controls for each element
<Text style={{
  fontFamily: settings.experienceCompanyBold ? boldFont : baseFont,
  fontWeight: settings.experienceCompanyBold ? "bold" : "normal",
  fontStyle: settings.experienceCompanyItalic ? "italic" : "normal",
}}>
  {exp.company}
</Text>

<Text style={{
  fontFamily: settings.experiencePositionBold ? boldFont : baseFont,
  fontWeight: settings.experiencePositionBold ? "bold" : "normal",
  fontStyle: settings.experiencePositionItalic ? "italic" : "normal",
}}>
  {exp.position}
</Text>

<Text style={{
  fontFamily: settings.experienceDateItalic ? italicFont : baseFont,
  fontWeight: settings.experienceDateBold ? "bold" : "normal",
  fontStyle: settings.experienceDateItalic ? "italic" : "normal",
}}>
  {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
</Text>
```

Available granular settings include:
- **Experience**: `experienceCompanyBold`, `experienceCompanyItalic`, `experiencePositionBold`, `experiencePositionItalic`, `experienceDateBold`, `experienceDateItalic`, `experienceWebsiteBold`, `experienceWebsiteItalic`, `experienceAchievementsBold`, `experienceAchievementsItalic`
- **Education**: `educationInstitutionBold`, `educationInstitutionItalic`, `educationDegreeBold`, `educationDegreeItalic`, `educationAreaBold`, `educationAreaItalic`, `educationDateBold`, `educationDateItalic`, `educationGpaBold`, `educationGpaItalic`, `educationCoursesBold`, `educationCoursesItalic`
- **Projects**: `projectsNameBold`, `projectsNameItalic`, `projectsDateBold`, `projectsDateItalic`, `projectsFeaturesBold`, `projectsFeaturesItalic`, `projectsTechnologiesBold`, `projectsTechnologiesItalic`
- **Languages**: `languagesNameBold`, `languagesNameItalic`, `languagesFluencyBold`, `languagesFluencyItalic`

This gives users complete control over the visual hierarchy and emphasis in their resume.

### List Styles

Support different list styles for various sections:

```tsx
// Bullets, numbers, or no markers
{settings.experienceCompanyListStyle === "bullet" && (
  <Text style={{ marginRight: 4 }}>•</Text>
)}
{settings.experienceCompanyListStyle === "number" && (
  <Text style={{ marginRight: 4 }}>{index + 1}.</Text>
)}
```

List style settings include:
- `experienceCompanyListStyle`, `experienceAchievementsListStyle`
- `educationInstitutionListStyle`
- `projectsListStyle`, `projectsAchievementsListStyle`
- `skillsListStyle` (bullet, dash, inline, blank)
- `languagesListStyle` (bullet, number, none)

### Contact Information Layouts

Support multiple contact layout arrangements:

```tsx
const contactLayout = settings.personalDetailsArrangement; // 1, 2, 3, 4...

// Layout 1: Inline with separators
{basics.email && (
  <Link src={`mailto:${basics.email}`}>
    <Text>{basics.email}</Text>
  </Link>
)}
{basics.phone && (
  <>
    <Text>{settings.contactSeparator === "dash" ? " - " : " | "}</Text>
    <Text>{basics.phone}</Text>
  </>
)}

// Layout 2: Stacked vertically
{contactLayout === 2 && (
  <View style={{ flexDirection: "column", gap: 4 }}>
    {basics.email && <Text>{basics.email}</Text>}
    {basics.phone && <Text>{basics.phone}</Text>}
  </View>
)}
```

## Need Help?

- Review existing completed templates (**ClassicTemplate.tsx**, **ProfessionalTemplate.tsx**) for examples
- Check utility functions in `lib/template-utils.ts`:
  - `formatDate()`: Format dates consistently
  - `getLevelScore()`: Convert skill levels to numeric scores
  - `mmToPt()`: Convert millimeters to points for margins
  - `PROFILE_IMAGE_SIZES`: Predefined image size constants
- Check `@react-pdf/renderer` documentation for PDF-specific features
- Test frequently during development with various data scenarios
- Ask for code review before submitting

## Submission Checklist

Before submitting your template:

- [ ] Template component created in `components/templates/`
- [ ] Default settings added to `lib/template-defaults.ts`
- [ ] Theme color defined in `getTemplateThemeColor()`
- [ ] Template exported in `components/templates/index.ts`
- [ ] Template registered in `lib/constants.ts`
- [ ] Template card added to `app/templates/page.tsx` (optional)
- [ ] Tested with minimal and extensive data
- [ ] Tested all layout settings
- [ ] Tested theme color changes
- [ ] PDF renders without errors
- [ ] No content overflow issues
- [ ] All sections render correctly
- [ ] Rich text formatting works
- [ ] Profile images display properly
- [ ] Code is well-documented

---

**Happy template designing! 🎨** We look forward to your contributions!
