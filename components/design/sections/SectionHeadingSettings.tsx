import { Label } from "@/components/ui/label";
import { Heading } from "lucide-react";
import React from "react";
import { SettingsSection } from "../SettingsSection";

import { LayoutSettings, LayoutSettingValue } from "../types";

interface SectionHeadingSettingsProps {
  layoutSettings: LayoutSettings;
  updateSetting: (key: keyof LayoutSettings, value: LayoutSettingValue) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SectionHeadingSettings({
  layoutSettings,
  updateSetting,
  isOpen,
  onToggle,
}: SectionHeadingSettingsProps) {
  return (
    <SettingsSection
      title="Section Headings"
      icon={Heading}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* Style */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Style Template
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((style) => (
            <button
              key={style}
              onClick={() => updateSetting("sectionHeadingStyle", style)}
              className={`relative flex items-center justify-center h-10 rounded-md border-2 transition-all hover:bg-muted/50 ${
                (layoutSettings.sectionHeadingStyle || 1) === style
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-muted/40 hover:border-border"
              }`}
            >
              <span className="text-xs font-bold text-muted-foreground">
                {style}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Text Case</Label>
          <div className="flex rounded-md shadow-sm border overflow-hidden">
            {[
              { value: "capitalize", label: "Aa" },
              { value: "uppercase", label: "AA" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateSetting("sectionHeadingCapitalization", option.value)
                }
                className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                  (layoutSettings.sectionHeadingCapitalization ||
                    "uppercase") === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Text Size</Label>
          <select
            className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={layoutSettings.sectionHeadingSize || "M"}
            onChange={(e) =>
              updateSetting("sectionHeadingSize", e.target.value)
            }
          >
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </select>
        </div>
      </div>

      {/* Align and Bold */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Alignment</Label>
          <div className="flex rounded-md shadow-sm border overflow-hidden">
            {[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateSetting("sectionHeadingAlign", option.value)
                }
                className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                  (layoutSettings.sectionHeadingAlign || "left") ===
                  option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Font Weight</Label>
          <button
            onClick={() =>
              updateSetting(
                "sectionHeadingBold",
                !(layoutSettings.sectionHeadingBold ?? true),
              )
            }
            className={`w-full h-8.5 rounded-md border text-xs font-medium transition-all ${
              (layoutSettings.sectionHeadingBold ?? true)
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            Bold Text
          </button>
        </div>
      </div>

      <div className="space-y-3 mt-4 pt-4 border-t">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Visible Headings
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Summary", key: "summaryHeadingVisible" },
            { label: "Experience", key: "workHeadingVisible" },
            { label: "Education", key: "educationHeadingVisible" },
            { label: "Skills", key: "skillsHeadingVisible" },
            { label: "Projects", key: "projectsHeadingVisible" },
            { label: "Awards", key: "awardsHeadingVisible" },
            { label: "Certifications", key: "certificatesHeadingVisible" },
            { label: "Languages", key: "languagesHeadingVisible" },
            { label: "Interests", key: "interestsHeadingVisible" },
            { label: "Publications", key: "publicationsHeadingVisible" },
            { label: "References", key: "referencesHeadingVisible" },
            { label: "Custom", key: "customHeadingVisible" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() =>
                updateSetting(
                  item.key as keyof LayoutSettings,
                  !(layoutSettings[item.key as keyof LayoutSettings] ?? true),
                )
              }
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                (layoutSettings[item.key as keyof LayoutSettings] ?? true)
                  ? "border-primary/50 bg-primary/5 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{item.label}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  (layoutSettings[item.key as keyof LayoutSettings] ?? true)
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}
