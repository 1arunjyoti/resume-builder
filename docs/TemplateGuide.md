# Template System Guide

The project now uses a **Template Factory** system. This removes the need for individual `*Template.tsx` files.

## 📁 Key Files

| File                                            | Purpose                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`lib/theme-system.ts`**                       | **Start Here.** The central database for all template styles and logical configurations.                              |
| **`lib/template-factory.tsx`**                  | The "engine" that renders PDFs based on the configs. You rarely need to touch this unless adding a new _layout type_. |
| **`components/templates/FactoryTemplates.tsx`** | Registers the templates. New templates must be added to the registry here.                                            |

---

## 🛠 How to Modify an Existing Template

**Do not edit `components/templates/*.tsx`.**
Instead, edit **`lib/theme-system.ts`**.

1. Open `lib/theme-system.ts`.
2. Scroll to `TEMPLATE_THEMES` (near line 572).
3. Find the template ID (e.g., `creative`, `modern`).
4. Modify the configuration:
    - **Change Presets:** Update `typography`, `headings`, or `layout` to one of the available presets defined at the top of the file.
    - **Add Overrides:** Use the `overrides` object to set specific properties like `fontSize`, `headerBottomMargin`, or `sectionOrder`.

**Example:**

```typescript
creative: {
  typography: "modern", // Changed from "creative"
  overrides: {
    headerBottomMargin: 30, // Increased margin
    nameFontSize: 24,       // Custom font size
  }
}
```

---

## ➕ How to Add a New Template

1. **Define the Theme (`lib/theme-system.ts`):**
    Add a new entry to `TEMPLATE_THEMES`:

    ```typescript
    myNewTemplate: {
      typography: "modern",
      headings: "underline",
      layout: "singleColumn",
      entries: "compact", // or "traditional", "modern"
      contact: "iconPipe",
      overrides: {
         defaultThemeColor: "#ff0000"
      }
    }
    ```

2. **Register the Template (`components/templates/FactoryTemplates.tsx`):**
    - Create a config object:

      ```typescript
      const myNewConfig: TemplateConfig = {
        id: "myNewTemplate", // Must match key in theme-system
        name: "My New Template",
        layoutType: "single-column", // Must match layout preset
      };
      ```

    - Create the template instance:

      ```typescript
      const myNew = createTemplate(myNewConfig);
      ```

    - Export it (optional, for backwards compatibility):

      ```typescript
      export const MyNewTemplate = myNew.Template;
      ```

    - Add to `FACTORY_TEMPLATES` registry:

      ```typescript
      export const FACTORY_TEMPLATES = {
        // ... existing
        myNewTemplate: myNew,
      };
      ```

3. **Use It:**
    The new template ID `myNewTemplate` is now available throughout the app (e.g., in the resume editor's template picker).
