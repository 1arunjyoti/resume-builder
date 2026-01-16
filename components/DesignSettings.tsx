"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Minus,
  Plus,
  RotateCcw,
  Check,
  LayoutList,
  List,
  Palette,
  AppWindow,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Heading,
  AlignLeft,
  User,
  ChevronDown,
  Wrench,
  Languages,
  Heart,
  Award,
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
              Math.max(min, parseFloat((value - step).toFixed(decimals || 2)))
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
              Math.min(max, parseFloat((value + step).toFixed(decimals || 2)))
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
    (state) => state.updateCurrentResume
  );

  // Collapsible state
  const [openSections, setOpenSections] = useState({
    layout: true,
    spacing: false,
    entryLayout: false,
    personalDetails: false,
    sectionHeadings: false,
    skills: false,
    languages: false,
    interests: false,
    certificates: false,
    themeColor: true,
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
    })
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
    nameBold: true,
    nameFont: "body",
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
    value: number | boolean | string | string[]
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
        newIndex
      );
      updateSetting("sectionOrder", newOrder);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Reset all design settings to default values?")) {
        updateCurrentResume({
          meta: {
            ...currentResume.meta,
            layoutSettings: {
              fontSize: 8.5,
              lineHeight: 1.2,
              sectionMargin: 8,
              bulletMargin: 2,
              useBullets: true,
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
              nameBold: true,
              nameFont: "body",
              skillsDisplayStyle: "grid",
              skillsLevelStyle: 3,
              languagesDisplayStyle: "level",
              languagesLevelStyle: "dots",
              interestsDisplayStyle: "compact",
              interestsSeparator: "pipe",
              interestsSubinfoStyle: "dash",
              certificatesDisplayStyle: "grid",
              certificatesLevelStyle: 3,
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
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
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
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Header Position */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Header Position
                </Label>
                <div className="flex gap-2">
                  {[
                    { value: "top", label: "Top" },
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "headerPosition",
                          option.value as "top" | "left" | "right"
                        )
                      }
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all hover:bg-accent flex-1 ${
                        (layoutSettings.headerPosition || "top") ===
                        option.value
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
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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
                            const section = SECTIONS.find(
                              (s) => s.id === sectionId
                            );
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

        {/* Theme Color */}
        <SettingsSection
          title="Accent Color"
          icon={Palette}
          isOpen={openSections.themeColor}
          onToggle={() => toggleSection("themeColor")}
        >
              <div className="flex flex-wrap gap-3">
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
                    className={`group relative h-9 w-9 rounded-full border shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      currentResume.meta.themeColor === color.value
                        ? "border-foreground/50 scale-110 ring-2 ring-offset-1 ring-border"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {currentResume.meta.themeColor === color.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                        <Check className="h-4 w-4 stroke-3" />
                      </span>
                    )}
                  </button>
                ))}
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
                label="Font Size"
                value={layoutSettings.fontSize}
                unit="pt"
                min={7}
                max={12}
                step={0.5}
                decimals={1}
                onChange={(val) => updateSetting("fontSize", val)}
              />
              <SpacingControl
                label="Line Height"
                value={layoutSettings.lineHeight}
                min={1.0}
                max={2.0}
                step={0.05}
                decimals={2}
                onChange={(val) => updateSetting("lineHeight", val)}
              />

              <Separator className="my-2" />
              
              <SpacingControl
                label="Side Margins"
                value={layoutSettings.marginHorizontal || 15}
                unit="mm"
                min={5}
                max={30}
                step={1}
                onChange={(val) => updateSetting("marginHorizontal", val)}
              />
              <SpacingControl
                label="Vertical Margins"
                value={layoutSettings.marginVertical || 15}
                unit="mm"
                min={5}
                max={30}
                step={1}
                onChange={(val) => updateSetting("marginVertical", val)}
              />

              <Separator className="my-2" />

              <SpacingControl
                label="App Spacing"
                value={layoutSettings.sectionMargin}
                unit="px"
                min={4}
                max={32}
                step={2}
                onChange={(val) => updateSetting("sectionMargin", val)}
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Content Bullets</Label>
                </div>
                <Button
                  variant={layoutSettings.useBullets ? "default" : "outline"}
                  size="sm"
                  className={
                    layoutSettings.useBullets
                      ? "h-7"
                      : "h-7 text-muted-foreground"
                  }
                  onClick={() =>
                    updateSetting("useBullets", !layoutSettings.useBullets)
                  }
                >
                  {layoutSettings.useBullets ? "Visible" : "Hidden"}
                </Button>
              </div>
        </SettingsSection>

        {/* Identity & Personal Details */}
        <SettingsSection
          title="Personal Details"
          icon={User}
          isOpen={openSections.personalDetails}
          onToggle={() => toggleSection("personalDetails")}
        >
              {/* Name Section */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Name Formatting
                  </Label>
                  <div className="flex gap-2">
                    {(["XS", "S", "M", "L", "XL"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting("nameSize", size)}
                        className={`h-8 w-8 flex items-center justify-center rounded-md border text-xs font-medium transition-all ${
                          (layoutSettings.nameSize || "M") === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                    <div className="w-px bg-border mx-1" />
                    <button
                        onClick={() =>
                          updateSetting("nameBold", !layoutSettings.nameBold)
                        }
                        className={`px-3 h-8 rounded-md border flex items-center justify-center transition-all text-xs font-medium ${
                            layoutSettings.nameBold
                              ? "bg-accent border-accent-foreground/20 text-accent-foreground font-bold"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                    >
                        B
                    </button>
                  </div>
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

              <Separator />

              {/* Contact Align */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Alignment
                </Label>
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
                        {option.value === "left" && <AlignLeft className="h-4 w-4" />}
                        {option.value === "center" && <div className="h-4 w-4 flex flex-col items-center justify-center"><div className="w-full h-0.5 bg-current mb-0.5"/></div>}
                        {option.value === "right" && <div className="h-4 w-4 flex flex-col items-end justify-center"><div className="w-full h-0.5 bg-current mb-0.5"/></div>}
                      </div>
                      <span className="text-[10px] font-medium uppercase">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Arrangement */}
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
                          arrangement as 1 | 2
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
                
                <div className="grid grid-cols-3 gap-2">
                  {(["icon", "bullet", "bar"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() =>
                        updateSetting("personalDetailsContactStyle", style)
                      }
                      className={`py-1.5 px-2 rounded-md border text-xs font-medium transition-all ${
                        (layoutSettings.personalDetailsContactStyle ||
                          "icon") === style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
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
                          style as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
                        )
                      }
                      className={`relative flex items-center justify-center h-10 rounded-md border-2 transition-all hover:bg-muted/50 ${
                        (layoutSettings.sectionHeadingStyle || 4) === style
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-muted/40 hover:border-border"
                      }`}
                    >
                     <span className="text-xs font-bold text-muted-foreground">{style}</span>
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
                              option.value as "capitalize" | "uppercase"
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
                        onChange={(e) => updateSetting("sectionHeadingSize", e.target.value)}
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
            <div className="space-y-3">
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
                  )
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Level Indicator
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((levelStyle) => (
                  <button
                    key={levelStyle}
                    onClick={() =>
                      updateSetting(
                        "skillsLevelStyle",
                        levelStyle as 1 | 2 | 3 | 4
                      )
                    }
                    className={`flex items-center justify-center p-2 rounded-lg border transition-all hover:bg-muted/50 ${
                      (layoutSettings.skillsLevelStyle || 3) === levelStyle
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-transparent hover:border-primary/30"
                    }`}
                  >
                    <div className="flex gap-0.5 items-end h-3">
                      {[1, 2, 3, 4].slice(0, levelStyle + 1).map((i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-sm ${
                            levelStyle === 3
                              ? "bg-primary"
                              : "bg-current opacity-40"
                          }`}
                          style={{ height: `${i * 2 + 3}px` }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Languages */}
        <SettingsSection
          title="Languages"
          icon={Languages}
          isOpen={openSections.languages}
          onToggle={() => toggleSection("languages")}
        >
          <div className="space-y-4">
             <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Display Format
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["grid", "level", "compact", "bubble"] as const).map(
                    (style) => (
                      <button
                        key={style}
                        onClick={() =>
                          updateSetting("languagesDisplayStyle", style)
                        }
                        className={`py-2 px-3 rounded-md border text-xs font-medium transition-all capitalize ${
                          (layoutSettings.languagesDisplayStyle || "level") ===
                          style
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {style}
                      </button>
                    )
                  )}
                </div>
             </div>

             <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Level Style
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["text", "dots", "bar"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting("languagesLevelStyle", style)}
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all capitalize ${
                        (layoutSettings.languagesLevelStyle || "dots") === style
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </SettingsSection>

        {/* Interests */}
        <SettingsSection
          title="Interests"
          icon={Heart}
          isOpen={openSections.interests}
          onToggle={() => toggleSection("interests")}
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
                        updateSetting("interestsDisplayStyle", style)
                      }
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-all capitalize ${
                        (layoutSettings.interestsDisplayStyle || "compact") ===
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
                   Separator 
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bullet", "pipe", "newLine", "comma"] as const).map(
                    (sep) => (
                      <button
                        key={sep}
                        onClick={() => updateSetting("interestsSeparator", sep)}
                        className={`py-2 px-3 rounded-md border text-xs font-medium transition-all ${
                          (layoutSettings.interestsSeparator || "pipe") === sep
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                         {sep === "bullet" && "• Bullet"}
                         {sep === "pipe" && "| Pipe"}
                         {sep === "newLine" && "New Line"}
                         {sep === "comma" && ", Comma"}
                      </button>
                    )
                  )}
                </div>
             </div>
          </div>
        </SettingsSection>
        
        {/* Certificates */}
        <SettingsSection
            title="Certificates"
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
                          style as 1 | 2 | 3 | 4 | 5
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
                            <span className="text-xs font-semibold">Sidebar Date</span>
                         </div>
                      )}
                      
                      {/* Style 3... etc placeholders */}
                      {style > 2 && <span className="text-xs font-medium pl-1">Variation {style}</span>}
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
                        onChange={(e) => updateSetting("entrySubtitleStyle", e.target.value)}
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
                        onChange={(e) => updateSetting("entrySubtitlePlacement", e.target.value)}
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
