"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-transparent hover:border-border group"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={isFirst}
          onClick={onMoveUp}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={isLast}
          onClick={onMoveDown}
        >
          <ArrowDown className="h-3 w-3" />
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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{label}</Label>
        <span className="text-sm text-muted-foreground tabular-nums">
          {decimals > 0 ? value.toFixed(decimals) : value}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-input"
            onClick={() =>
              onChange(
                Math.max(
                  min,
                  parseFloat((value - step).toFixed(decimals || 2)),
                ),
              )
            }
            disabled={value <= min}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-input"
            onClick={() =>
              onChange(
                Math.min(
                  max,
                  parseFloat((value + step).toFixed(decimals || 2)),
                ),
              )
            }
            disabled={value >= max}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DesignSettings() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateCurrentResume = useResumeStore(
    (state) => state.updateCurrentResume,
  );

  // Collapsible state for all cards - default to open
  const [openSections, setOpenSections] = useState({
    layout: true,
    spacing: true,
    entryLayout: true,
    personalDetails: true,
    sectionHeadings: true,
    skills: true,
    languages: true,
    interests: true,
    certificates: true,
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
          nameFontSize: 0,
          nameLineHeight: 0,
          titleFontSize: 0,
          titleLineHeight: 0,
          titleBold: false,
          titleItalic: false,
          contactFontSize: 0,
          contactBold: false,
          contactItalic: false,
          contactSeparator: "pipe",
          showProfileImage: false,
          profileImageSize: "M",
          profileImageShape: "circle",
          profileImageBorder: false,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Design Settings</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          title="Reset all design settings to default"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Templates */}
      {/* <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Template</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() =>
                updateCurrentResume({
                  meta: { ...currentResume.meta, templateId: template.id },
                })
              }
              className={`relative flex flex-col items-start p-3 rounded-lg border-2 transition-all hover:bg-muted/50 text-left ${
                currentResume.meta.templateId === template.id
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/30 hover:border-border"
              }`}
            >
              <span className="font-medium text-sm">{template.name}</span>
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </span>
              {currentResume.meta.templateId === template.id && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </CardContent>
      </Card> */}

      {/* Layout */}
      <Collapsible
        open={openSections.layout}
        onOpenChange={() => toggleSection("layout")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AppWindow className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Layout</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.layout ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Columns */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Columns
                </Label>
                <div className="grid grid-cols-3 gap-3">
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
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                        (layoutSettings.columnCount || 1) === option.value
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      <div className="h-8 w-12 rounded bg-muted-foreground/20 flex items-center justify-center overflow-hidden">
                        {option.icon === "rows" && (
                          <div className="flex flex-col gap-1 w-8">
                            <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                            <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                            <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                          </div>
                        )}
                        {option.icon === "columns" && (
                          <div className="flex gap-1 w-8 h-5">
                            <div className="h-full w-1/2 bg-current opacity-40 rounded-sm" />
                            <div className="h-full w-1/2 bg-current opacity-40 rounded-sm" />
                          </div>
                        )}
                        {option.icon === "mix" && (
                          <div className="flex flex-col gap-1 w-8">
                            <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                            <div className="flex gap-1 h-3">
                              <div className="h-full w-1/3 bg-current opacity-40 rounded-sm" />
                              <div className="h-full w-2/3 bg-current opacity-40 rounded-sm" />
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
                <Label className="text-sm font-normal text-muted-foreground">
                  Header Position
                </Label>
                <div className="flex gap-3">
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
                          option.value as "top" | "left" | "right",
                        )
                      }
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all hover:bg-muted/50 w-20 ${
                        (layoutSettings.headerPosition || "top") ===
                        option.value
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      <div className="h-10 w-10 rounded bg-background border flex overflow-hidden">
                        {option.value === "top" && (
                          <div className="w-full h-full flex flex-col">
                            <div className="h-1/3 bg-current opacity-40 w-full" />
                            <div className="flex-1" />
                          </div>
                        )}
                        {option.value === "left" && (
                          <div className="w-full h-full flex">
                            <div className="w-1/3 bg-current opacity-40 h-full" />
                            <div className="flex-1" />
                          </div>
                        )}
                        {option.value === "right" && (
                          <div className="w-full h-full flex">
                            <div className="flex-1" />
                            <div className="w-1/3 bg-current opacity-40 h-full" />
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
                  <span className="text-muted-foreground">
                    Main Column Width
                  </span>
                  <span className="font-medium tabular-nums">
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
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Left Heavy</span>
                  <span>Right Heavy</span>
                </div>
              </div>

              <Separator />

              {/* Section Reordering */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Change Section Layout
                </Label>
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
                          (s) => s.id === sectionId,
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Identity & Personal Details */}
      <Collapsible
        open={openSections.personalDetails}
        onOpenChange={() => toggleSection("personalDetails")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Personal Details</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.personalDetails ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Name Section */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-normal text-muted-foreground">
                    Name Size
                  </Label>
                  <div className="flex gap-2">
                    {(["XS", "S", "M", "L", "XL"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting("nameSize", size)}
                        className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-all ${
                          (layoutSettings.nameSize || "M") === size
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background hover:bg-muted/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-normal">Bold Name</Label>
                  <button
                    onClick={() =>
                      updateSetting("nameBold", !layoutSettings.nameBold)
                    }
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                        layoutSettings.nameBold
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      {layoutSettings.nameBold && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-normal text-muted-foreground">
                    Name Font
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "body", label: "Body Font" },
                        { value: "creative", label: "Creative" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSetting("nameFont", option.value)}
                        className={`py-2 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                          (layoutSettings.nameFont || "body") === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Align */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Align Contact Info
                </Label>
                <div className="grid grid-cols-3 gap-3">
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
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                        (layoutSettings.personalDetailsAlign || "center") ===
                        option.value
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      <div className="h-10 w-full flex items-center justify-center">
                        {option.value === "left" && (
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex flex-col gap-0.5 flex-1">
                              <div className="h-1 w-full bg-current opacity-40 rounded-sm" />
                              <div className="h-0.5 w-2/3 bg-current opacity-30 rounded-sm" />
                            </div>
                            <div className="h-3 w-3 rounded-full bg-current opacity-30" />
                          </div>
                        )}
                        {option.value === "center" && (
                          <div className="flex flex-col items-center gap-1 w-full">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <div className="h-1 w-2/3 bg-current opacity-40 rounded-sm" />
                            <div className="h-0.5 w-1/2 bg-current opacity-30 rounded-sm" />
                          </div>
                        )}
                        {option.value === "right" && (
                          <div className="flex items-center gap-2 w-full">
                            <div className="h-3 w-3 rounded-full bg-current opacity-30" />
                            <div className="flex flex-col gap-0.5 flex-1 items-end">
                              <div className="h-1 w-full bg-current opacity-40 rounded-sm" />
                              <div className="h-0.5 w-2/3 bg-current opacity-30 rounded-sm" />
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

              {/* Arrangement */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Arrangement
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
                      className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                        (layoutSettings.personalDetailsArrangement || 1) ===
                        arrangement
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      {arrangement === 1 && (
                        <div className="flex flex-wrap gap-1.5 justify-center w-full">
                          <div className="h-2 w-6 bg-current opacity-40 rounded-sm" />
                          <div className="h-2 w-6 bg-current opacity-40 rounded-sm" />
                          <div className="h-2 w-6 bg-current opacity-40 rounded-sm" />
                        </div>
                      )}
                      {arrangement === 2 && (
                        <div className="flex flex-col gap-1 w-full items-start">
                          <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                          <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                          <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {/* Contact style sub-options */}
                <div className="grid grid-cols-3 gap-2">
                  {(["icon", "bullet", "bar"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() =>
                        updateSetting("personalDetailsContactStyle", style)
                      }
                      className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        (layoutSettings.personalDetailsContactStyle ||
                          "icon") === style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {style === "icon" && (
                        <>
                          <span className="text-[10px]">😊</span> Icon
                        </>
                      )}
                      {style === "bullet" && (
                        <>
                          <span>•</span> Bullet
                        </>
                      )}
                      {style === "bar" && (
                        <>
                          <span className="w-0.5 h-3 bg-current opacity-70" />{" "}
                          Bar
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Icon Style */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Icon Style
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((iconStyle) => (
                    <button
                      key={iconStyle}
                      onClick={() =>
                        updateSetting(
                          "personalDetailsIconStyle",
                          iconStyle as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
                        )
                      }
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        (layoutSettings.personalDetailsIconStyle || 1) ===
                        iconStyle
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted/30 hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="h-5 w-5 rounded-full border border-current opacity-50 flex items-center justify-center">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            iconStyle % 2 === 0 ? "bg-current opacity-30" : ""
                          } ${
                            iconStyle % 2 !== 0
                              ? "border border-current opacity-50"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section Headings */}
      <Collapsible
        open={openSections.sectionHeadings}
        onOpenChange={() => toggleSection("sectionHeadings")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Heading className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Section Headings</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.sectionHeadings ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Style */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Style
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
                      className={`relative flex flex-col items-center justify-center p-3 h-14 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                        (layoutSettings.sectionHeadingStyle || 4) === style
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      {/* Style 1: Simple lines */}
                      {style === 1 && (
                        <div className="flex flex-col gap-1.5 w-full">
                          <div className="h-1 w-full bg-current opacity-50 rounded-sm" />
                          <div className="h-0.5 w-2/3 bg-current opacity-30 rounded-sm" />
                        </div>
                      )}
                      {/* Style 2: Boxed */}
                      {style === 2 && (
                        <div className="flex items-center justify-center w-full h-6 border border-current opacity-50 rounded">
                          <div className="h-0.5 w-1/2 bg-current opacity-50 rounded-sm" />
                        </div>
                      )}
                      {/* Style 3: Simple with line */}
                      {style === 3 && (
                        <div className="flex flex-col gap-1 w-full items-center">
                          <div className="h-0.5 w-2/3 bg-current opacity-40 rounded-sm" />
                          <div className="h-px w-full bg-current opacity-20" />
                        </div>
                      )}
                      {/* Style 4: Underline accent (selected by default) */}
                      {style === 4 && (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="h-0.5 w-2/3 bg-current opacity-40 rounded-sm" />
                          <div className="h-1 w-1/3 bg-primary rounded-sm" />
                        </div>
                      )}
                      {/* Style 5: Left bar */}
                      {style === 5 && (
                        <div className="flex gap-2 w-full items-center">
                          <div className="h-4 w-1 bg-current opacity-50 rounded-sm" />
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-0.5 w-full bg-current opacity-40 rounded-sm" />
                            <div className="h-0.5 w-2/3 bg-current opacity-20 rounded-sm" />
                          </div>
                        </div>
                      )}
                      {/* Style 6: Centered short bar */}
                      {style === 6 && (
                        <div className="flex flex-col gap-1.5 w-full items-center">
                          <div className="h-0.5 w-1/3 bg-current opacity-50 rounded-sm" />
                        </div>
                      )}
                      {/* Style 7: Full width bar */}
                      {style === 7 && (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="h-0.5 w-full bg-current opacity-40 rounded-sm" />
                          <div className="h-0.5 w-1/2 bg-current opacity-20 rounded-sm" />
                        </div>
                      )}
                      {/* Style 8: Dotted underline */}
                      {style === 8 && (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="h-0.5 w-2/3 bg-current opacity-40 rounded-sm" />
                          <div className="h-px w-full border-b border-dashed border-current opacity-30" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Capitalization */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Capitalization
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "capitalize", label: "Capitalize" },
                    { value: "uppercase", label: "Uppercase" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "sectionHeadingCapitalization",
                          option.value as "capitalize" | "uppercase",
                        )
                      }
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        (layoutSettings.sectionHeadingCapitalization ||
                          "uppercase") === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Size */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Size
                </Label>
                <div className="flex gap-2">
                  {(["S", "M", "L", "XL"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting("sectionHeadingSize", size)}
                      className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-all ${
                        (layoutSettings.sectionHeadingSize || "M") === size
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Icons */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Icons
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["none", "outline", "filled"] as const).map((iconStyle) => (
                    <button
                      key={iconStyle}
                      onClick={() =>
                        updateSetting("sectionHeadingIcons", iconStyle)
                      }
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all capitalize ${
                        (layoutSettings.sectionHeadingIcons || "none") ===
                        iconStyle
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {iconStyle === "none"
                        ? "None"
                        : iconStyle === "outline"
                          ? "Outline"
                          : "Filled"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Spacing */}
      <Collapsible
        open={openSections.spacing}
        onOpenChange={() => toggleSection("spacing")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <LayoutList className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Spacing</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.spacing ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
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

              <Separator />

              <SpacingControl
                label="Line Height"
                value={layoutSettings.lineHeight}
                min={1.0}
                max={2.0}
                step={0.05}
                decimals={2}
                onChange={(val) => updateSetting("lineHeight", val)}
              />

              <Separator />

              <SpacingControl
                label="Left & Right Margin"
                value={layoutSettings.marginHorizontal || 15}
                unit="mm"
                min={5}
                max={30}
                step={1}
                onChange={(val) => updateSetting("marginHorizontal", val)}
              />

              <Separator />

              <SpacingControl
                label="Top & Bottom Margin"
                value={layoutSettings.marginVertical || 15}
                unit="mm"
                min={5}
                max={30}
                step={1}
                onChange={(val) => updateSetting("marginVertical", val)}
              />

              <Separator />

              <SpacingControl
                label="Space between Entries"
                value={layoutSettings.sectionMargin}
                unit="px"
                min={4}
                max={32}
                step={2}
                onChange={(val) => updateSetting("sectionMargin", val)}
              />

              <Separator />

              {/* Show Bullets Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-normal">Show Bullets</Label>
                </div>
                <Button
                  variant={layoutSettings.useBullets ? "default" : "outline"}
                  size="sm"
                  className={
                    layoutSettings.useBullets
                      ? "bg-primary"
                      : "text-muted-foreground"
                  }
                  onClick={() =>
                    updateSetting("useBullets", !layoutSettings.useBullets)
                  }
                >
                  {layoutSettings.useBullets ? "On" : "Off"}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Entry Layout */}
      <Collapsible
        open={openSections.entryLayout}
        onOpenChange={() => toggleSection("entryLayout")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Entry Layout</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.entryLayout ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Entry Style */}
              <div className="space-y-3">
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
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/30 hover:border-border"
                      }`}
                    >
                      {/* Style 1: Title left, dates right */}
                      {style === 1 && (
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-1.5 w-2/3 bg-current opacity-50 rounded-sm" />
                            <div className="h-1 w-1/2 bg-current opacity-30 rounded-sm" />
                          </div>
                          <div className="flex items-center gap-1.5 opacity-40">
                            <div className="h-3 w-3 border border-current rounded-sm flex items-center justify-center">
                              <div className="h-1.5 w-1.5 bg-current opacity-50" />
                            </div>
                            <div className="h-3 w-3 rounded-full border border-current flex items-center justify-center text-[6px]">
                              ●
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Style 2: Dates left, content right */}
                      {style === 2 && (
                        <div className="flex items-start gap-3 w-full">
                          <div className="flex items-center gap-1 opacity-40 shrink-0">
                            <div className="h-3 w-3 border border-current rounded-sm" />
                            <div className="h-3 w-3 rounded-full border border-current" />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-1.5 w-full bg-current opacity-50 rounded-sm" />
                            <div className="h-1 w-2/3 bg-current opacity-30 rounded-sm" />
                          </div>
                        </div>
                      )}
                      {/* Style 3: Stacked with date icons */}
                      {style === 3 && (
                        <div className="flex items-start gap-3 w-full">
                          <div className="flex items-center gap-1 opacity-40 shrink-0">
                            <div className="h-3 w-3 border border-current rounded-sm" />
                            <div className="h-3 w-3 rounded-full border border-current" />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-1 w-full bg-current opacity-40 rounded-sm" />
                            <div className="h-1 w-full bg-current opacity-40 rounded-sm" />
                            <div className="h-1 w-full bg-current opacity-40 rounded-sm" />
                          </div>
                        </div>
                      )}
                      {/* Style 4: Simple stacked */}
                      {style === 4 && (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="h-1.5 w-full bg-current opacity-40 rounded-sm" />
                          <div className="h-1 w-2/3 bg-current opacity-30 rounded-sm" />
                        </div>
                      )}
                      {/* Style 5: Full width bar */}
                      {style === 5 && (
                        <div className="w-full">
                          <div className="h-2 w-full bg-current opacity-30 rounded-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Column Width */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Column Width
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "auto", label: "Auto" },
                    { value: "manual", label: "Manual" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "entryColumnWidth",
                          option.value as "auto" | "manual",
                        )
                      }
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        (layoutSettings.entryColumnWidth || "auto") ===
                        option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Title & subtitle size */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Title & subtitle size
                </Label>
                <div className="flex gap-2">
                  {(["S", "M", "L"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting("entryTitleSize", size)}
                      className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-all ${
                        (layoutSettings.entryTitleSize || "M") === size
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Subtitle style */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Subtitle style
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["normal", "bold", "italic"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting("entrySubtitleStyle", style)}
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all capitalize ${
                        (layoutSettings.entrySubtitleStyle || "italic") ===
                        style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      } ${style === "italic" ? "italic" : ""} ${
                        style === "bold" ? "font-bold" : ""
                      }`}
                    >
                      {style === "normal"
                        ? "Normal"
                        : style === "bold"
                          ? "Bold"
                          : "Italic"}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Subtitle placement */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Subtitle placement
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "sameLine", label: "Try Same Line" },
                    { value: "nextLine", label: "Next Line" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "entrySubtitlePlacement",
                          option.value as "sameLine" | "nextLine",
                        )
                      }
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        (layoutSettings.entrySubtitlePlacement ||
                          "nextLine") === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Description indentation */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  Description indentation
                </Label>
                <button
                  onClick={() =>
                    updateSetting(
                      "entryIndentBody",
                      !layoutSettings.entryIndentBody,
                    )
                  }
                  className="flex items-center gap-3"
                >
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                      layoutSettings.entryIndentBody
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {layoutSettings.entryIndentBody && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-sm">Indent body</span>
                </button>
              </div>

              <Separator />

              {/* List style */}
              <div className="space-y-3">
                <Label className="text-sm font-normal text-muted-foreground">
                  List style
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "bullet", label: "• Bullet" },
                    { value: "hyphen", label: "– Hyphen" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "entryListStyle",
                          option.value as "bullet" | "hyphen",
                        )
                      }
                      className={`py-2.5 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        (layoutSettings.entryListStyle || "bullet") ===
                        option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Skills */}
      <Collapsible
        open={openSections.skills}
        onOpenChange={() => toggleSection("skills")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base">Skills</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.skills ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Display Style */}
              <div className="grid grid-cols-4 gap-2">
                {(["grid", "level", "compact", "bubble"] as const).map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting("skillsDisplayStyle", style)}
                      className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all capitalize ${
                        (layoutSettings.skillsDisplayStyle || "grid") === style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {style === "grid"
                        ? "Grid"
                        : style === "level"
                          ? "Level"
                          : style === "compact"
                            ? "Compact"
                            : "Bubble"}
                    </button>
                  ),
                )}
              </div>
              {/* Level Style */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((levelStyle) => (
                  <button
                    key={levelStyle}
                    onClick={() =>
                      updateSetting(
                        "skillsLevelStyle",
                        levelStyle as 1 | 2 | 3 | 4,
                      )
                    }
                    className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                      (layoutSettings.skillsLevelStyle || 3) === levelStyle
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/30 hover:border-border"
                    }`}
                  >
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3, 4].slice(0, levelStyle + 1).map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-sm ${
                            levelStyle === 3
                              ? "bg-primary"
                              : "bg-current opacity-40"
                          }`}
                          style={{ height: `${i * 3 + 4}px` }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Languages */}
      <Collapsible
        open={openSections.languages}
        onOpenChange={() => toggleSection("languages")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base">Languages</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.languages ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Display Style */}
              <div className="grid grid-cols-4 gap-2">
                {(["grid", "level", "compact", "bubble"] as const).map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() =>
                        updateSetting("languagesDisplayStyle", style)
                      }
                      className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all capitalize ${
                        (layoutSettings.languagesDisplayStyle || "level") ===
                        style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {style === "grid"
                        ? "Grid"
                        : style === "level"
                          ? "Level"
                          : style === "compact"
                            ? "Compact"
                            : "Bubble"}
                    </button>
                  ),
                )}
              </div>
              {/* Level Display Style */}
              <div className="grid grid-cols-3 gap-2">
                {(["text", "dots", "bar"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting("languagesLevelStyle", style)}
                    className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all capitalize ${
                      (layoutSettings.languagesLevelStyle || "dots") === style
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    {style === "text"
                      ? "Text"
                      : style === "dots"
                        ? "Dots"
                        : "Bar"}
                  </button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Interests */}
      <Collapsible
        open={openSections.interests}
        onOpenChange={() => toggleSection("interests")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base">Interests</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.interests ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Display Style */}
              <div className="grid grid-cols-3 gap-2">
                {(["grid", "compact", "bubble"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      updateSetting("interestsDisplayStyle", style)
                    }
                    className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all capitalize ${
                      (layoutSettings.interestsDisplayStyle || "compact") ===
                      style
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    {style === "grid"
                      ? "Grid"
                      : style === "compact"
                        ? "Compact"
                        : "Bubble"}
                  </button>
                ))}
              </div>
              {/* Separator */}
              <div className="grid grid-cols-4 gap-2">
                {(["bullet", "pipe", "newLine", "comma"] as const).map(
                  (sep) => (
                    <button
                      key={sep}
                      onClick={() => updateSetting("interestsSeparator", sep)}
                      className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all ${
                        (layoutSettings.interestsSeparator || "pipe") === sep
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {sep === "bullet"
                        ? "Bullet"
                        : sep === "pipe"
                          ? "Pipe"
                          : sep === "newLine"
                            ? "New Line"
                            : "Comma"}
                    </button>
                  ),
                )}
              </div>
              {/* Subinfo Style */}
              <div className="space-y-2">
                <Label className="text-sm font-normal text-muted-foreground italic">
                  Subinfo Style
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["dash", "colon", "bracket"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() =>
                        updateSetting("interestsSubinfoStyle", style)
                      }
                      className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all ${
                        (layoutSettings.interestsSubinfoStyle || "dash") ===
                        style
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      {style === "dash"
                        ? "– Dash"
                        : style === "colon"
                          ? ": Colon"
                          : "() Bracket"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Certificates */}
      <Collapsible
        open={openSections.certificates}
        onOpenChange={() => toggleSection("certificates")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base">Certificates</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.certificates ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Display Style */}
              <div className="grid grid-cols-3 gap-2">
                {(["grid", "compact", "bubble"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      updateSetting("certificatesDisplayStyle", style)
                    }
                    className={`py-2 px-3 rounded-full border-2 text-xs font-medium transition-all capitalize ${
                      (layoutSettings.certificatesDisplayStyle || "grid") ===
                      style
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    {style === "grid"
                      ? "Grid"
                      : style === "compact"
                        ? "Compact"
                        : "Bubble"}
                  </button>
                ))}
              </div>
              {/* Level Style */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((levelStyle) => (
                  <button
                    key={levelStyle}
                    onClick={() =>
                      updateSetting(
                        "certificatesLevelStyle",
                        levelStyle as 1 | 2 | 3 | 4,
                      )
                    }
                    className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                      (layoutSettings.certificatesLevelStyle || 3) ===
                      levelStyle
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/30 hover:border-border"
                    }`}
                  >
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3, 4].slice(0, levelStyle + 1).map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-sm ${
                            levelStyle === 3
                              ? "bg-primary"
                              : "bg-current opacity-40"
                          }`}
                          style={{ height: `${i * 3 + 4}px` }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Theme Color */}
      <Collapsible
        open={openSections.themeColor}
        onOpenChange={() => toggleSection("themeColor")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Theme Color</CardTitle>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    openSections.themeColor ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
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
                    className={`group relative h-10 w-10 rounded-full border-2 shadow-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      currentResume.meta.themeColor === color.value
                        ? "border-foreground/20 scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    media-label={color.name}
                  >
                    {currentResume.meta.themeColor === color.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                        <Check className="h-5 w-5 stroke-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
