import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SECTIONS } from "@/lib/constants";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AppWindow } from "lucide-react";
import React from "react";
import { SettingsSection } from "../SettingsSection";
import { SortableItem } from "../SortableItem";

import { LayoutSettings, LayoutSettingValue } from "../types";

interface PageLayoutSettingsProps {
  layoutSettings: LayoutSettings;
  updateSetting: (key: keyof LayoutSettings, value: LayoutSettingValue) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PageLayoutSettings({
  layoutSettings,
  updateSetting,
  isOpen,
  onToggle,
}: PageLayoutSettingsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Ensure sectionOrder includes all sections
  const getSectionOrder = React.useCallback(() => {
    const currentOrder = layoutSettings.sectionOrder || [];
    const allSectionIds = SECTIONS.map((s) => s.id);
    
    // Include existing order items that are valid
    const validOrder = currentOrder.filter((id) => 
      allSectionIds.includes(id)
    );
    
    // Add any missing sections at the end
    const missingIds = allSectionIds.filter((id) => 
      !validOrder.includes(id)
    );
    
    return [...validOrder, ...missingIds];
  }, [layoutSettings.sectionOrder]);

  const sectionOrder = getSectionOrder();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over?.id as string);

      const newOrder = arrayMove(
        sectionOrder,
        oldIndex,
        newIndex,
      ) as string[];
      updateSetting("sectionOrder", newOrder);
    }
  };

  return (
    <SettingsSection
      title="Page Layout"
      icon={AppWindow}
      isOpen={isOpen}
      onToggle={onToggle}
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
              onClick={() => updateSetting("columnCount", option.value)}
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
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sectionOrder.map(
                  (sectionId: string, index: number) => {
                    const section = SECTIONS.find((s) => s.id === sectionId);
                    if (!section) return null;
                    return (
                      <SortableItem
                        key={sectionId}
                        id={sectionId}
                        label={section.label}
                        isFirst={index === 0}
                        isLast={index === sectionOrder.length - 1}
                        onMoveUp={() => {
                          const newOrder = [...sectionOrder];
                          [newOrder[index - 1], newOrder[index]] = [
                            newOrder[index],
                            newOrder[index - 1],
                          ];
                          updateSetting("sectionOrder", newOrder);
                        }}
                        onMoveDown={() => {
                          const newOrder = [...sectionOrder];
                          [newOrder[index + 1], newOrder[index]] = [
                            newOrder[index],
                            newOrder[index + 1],
                          ];
                          updateSetting("sectionOrder", newOrder);
                        }}
                      />
                    );
                  },
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </SettingsSection>
  );
}
