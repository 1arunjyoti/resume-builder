"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Minus,
  Plus,
  RotateCcw,
  LayoutList,
  Palette,
  AppWindow,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Heading,
  AlignLeft,
  ChevronDown,
  Wrench,
  Languages,
  Award,
  AlignRight,
  Briefcase,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";
import { THEME_COLORS, SECTIONS } from "@/lib/constants";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Components ---

function SettingsSection({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border-b last:border-0 border-border/40"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-2 hover:bg-muted/30 transition-colors group rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-md transition-colors ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-6 pt-2 px-3 animate-in fade-in-0 slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2">
        <div className="space-y-6 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface SortableItemProps {
  id: string;
  label: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableItem({
  id,
  label,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2.5 rounded-lg bg-card border shadow-sm hover:border-primary/50 transition-colors group touch-none"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isFirst}
          onClick={onMoveUp}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isLast}
          onClick={onMoveDown}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface SpacingControlProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  decimals?: number;
}

function SpacingControl({
  label,
  value,
  unit = "",
  min,
  max,
  step,
  onChange,
  decimals = 0,
}: SpacingControlProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="px-2 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground">
          {displayValue}
          {unit}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-md"
          onClick={() =>
            onChange(
              Math.max(min, parseFloat((value - step).toFixed(decimals || 2))),
            )
          }
          disabled={value <= min}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <div className="relative flex-1 group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-md"
          onClick={() =>
            onChange(
              Math.min(max, parseFloat((value + step).toFixed(decimals || 2))),
            )
          }
          disabled={value >= max}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function DesignSettings() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateCurrentResume = useResumeStore(
    (state) => state.updateCurrentResume,
  );

  // Collapsible state
  const [openSections, setOpenSections] = useState({
    layout: true,
    header: false,
    spacing: false,
    entryLayout: false,
    sectionHeadings: false,
    skills: false,
    languages: false,
    interests: false,
    certificates: false,
    themeColor: false,
    work: false,
    education: false,
    publications: false,
    awards: false,
    references: false,
    custom: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!currentResume) return null;

  const layoutSettings = currentResume.meta.layoutSettings || {
    fontSize: 8.5,
    lineHeight: 1.2,
    sectionMargin: 8,
    bulletMargin: 2,
    useBullets: true,
    columnCount: 1,
    headerPosition: "top",
    leftColumnWidth: 30,
    sectionOrder: [
      "work",
      "education",
      "skills",
      "projects",
      "certificates",
      "languages",
      "interests",
      "publications",
      "awards",
      "references",
      "custom",
    ],
    sectionHeadingStyle: 4,
    sectionHeadingCapitalization: "uppercase",
    sectionHeadingSize: "M",
    sectionHeadingIcons: "none",
    entryLayoutStyle: 1,
    entryColumnWidth: "auto",
    entryTitleSize: "M",
    entrySubtitleStyle: "italic",
    entrySubtitlePlacement: "nextLine",
    entryIndentBody: false,
    entryListStyle: "bullet",
    personalDetailsAlign: "center",
    personalDetailsArrangement: 1,
    personalDetailsContactStyle: "icon",
    personalDetailsIconStyle: 1,
    nameSize: "M",
    nameFontSize: 28,
    nameLineHeight: 1.2,
    nameBold: true,
    nameFont: "body",
    titleFontSize: 14,
    titleLineHeight: 1.2,
    titleBold: false,
    titleItalic: true,
    contactFontSize: 10,
    contactBold: false,
    contactItalic: false,
    contactSeparator: "pipe",
    showProfileImage: true,
    profileImageSize: "M",
    profileImageShape: "circle",
    profileImageBorder: false,
    skillsDisplayStyle: "grid",
    skillsLevelStyle: 3,
    languagesDisplayStyle: "level",
    languagesLevelStyle: "dots",
    interestsDisplayStyle: "compact",
    interestsSeparator: "pipe",
    interestsSubinfoStyle: "dash",
    certificatesDisplayStyle: "grid",
    certificatesLevelStyle: 3,
  };

  const updateSetting = (
    key: keyof typeof layoutSettings,
    value: number | boolean | string | string[],
  ) => {
    updateCurrentResume({
      meta: {
        ...currentResume.meta,
        layoutSettings: {
          ...layoutSettings,
          [key]: value,
        },
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = (
        layoutSettings.sectionOrder || SECTIONS.map((s) => s.id)
      ).indexOf(active.id as string);
      const newIndex = (
        layoutSettings.sectionOrder || SECTIONS.map((s) => s.id)
      ).indexOf(over?.id as string);

      const newOrder = arrayMove(
        layoutSettings.sectionOrder || SECTIONS.map((s) => s.id),
        oldIndex,
        newIndex,
      );
      updateSetting("sectionOrder", newOrder);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Reset all design settings to default values?")) {
      updateCurrentResume({
        meta: {
          ...currentResume.meta,
          themeColor: "#000000",
          layoutSettings: {
            fontSize: 8.5,
            lineHeight: 1.2,
            sectionMargin: 8,
            bulletMargin: 2,
            useBullets: true,
            themeColorTarget: ["headings", "links", "icons", "decorations"],
            columnCount: 1,
            headerPosition: "top",
            leftColumnWidth: 30,
            sectionOrder: SECTIONS.map((s) => s.id),
            marginHorizontal: 15,
            marginVertical: 15,
            sectionHeadingStyle: 4,
            sectionHeadingCapitalization: "uppercase",
            sectionHeadingSize: "M",
            sectionHeadingIcons: "none",
            entryLayoutStyle: 1,
            entryColumnWidth: "auto",
            entryTitleSize: "M",
            entrySubtitleStyle: "italic",
            entrySubtitlePlacement: "nextLine",
            entryIndentBody: false,
            entryListStyle: "bullet",
            personalDetailsAlign: "center",
            personalDetailsArrangement: 1,
            personalDetailsContactStyle: "icon",
            personalDetailsIconStyle: 1,
            nameSize: "M",
            nameFontSize: 28,
            nameLineHeight: 1.2,
            nameBold: true,
            nameFont: "body",
            titleFontSize: 14,
            titleLineHeight: 1.2,
            titleBold: false,
            titleItalic: true,
            contactFontSize: 10,
            contactBold: false,
            contactItalic: false,
            contactSeparator: "pipe",
            showProfileImage: true,
            profileImageSize: "M",
            profileImageShape: "circle",
            profileImageBorder: false,
            skillsDisplayStyle: "grid",
            skillsLevelStyle: 0,
            skillsListStyle: "blank",
            languagesListStyle: "bullet",
            languagesNameBold: true,
            languagesNameItalic: false,
            languagesFluencyBold: false,
            languagesFluencyItalic: false,
            interestsListStyle: "bullet",
            interestsNameBold: true,
            interestsNameItalic: false,
            interestsKeywordsBold: false,
            interestsKeywordsItalic: false,
            publicationsListStyle: "bullet",
            publicationsNameBold: true,
            publicationsNameItalic: false,
            publicationsPublisherBold: false,
            publicationsPublisherItalic: false,
            publicationsUrlBold: false,
            publicationsUrlItalic: false,
            publicationsDateBold: false,
            publicationsDateItalic: false,
            awardsListStyle: "bullet",
            awardsTitleBold: true,
            awardsTitleItalic: false,
            awardsAwarderBold: false,
            awardsAwarderItalic: false,
            awardsDateBold: false,
            awardsDateItalic: false,
            referencesListStyle: "bullet",
            referencesNameBold: true,
            referencesNameItalic: false,
            referencesPositionBold: false,
            referencesPositionItalic: false,
            // Custom Section Defaults
            customSectionListStyle: "bullet",
            customSectionNameBold: true,
            customSectionNameItalic: false,
            customSectionDescriptionBold: false,
            customSectionDescriptionItalic: false,
            customSectionDateBold: false,
            customSectionDateItalic: false,
            customSectionUrlBold: false,
            customSectionUrlItalic: false,
            // Certificate Defaults
            certificatesListStyle: "bullet",
            certificatesNameBold: true,
            certificatesNameItalic: false,
            certificatesIssuerBold: false,
            certificatesIssuerItalic: false,
            certificatesDateBold: false,
            certificatesDateItalic: false,
            certificatesUrlBold: false,
            certificatesUrlItalic: false,
            certificatesDisplayStyle: "compact",
            certificatesLevelStyle: 3,
            // Experience Defaults
            experienceCompanyListStyle: "none",
            experienceCompanyBold: true,
            experienceCompanyItalic: false,
            experiencePositionBold: false,
            experiencePositionItalic: false,
            experienceWebsiteBold: false,
            experienceWebsiteItalic: false,
            experienceDateBold: false,
            experienceDateItalic: false,
            experienceAchievementsListStyle: "bullet",
            experienceAchievementsBold: false,
            experienceAchievementsItalic: false,
            // Education Defaults
            educationInstitutionListStyle: "none",
            educationInstitutionBold: true,
            educationInstitutionItalic: false,
            educationDegreeBold: false,
            educationDegreeItalic: false,
            educationAreaBold: false,
            educationAreaItalic: false,
            educationDateBold: false,
            educationDateItalic: false,
            educationGpaBold: false,
            educationGpaItalic: false,
            educationCoursesBold: false,
            educationCoursesItalic: false,
            headerBottomMargin: 0,
            projectsListStyle: "number",
            projectsNameBold: false,
            projectsNameItalic: false,
            projectsDateBold: false,
            projectsDateItalic: false,
            projectsTechnologiesBold: false,
            projectsTechnologiesItalic: false,
            projectsAchievementsListStyle: "number",
            projectsFeaturesBold: false,
            projectsFeaturesItalic: false,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-lg font-semibold tracking-tight">Design & Style</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="h-8 text-muted-foreground hover:text-destructive"
          title="Reset to defaults"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="border rounded-lg bg-card/50 shadow-sm overflow-hidden divide-y divide-border/50">
        {/* Layout */}
        <SettingsSection
          title="Page Layout"
          icon={AppWindow}
          isOpen={openSections.layout}
          onToggle={() => toggleSection("layout")}
        >
          {/* Columns */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Columns
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 1, label: "One", icon: "rows" },
                { value: 2, label: "Two", icon: "columns" },
                { value: 3, label: "Mix", icon: "mix" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateSetting("columnCount", option.value as 1 | 2 | 3)
                  }
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:bg-accent ${
                    (layoutSettings.columnCount || 1) === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-transparent hover:border-primary/30"
                  }`}
                >
                  <div className="h-8 w-12 rounded bg-muted/80 flex items-center justify-center overflow-hidden shadow-inner">
                    {option.icon === "rows" && (
                      <div className="flex flex-col gap-1 w-8">
                        <div className="h-1 w-full bg-foreground/20 rounded-sm" />
                        <div className="h-1 w-full bg-foreground/20 rounded-sm" />
                        <div className="h-1 w-full bg-foreground/20 rounded-sm" />
                      </div>
                    )}
                    {option.icon === "columns" && (
                      <div className="flex gap-1 w-8 h-5">
                        <div className="h-full w-1/2 bg-foreground/20 rounded-sm" />
                        <div className="h-full w-1/2 bg-foreground/20 rounded-sm" />
                      </div>
                    )}
                    {option.icon === "mix" && (
                      <div className="flex flex-col gap-1 w-8">
                        <div className="h-1.5 w-full bg-foreground/20 rounded-sm" />
                        <div className="flex gap-1 h-3">
                          <div className="h-full w-1/3 bg-foreground/20 rounded-sm" />
                          <div className="h-full w-2/3 bg-foreground/20 rounded-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <Separator />

          {/* Column Width */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Left Column Ratio</span>
              <span className="text-muted-foreground tabular-nums bg-muted px-1.5 py-0.5 rounded text-xs">
                {layoutSettings.leftColumnWidth || 30}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={layoutSettings.leftColumnWidth || 30}
              onChange={(e) =>
                updateSetting("leftColumnWidth", parseInt(e.target.value))
              }
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              <span>Narrow</span>
              <span>Balanced</span>
              <span>Wide</span>
            </div>
          </div>

          <Separator />

          {/* Section Reordering */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Reorder Sections
            </Label>
            <div className="bg-muted/30 p-2 rounded-lg border">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={
                    layoutSettings.sectionOrder || SECTIONS.map((s) => s.id)
                  }
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {(
                      layoutSettings.sectionOrder || SECTIONS.map((s) => s.id)
                    ).map((sectionId, index) => {
                      const section = SECTIONS.find((s) => s.id === sectionId);
                      if (!section) return null;
                      const orderList =
                        layoutSettings.sectionOrder ||
                        SECTIONS.map((s) => s.id);
                      return (
                        <SortableItem
                          key={sectionId}
                          id={sectionId}
                          label={section.label}
                          isFirst={index === 0}
                          isLast={index === orderList.length - 1}
                          onMoveUp={() => {
                            const newOrder = [...orderList];
                            [newOrder[index - 1], newOrder[index]] = [
                              newOrder[index],
                              newOrder[index - 1],
                            ];
                            updateSetting("sectionOrder", newOrder);
                          }}
                          onMoveDown={() => {
                            const newOrder = [...orderList];
                            [newOrder[index + 1], newOrder[index]] = [
                              newOrder[index],
                              newOrder[index + 1],
                            ];
                            updateSetting("sectionOrder", newOrder);
                          }}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </SettingsSection>

        {/* Header Section */}
        <SettingsSection
          title="Header"
          icon={Heading}
          isOpen={openSections.header}
          onToggle={() => toggleSection("header")}
        >
          {/* Header Position */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Position
            </Label>
            <div className="flex gap-2">
              {[
                { value: "top", label: "Middle" },
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateSetting(
                      "headerPosition",
                      option.value as "top" | "left" | "right",
                    )
                  }
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all hover:bg-accent flex-1 ${
                    (layoutSettings.headerPosition || "top") === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-transparent hover:border-primary/30"
                  }`}
                >
                  <div className="h-8 w-10 rounded bg-muted/80 border flex overflow-hidden shadow-inner p-0.5">
                    {option.value === "top" && (
                      <div className="w-full h-full flex flex-col gap-0.5">
                        <div className="h-2 bg-foreground/20 w-full rounded-[1px]" />
                        <div className="flex-1 bg-background rounded-[1px]" />
                      </div>
                    )}
                    {option.value === "left" && (
                      <div className="w-full h-full flex gap-0.5">
                        <div className="w-2.5 bg-foreground/20 h-full rounded-[1px]" />
                        <div className="flex-1 bg-background rounded-[1px]" />
                      </div>
                    )}
                    {option.value === "right" && (
                      <div className="w-full h-full flex gap-0.5">
                        <div className="flex-1 bg-background rounded-[1px]" />
                        <div className="w-2.5 bg-foreground/20 h-full rounded-[1px]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <br />
            <SpacingControl
              label="Header Spacing"
              value={layoutSettings.headerBottomMargin || 20}
              unit="px"
              min={0}
              max={60}
              step={2}
              onChange={(val) => updateSetting("headerBottomMargin", val)}
            />
          </div>

          <Separator />

          {/* Name Section */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name Typography
              </Label>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() =>
                    updateSetting("nameBold", !layoutSettings.nameBold)
                  }
                  className={`px-3 h-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium w-full ${
                    layoutSettings.nameBold
                      ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  Bold
                </button>
              </div>

              <SpacingControl
                label="Font Size"
                value={layoutSettings.nameFontSize || 28}
                unit="pt"
                min={10}
                max={60}
                step={2}
                onChange={(val) => updateSetting("nameFontSize", val)}
              />

              <SpacingControl
                label="Line Height"
                value={layoutSettings.nameLineHeight || 1.2}
                min={0.8}
                max={2.0}
                step={0.05}
                decimals={2}
                onChange={(val) => updateSetting("nameLineHeight", val)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Title & Contact
              </Label>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SpacingControl
                    label="Title Font Size"
                    value={layoutSettings.titleFontSize || 14}
                    unit="pt"
                    min={10}
                    max={40}
                    step={1}
                    onChange={(val) => updateSetting("titleFontSize", val)}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      updateSetting("titleBold", !layoutSettings.titleBold)
                    }
                    className={`h-8 w-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium ${
                      layoutSettings.titleBold
                        ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    onClick={() =>
                      updateSetting("titleItalic", !layoutSettings.titleItalic)
                    }
                    className={`h-8 w-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium ${
                      layoutSettings.titleItalic
                        ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold italic"
                        : "border-border bg-background text-muted-foreground italic"
                    }`}
                    title="Italic"
                  >
                    I
                  </button>
                </div>
              </div>
              <SpacingControl
                label="Line Height"
                value={layoutSettings.titleLineHeight || 1.2}
                min={0.8}
                max={2.0}
                step={0.05}
                decimals={2}
                onChange={(val) => updateSetting("titleLineHeight", val)}
              />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SpacingControl
                    label="Contact Font Size"
                    value={layoutSettings.contactFontSize || 10}
                    unit="pt"
                    min={8}
                    max={20}
                    step={0.5}
                    decimals={1}
                    onChange={(val) => updateSetting("contactFontSize", val)}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      updateSetting("contactBold", !layoutSettings.contactBold)
                    }
                    className={`h-8 w-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium ${
                      layoutSettings.contactBold
                        ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    onClick={() =>
                      updateSetting(
                        "contactItalic",
                        !layoutSettings.contactItalic,
                      )
                    }
                    className={`h-8 w-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium ${
                      layoutSettings.contactItalic
                        ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold italic"
                        : "border-border bg-background text-muted-foreground italic"
                    }`}
                    title="Italic"
                  >
                    I
                  </button>
                </div>
              </div>

              {/* Contact Layout & Style */}
              <div className="space-y-4">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Layout
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((arrangement) => (
                    <button
                      key={arrangement}
                      onClick={() =>
                        updateSetting(
                          "personalDetailsArrangement",
                          arrangement as 1 | 2,
                        )
                      }
                      className={`flex items-center justify-center p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                        (layoutSettings.personalDetailsArrangement || 1) ===
                        arrangement
                          ? "border-primary bg-accent"
                          : "border-border bg-card"
                      }`}
                    >
                      {arrangement === 1 && (
                        <div className="flex flex-wrap gap-1 justify-center w-full scale-75">
                          <div className="h-2 w-8 bg-foreground/20 rounded-full" />
                          <div className="h-2 w-8 bg-foreground/20 rounded-full" />
                          <div className="h-2 w-8 bg-foreground/20 rounded-full" />
                        </div>
                      )}
                      {arrangement === 2 && (
                        <div className="flex flex-col gap-1 w-full items-start scale-75 pl-4">
                          <div className="h-2 w-20 bg-foreground/20 rounded-full" />
                          <div className="h-2 w-20 bg-foreground/20 rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Separator Style
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { value: "pipe", label: "|" },
                        { value: "dash", label: "-" },
                        { value: "comma", label: "," },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          updateSetting("contactSeparator", option.value)
                        }
                        className={`h-8 rounded-md border text-xs font-medium transition-all ${
                          (layoutSettings.contactSeparator || "pipe") ===
                          option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "left", label: "Left" },
                      { value: "center", label: "Center" },
                      { value: "right", label: "Right" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting("personalDetailsAlign", option.value)
                      }
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all hover:bg-accent/50 ${
                        (layoutSettings.personalDetailsAlign || "center") ===
                        option.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-transparent hover:border-primary/30"
                      }`}
                    >
                      <div className="h-6 w-full flex items-center justify-center opacity-70">
                        {option.value === "left" && (
                          <AlignLeft className="h-4 w-4" />
                        )}
                        {option.value === "center" && (
                          <div className="h-4 w-4 flex flex-col items-center justify-center">
                            <div className="w-full h-0.5 bg-current mb-0.5" />
                          </div>
                        )}
                        {option.value === "right" && (
                          <AlignRight className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile Picture
                </Label>
                <Switch
                  checked={layoutSettings.showProfileImage ?? true}
                  onCheckedChange={(val) =>
                    updateSetting("showProfileImage", val)
                  }
                />
              </div>

              {(layoutSettings.showProfileImage ?? true) && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Size & Shape
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex rounded-md border p-1 bg-muted/20">
                        {(["S", "M", "L"] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              updateSetting("profileImageSize", size)
                            }
                            className={`flex-1 rounded-sm text-xs font-medium py-1 transition-all ${
                              (layoutSettings.profileImageSize || "M") === size
                                ? "bg-white text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <div className="flex rounded-md border p-1 bg-muted/20">
                        {[
                          { value: "circle", label: "Cir" },
                          { value: "square", label: "Sqr" },
                        ].map((shape) => (
                          <button
                            key={shape.value}
                            onClick={() =>
                              updateSetting("profileImageShape", shape.value)
                            }
                            className={`flex-1 rounded-sm text-xs font-medium py-1 transition-all ${
                              (layoutSettings.profileImageShape || "circle") ===
                              shape.value
                                ? "bg-white text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {shape.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Add Border
                    </Label>
                    <Switch
                      checked={layoutSettings.profileImageBorder || false}
                      onCheckedChange={(val) =>
                        updateSetting("profileImageBorder", val)
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "body", label: "Standard Font" },
                  { value: "creative", label: "Creative Font" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting("nameFont", option.value)}
                  className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    (layoutSettings.nameFont || "body") === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Theme Color */}
        <SettingsSection
          title="Accent Color"
          icon={Palette}
          isOpen={openSections.themeColor}
          onToggle={() => toggleSection("themeColor")}
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    updateCurrentResume({
                      meta: {
                        ...currentResume.meta,
                        themeColor: color.value,
                      },
                    })
                  }
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    currentResume.meta.themeColor === color.value
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105 border-border"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {currentResume.meta.themeColor === color.value && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                  )}
                </button>
              ))}
              <div className="col-span-1 relative flex items-center justify-center">
                <input
                  type="color"
                  value={currentResume.meta.themeColor || "#000000"}
                  onChange={(e) =>
                    updateCurrentResume({
                      meta: {
                        ...currentResume.meta,
                        themeColor: e.target.value,
                      },
                    })
                  }
                  className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute top-0 left-0 z-10"
                />
              </div>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg border space-y-3">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Apply Color To
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "name", label: "Name" },
                  { id: "title", label: "Prof. Title" },
                  { id: "headings", label: "Headings" },
                  { id: "links", label: "Links" },
                  { id: "decorations", label: "Decorations" },
                ].map((item) => {
                  const targets = layoutSettings.themeColorTarget || [
                    "headings",
                    "links",
                    "icons",
                    "decorations",
                  ];
                  const isChecked = targets.includes(item.id);

                  return (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`target-${item.id}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const newTargets = e.target.checked
                            ? [...targets, item.id]
                            : targets.filter((t) => t !== item.id);
                          updateSetting("themeColorTarget", newTargets);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`target-${item.id}`}
                        className="text-xs text-foreground cursor-pointer select-none"
                      >
                        {item.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Spacing */}
        <SettingsSection
          title="Typography & Spacing"
          icon={LayoutList}
          isOpen={openSections.spacing}
          onToggle={() => toggleSection("spacing")}
        >
          <SpacingControl
            label="Body Font Size"
            value={layoutSettings.fontSize}
            unit="pt"
            min={7}
            max={12}
            step={0.5}
            decimals={1}
            onChange={(val) => updateSetting("fontSize", val)}
          />
          <SpacingControl
            label="Body Line Height"
            value={layoutSettings.lineHeight}
            min={1.0}
            max={2.0}
            step={0.05}
            decimals={2}
            onChange={(val) => updateSetting("lineHeight", val)}
          />

          <Separator className="my-2" />

          <SpacingControl
            label="Left/Right Margins"
            value={layoutSettings.marginHorizontal || 15}
            unit="mm"
            min={5}
            max={30}
            step={1}
            onChange={(val) => updateSetting("marginHorizontal", val)}
          />
          <SpacingControl
            label="Top/Bottom Margins"
            value={layoutSettings.marginVertical || 15}
            unit="mm"
            min={5}
            max={30}
            step={1}
            onChange={(val) => updateSetting("marginVertical", val)}
          />

          <Separator className="my-2" />

          <SpacingControl
            label="Section Spacing"
            value={layoutSettings.sectionMargin}
            unit="px"
            min={4}
            max={32}
            step={2}
            onChange={(val) => updateSetting("sectionMargin", val)}
          />

          {/* <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Content Bullets</Label>
            </div>
            <Button
              variant={layoutSettings.useBullets ? "default" : "outline"}
              size="sm"
              className={
                layoutSettings.useBullets ? "h-7" : "h-7 text-muted-foreground"
              }
              onClick={() =>
                updateSetting("useBullets", !layoutSettings.useBullets)
              }
            >
              {layoutSettings.useBullets ? "Visible" : "Hidden"}
            </Button>
          </div> */}
        </SettingsSection>

        {/* Section Headings */}
        <SettingsSection
          title="Section Headings"
          icon={Heading}
          isOpen={openSections.sectionHeadings}
          onToggle={() => toggleSection("sectionHeadings")}
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
                  onClick={() =>
                    updateSetting(
                      "sectionHeadingStyle",
                      style as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
                    )
                  }
                  className={`relative flex items-center justify-center h-10 rounded-md border-2 transition-all hover:bg-muted/50 ${
                    (layoutSettings.sectionHeadingStyle || 4) === style
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
                      updateSetting(
                        "sectionHeadingCapitalization",
                        option.value as "capitalize" | "uppercase",
                      )
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
        </SettingsSection>

        {/* Skills */}
        <SettingsSection
          title="Skills Style"
          icon={Wrench}
          isOpen={openSections.skills}
          onToggle={() => toggleSection("skills")}
        >
          <div className="space-y-4">
            {/* <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Format
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["grid", "level", "compact", "bubble"] as const).map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting("skillsDisplayStyle", style)}
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all capitalize ${
                        (layoutSettings.skillsDisplayStyle || "grid") === style
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style}
                    </button>
                  ),
                )}
              </div>
            </div> */}

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { value: "blank", label: "Blank" },
                    { value: "bullet", label: "•" },
                    { value: "dash", label: "-" },
                    { value: "inline", label: "Inline" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("skillsListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.skillsListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Level Indicator
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 3, 4].map((levelStyle) => (
                  <button
                    key={levelStyle}
                    onClick={() =>
                      updateSetting(
                        "skillsLevelStyle",
                        levelStyle as 0 | 1 | 3 | 4,
                      )
                    }
                    className={`flex items-center justify-center p-2 rounded-lg border transition-all hover:bg-muted/50 ${
                      (layoutSettings.skillsLevelStyle || 0) === levelStyle
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-transparent hover:border-primary/30"
                    }`}
                  >
                    {levelStyle === 0 && <span className="text-xs">None</span>}
                    {levelStyle > 0 && (
                      <div className="flex gap-0.5 items-end h-3">
                        {[1, 2, 3, 4]
                          .slice(0, levelStyle === 4 ? 1 : levelStyle + 1)
                          .map((i) =>
                            levelStyle === 4 ? (
                              <span key={i} className="text-xs leading-none">
                                Text
                              </span>
                            ) : (
                              <div
                                key={i}
                                className={`w-1 rounded-sm ${
                                  levelStyle === 1 || levelStyle === 3 // Dots or Signal (active color)
                                    ? "bg-primary"
                                    : "bg-current opacity-40"
                                }`}
                                style={{
                                  height:
                                    levelStyle === 3 ? `${i * 2 + 3}px` : "4px", // Signal grows, Dots fixed
                                  width: levelStyle === 1 ? "4px" : "4px",
                                  borderRadius:
                                    levelStyle === 1 ? "50%" : "1px",
                                }}
                              />
                            ),
                          )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Professional Experience */}
        <SettingsSection
          title="Professional Experience"
          icon={Briefcase}
          isOpen={openSections.work || false}
          onToggle={() => toggleSection("work")}
        >
          <div className="space-y-6">
            {/* Company Name */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Company Name
              </Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "bullet", label: "Bullet" },
                      { value: "number", label: "Number" },
                      { value: "none", label: "None" },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.value}
                      onClick={() =>
                        updateSetting("experienceCompanyListStyle", style.value)
                      }
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                        (layoutSettings.experienceCompanyListStyle ||
                          "none") === style.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateSetting(
                        "experienceCompanyBold",
                        !layoutSettings.experienceCompanyBold,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.experienceCompanyBold
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() =>
                      updateSetting(
                        "experienceCompanyItalic",
                        !layoutSettings.experienceCompanyItalic,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.experienceCompanyItalic
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Italic
                  </button>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Position
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "experiencePositionBold",
                      !layoutSettings.experiencePositionBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experiencePositionBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "experiencePositionItalic",
                      !layoutSettings.experiencePositionItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experiencePositionItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Website Link */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Company Website
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "experienceWebsiteBold",
                      !layoutSettings.experienceWebsiteBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experienceWebsiteBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "experienceWebsiteItalic",
                      !layoutSettings.experienceWebsiteItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experienceWebsiteItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Start & End Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "experienceDateBold",
                      !layoutSettings.experienceDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experienceDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "experienceDateItalic",
                      !layoutSettings.experienceDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.experienceDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Key Achievements
              </Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "bullet", label: "Bullet" },
                      { value: "number", label: "Number" },
                      { value: "none", label: "None" },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.value}
                      onClick={() =>
                        updateSetting(
                          "experienceAchievementsListStyle",
                          style.value,
                        )
                      }
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                        (layoutSettings.experienceAchievementsListStyle ||
                          "bullet") === style.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateSetting(
                        "experienceAchievementsBold",
                        !layoutSettings.experienceAchievementsBold,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.experienceAchievementsBold
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() =>
                      updateSetting(
                        "experienceAchievementsItalic",
                        !layoutSettings.experienceAchievementsItalic,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.experienceAchievementsItalic
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Italic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Education Style */}
        <SettingsSection
          title="Education Style"
          icon={GraduationCap}
          isOpen={openSections.education || false}
          onToggle={() => toggleSection("education")}
        >
          <div className="space-y-6">
            {/* Institution Name */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Institution Name
              </Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "bullet", label: "Bullet" },
                      { value: "number", label: "Number" },
                      { value: "none", label: "None" },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.value}
                      onClick={() =>
                        updateSetting(
                          "educationInstitutionListStyle",
                          style.value,
                        )
                      }
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                        (layoutSettings.educationInstitutionListStyle ||
                          "none") === style.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateSetting(
                        "educationInstitutionBold",
                        !layoutSettings.educationInstitutionBold,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.educationInstitutionBold
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() =>
                      updateSetting(
                        "educationInstitutionItalic",
                        !layoutSettings.educationInstitutionItalic,
                      )
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      layoutSettings.educationInstitutionItalic
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    Italic
                  </button>
                </div>
              </div>
            </div>

            {/* Degree Type */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Degree Type
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "educationDegreeBold",
                      !layoutSettings.educationDegreeBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationDegreeBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "educationDegreeItalic",
                      !layoutSettings.educationDegreeItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationDegreeItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Field of Study */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Field of Study
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "educationAreaBold",
                      !layoutSettings.educationAreaBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationAreaBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "educationAreaItalic",
                      !layoutSettings.educationAreaItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationAreaItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Start & End Date */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Start & End Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "educationDateBold",
                      !layoutSettings.educationDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "educationDateItalic",
                      !layoutSettings.educationDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* GPA */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                GPA / Score
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "educationGpaBold",
                      !layoutSettings.educationGpaBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationGpaBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "educationGpaItalic",
                      !layoutSettings.educationGpaItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationGpaItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            {/* Courses */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Courses
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "educationCoursesBold",
                      !layoutSettings.educationCoursesBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationCoursesBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "educationCoursesItalic",
                      !layoutSettings.educationCoursesItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.educationCoursesItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Languages */}
        <SettingsSection
          title="Languages Style"
          icon={Languages}
          isOpen={openSections.languages}
          onToggle={() => toggleSection("languages")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("languagesListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.languagesListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Language Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "languagesNameBold",
                      !layoutSettings.languagesNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.languagesNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "languagesNameItalic",
                      !layoutSettings.languagesNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.languagesNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fluency
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "languagesFluencyBold",
                      !layoutSettings.languagesFluencyBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.languagesFluencyBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "languagesFluencyItalic",
                      !layoutSettings.languagesFluencyItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.languagesFluencyItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Interests */}
        <SettingsSection
          title="Interests Style"
          icon={Palette}
          isOpen={openSections.interests}
          onToggle={() => toggleSection("interests")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("interestsListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.interestsListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Interest Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "interestsNameBold",
                      !layoutSettings.interestsNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.interestsNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "interestsNameItalic",
                      !layoutSettings.interestsNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.interestsNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Keywords
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "interestsKeywordsBold",
                      !layoutSettings.interestsKeywordsBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.interestsKeywordsBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "interestsKeywordsItalic",
                      !layoutSettings.interestsKeywordsItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.interestsKeywordsItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Publications */}
        <SettingsSection
          title="Publications Style"
          icon={BookOpen}
          isOpen={openSections.publications}
          onToggle={() => toggleSection("publications")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("publicationsListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.publicationsListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Publication Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsNameBold",
                      !layoutSettings.publicationsNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsNameItalic",
                      !layoutSettings.publicationsNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Publisher
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsPublisherBold",
                      !layoutSettings.publicationsPublisherBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsPublisherBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsPublisherItalic",
                      !layoutSettings.publicationsPublisherItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsPublisherItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                URL
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsUrlBold",
                      !layoutSettings.publicationsUrlBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsUrlBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsUrlItalic",
                      !layoutSettings.publicationsUrlItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsUrlItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Release Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsDateBold",
                      !layoutSettings.publicationsDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "publicationsDateItalic",
                      !layoutSettings.publicationsDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.publicationsDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Awards */}
        <SettingsSection
          title="Awards Style"
          icon={Award}
          isOpen={openSections.awards}
          onToggle={() => toggleSection("awards")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("awardsListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.awardsListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Award Title
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsTitleBold",
                      !layoutSettings.awardsTitleBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsTitleBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsTitleItalic",
                      !layoutSettings.awardsTitleItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsTitleItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Awarder
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsAwarderBold",
                      !layoutSettings.awardsAwarderBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsAwarderBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsAwarderItalic",
                      !layoutSettings.awardsAwarderItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsAwarderItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsDateBold",
                      !layoutSettings.awardsDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "awardsDateItalic",
                      !layoutSettings.awardsDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.awardsDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* References */}
        <SettingsSection
          title="References Style"
          icon={Users}
          isOpen={openSections.references}
          onToggle={() => toggleSection("references")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("referencesListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.referencesListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "referencesNameBold",
                      !layoutSettings.referencesNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.referencesNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "referencesNameItalic",
                      !layoutSettings.referencesNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.referencesNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Position
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "referencesPositionBold",
                      !layoutSettings.referencesPositionBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.referencesPositionBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "referencesPositionItalic",
                      !layoutSettings.referencesPositionItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.referencesPositionItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Custom Section */}
        <SettingsSection
          title="Custom Section Style"
          icon={Wrench}
          isOpen={openSections.custom}
          onToggle={() => toggleSection("custom")}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("customSectionListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.customSectionListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionNameBold",
                      !layoutSettings.customSectionNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionNameItalic",
                      !layoutSettings.customSectionNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Subtitle
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionDescriptionBold",
                      !layoutSettings.customSectionDescriptionBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionDescriptionBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionDescriptionItalic",
                      !layoutSettings.customSectionDescriptionItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionDescriptionItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionDateBold",
                      !layoutSettings.customSectionDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionDateItalic",
                      !layoutSettings.customSectionDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                URL
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionUrlBold",
                      !layoutSettings.customSectionUrlBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionUrlBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "customSectionUrlItalic",
                      !layoutSettings.customSectionUrlItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.customSectionUrlItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Certificates */}
        <SettingsSection
          title="Certificates Style"
          icon={Award}
          isOpen={openSections.certificates}
          onToggle={() => toggleSection("certificates")}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Format
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["grid", "compact", "bubble"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      updateSetting("certificatesDisplayStyle", style)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all capitalize ${
                      (layoutSettings.certificatesDisplayStyle || "grid") ===
                      style
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                List Style (Certificate Names)
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "bullet", label: "Bullet" },
                    { value: "number", label: "Number" },
                    { value: "none", label: "None" },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSetting("certificatesListStyle", style.value)
                    }
                    className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                      (layoutSettings.certificatesListStyle || "bullet") ===
                      style.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Certificate Name
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesNameBold",
                      !layoutSettings.certificatesNameBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesNameBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesNameItalic",
                      !layoutSettings.certificatesNameItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesNameItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Issuer
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesIssuerBold",
                      !layoutSettings.certificatesIssuerBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesIssuerBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesIssuerItalic",
                      !layoutSettings.certificatesIssuerItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesIssuerItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesDateBold",
                      !layoutSettings.certificatesDateBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesDateBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesDateItalic",
                      !layoutSettings.certificatesDateItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesDateItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                URL
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesUrlBold",
                      !layoutSettings.certificatesUrlBold,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesUrlBold
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() =>
                    updateSetting(
                      "certificatesUrlItalic",
                      !layoutSettings.certificatesUrlItalic,
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                    layoutSettings.certificatesUrlItalic
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Entry Layout */}
        <SettingsSection
          title="Entry Layouts"
          icon={AlignLeft}
          isOpen={openSections.entryLayout}
          onToggle={() => toggleSection("entryLayout")}
        >
          {/* Entry Style */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Layout Variation
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[1, 2, 3, 4, 5].map((style) => (
                <button
                  key={style}
                  onClick={() =>
                    updateSetting(
                      "entryLayoutStyle",
                      style as 1 | 2 | 3 | 4 | 5,
                    )
                  }
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                    (layoutSettings.entryLayoutStyle || 1) === style
                      ? "border-primary bg-accent"
                      : "border-transparent bg-muted/20 hover:border-border"
                  }`}
                >
                  {/* Style 1: Title left, dates right */}
                  {style === 1 && (
                    <div className="flex items-center justify-between w-full gap-2 opacity-80">
                      <span className="text-xs font-semibold">Standard</span>
                      <div className="h-1.5 w-1/3 bg-foreground/20 rounded-sm" />
                    </div>
                  )}
                  {/* Style 2: Dates left, content right */}
                  {style === 2 && (
                    <div className="flex items-center gap-3 w-full opacity-80">
                      <div className="h-1.5 w-1/4 bg-foreground/20 rounded-sm" />
                      <div className="h-px bg-border flex-1 mx-2" />
                      <span className="text-xs font-semibold">
                        Sidebar Date
                      </span>
                    </div>
                  )}

                  {/* Style 3... etc placeholders */}
                  {style > 2 && (
                    <span className="text-xs font-medium pl-1">
                      Variation {style}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Subtitle Style</Label>
              <select
                className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
                value={layoutSettings.entrySubtitleStyle || "italic"}
                onChange={(e) =>
                  updateSetting("entrySubtitleStyle", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Placement</Label>
              <select
                className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
                value={layoutSettings.entrySubtitlePlacement || "nextLine"}
                onChange={(e) =>
                  updateSetting("entrySubtitlePlacement", e.target.value)
                }
              >
                <option value="nextLine">Next Line</option>
                <option value="sameLine">Same Line</option>
              </select>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
