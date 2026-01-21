"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Trash2 } from "lucide-react";
import type { CustomSection } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomFormProps {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
}

export function CustomForm({ data, onChange }: CustomFormProps) {
  const [activeTab, setActiveTab] = useState<string | null>(
    data.length > 0 ? data[0].id : null,
  );

  const addSection = useCallback(() => {
    const newSection: CustomSection = {
      id: uuidv4(),
      name: "New Section",
      items: [],
    };
    const newData = [...data, newSection];
    onChange(newData);
    setActiveTab(newSection.id);
  }, [data, onChange]);

  const removeSection = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to remove this entire section?")) {
        const newData = data.filter((sec) => sec.id !== id);
        onChange(newData);
        if (activeTab === id) {
          setActiveTab(newData.length > 0 ? newData[0].id : null);
        }
      }
    },
    [data, onChange, activeTab],
  );

  const updateSectionName = useCallback(
    (id: string, name: string) => {
      onChange(data.map((sec) => (sec.id === id ? { ...sec, name } : sec)));
    },
    [data, onChange],
  );

  const addItem = useCallback(
    (sectionId: string) => {
      onChange(
        data.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                items: [
                  ...sec.items,
                  {
                    id: uuidv4(),
                    name: "",
                    description: "",
                    date: "",
                    url: "",
                    summary: "",
                  },
                ],
              }
            : sec,
        ),
      );
    },
    [data, onChange],
  );

  const removeItem = useCallback(
    (sectionId: string, itemId: string) => {
      onChange(
        data.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                items: sec.items.filter((item) => item.id !== itemId),
              }
            : sec,
        ),
      );
    },
    [data, onChange],
  );

  const updateItem = useCallback(
    (sectionId: string, itemId: string, field: string, value: string) => {
      onChange(
        data.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                items: sec.items.map((item) =>
                  item.id === itemId ? { ...item, [field]: value } : item,
                ),
              }
            : sec,
        ),
      );
    },
    [data, onChange],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Custom Sections
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
          No custom sections added yet. Click &quot;Add Section&quot; to create
          one (e.g. Volunteering, Speaking, Organizations).
        </div>
      )}

      {data.length > 0 && (
        <Tabs
          value={activeTab || undefined}
          onValueChange={setActiveTab}
          className="flex flex-col md:flex-row gap-6 min-h-100"
        >
          <div className="w-full md:w-48 shrink-0 space-y-2">
            <TabsList className="flex-col w-full h-auto items-stretch bg-muted/50 p-1 space-y-1">
              {data.map((sec) => (
                <TabsTrigger
                  key={sec.id}
                  value={sec.id}
                  className="justify-between w-full"
                >
                  <span className="truncate">{sec.name || "Untitled"}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1">
            {data.map((sec) => (
              <TabsContent
                key={sec.id}
                value={sec.id}
                className="mt-0 space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    value={sec.name}
                    onChange={(e) => updateSectionName(sec.id, e.target.value)}
                    className="text-lg font-semibold h-10"
                    placeholder="Section Title (e.g. Volunteering)"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive shrink-0"
                    onClick={() => removeSection(sec.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Items
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(sec.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {sec.items.length === 0 && (
                    <div className="text-sm text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                      No items in this section yet.
                    </div>
                  )}
                  {sec.items.map((item, index) => (
                    <CollapsibleSection
                      key={item.id}
                      title={
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            #{index + 1}
                          </span>
                          {item.name || "New Item"}
                        </span>
                      }
                      defaultOpen={true}
                      actions={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(sec.id, item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${item.id}`}>
                              Item Name / Title
                            </Label>
                            <Input
                              id={`name-${item.id}`}
                              placeholder="e.g. Volunteer"
                              value={item.name}
                              onChange={(e) =>
                                updateItem(
                                  sec.id,
                                  item.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              autoComplete="off"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${item.id}`}>
                              Subtitle / Organization
                            </Label>
                            <Input
                              id={`description-${item.id}`}
                              placeholder="e.g. Red Cross"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(
                                  sec.id,
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`date-${item.id}`}>Date</Label>
                            <Input
                              id={`date-${item.id}`}
                              type="text"
                              placeholder="e.g. 2020 - Present"
                              value={item.date}
                              onChange={(e) =>
                                updateItem(
                                  sec.id,
                                  item.id,
                                  "date",
                                  e.target.value,
                                )
                              }
                              autoComplete="off"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`url-${item.id}`}>URL</Label>
                            <Input
                              id={`url-${item.id}`}
                              placeholder="https://..."
                              value={item.url}
                              onChange={(e) =>
                                updateItem(
                                  sec.id,
                                  item.id,
                                  "url",
                                  e.target.value,
                                )
                              }
                              autoComplete="url"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`summary-${item.id}`}>
                            Description
                          </Label>
                          <RichTextEditor
                            id={`summary-${item.id}`}
                            placeholder="Details about this item..."
                            minHeight="min-h-[60px]"
                            value={item.summary}
                            onChange={(value) =>
                              updateItem(sec.id, item.id, "summary", value)
                            }
                          />
                        </div>
                      </div>
                    </CollapsibleSection>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </div>
  );
}
