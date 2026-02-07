"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import type { CustomSection } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLLMSettingsStore } from "@/store/useLLMSettingsStore";
import { ensureLLMProvider } from "@/lib/llm/ensure-provider";
import {
  buildSectionSummaryPrompt,
  buildRewritePrompt,
  buildGrammarPrompt,
} from "@/lib/llm/prompts";
import { processGrammarOutput } from "@/lib/llm/grammar";
import { redactContactInfo } from "@/lib/llm/redaction";

interface CustomFormProps {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
}

export function CustomForm({ data, onChange }: CustomFormProps) {
  const [activeTab, setActiveTab] = useState<string | null>(
    data.length > 0 ? data[0].id : null,
  );
  const providerId = useLLMSettingsStore((state) => state.providerId);
  const apiKeys = useLLMSettingsStore((state) => state.apiKeys);
  const consent = useLLMSettingsStore((state) => state.consent);
  const redaction = useLLMSettingsStore((state) => state.redaction);
  const tone = useLLMSettingsStore((state) => state.tone);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, string>>({});
  const [llmErrors, setLlmErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

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

  const buildInput = useCallback(
    (section: CustomSection, item: CustomSection["items"][number]) => {
      const peerContext = section.items
        .filter((entry) => entry.id !== item.id)
        .slice(0, 3)
        .map((entry) =>
          [
            entry.name ? `Title: ${entry.name}` : "",
            entry.description ? `Subtitle: ${entry.description}` : "",
            entry.summary ? `Summary: ${entry.summary}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
        )
        .filter(Boolean);

      const parts = [
        section.name ? `Section: ${section.name}` : "",
        item.name ? `Title: ${item.name}` : "",
        item.description ? `Subtitle: ${item.description}` : "",
        item.date ? `Date: ${item.date}` : "",
        item.summary ? `Current Summary: ${item.summary}` : "",
        peerContext.length ? `Other Items:\n${peerContext.join("\n")}` : "",
      ].filter(Boolean);
      const raw = parts.join("\n");
      return redaction.stripContactInfo ? redactContactInfo(raw) : raw;
    },
    [redaction.stripContactInfo],
  );

  const ensureProvider = useCallback((requiredConsent: "generation" | "rewriting" | null = "generation") => {
    return ensureLLMProvider({
      providerId,
      apiKeys,
      consent,
      requiredConsent,
    });
  }, [apiKeys, consent, providerId]);

  const handleGenerateSummary = useCallback(
    async (section: CustomSection, item: CustomSection["items"][number]) => {
      const result = ensureProvider("generation");
      setLlmErrors((prev) => ({ ...prev, [item.id]: "" }));
      setGeneratedSummaries((prev) => ({ ...prev, [item.id]: "" }));
      if ("error" in result) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: result.error }));
        return;
      }
      setIsGenerating((prev) => ({ ...prev, [item.id]: true }));
      try {
        const prompt = buildSectionSummaryPrompt(
          section.name || "custom item",
          buildInput(section, item),
        );
        const output = await result.provider.generateText(result.apiKey, {
          prompt,
          temperature: 0.5,
          maxTokens: 256,
        });
        setGeneratedSummaries((prev) => ({ ...prev, [item.id]: output }));
      } catch (err) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: (err as Error).message }));
      } finally {
        setIsGenerating((prev) => ({ ...prev, [item.id]: false }));
      }
    },
    [buildInput, ensureProvider],
  );

  const handleImproveSummary = useCallback(
    async (section: CustomSection, item: CustomSection["items"][number]) => {
      setLlmErrors((prev) => ({ ...prev, [item.id]: "" }));
      setGeneratedSummaries((prev) => ({ ...prev, [item.id]: "" }));
      if (!item.summary?.trim()) {
        setLlmErrors((prev) => ({
          ...prev,
          [item.id]: "Add a description before improving it.",
        }));
        return;
      }
      const result = ensureProvider("rewriting");
      if ("error" in result) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: result.error }));
        return;
      }
      setIsGenerating((prev) => ({ ...prev, [item.id]: true }));
      try {
        const raw = redaction.stripContactInfo
          ? redactContactInfo(item.summary)
          : item.summary;
        const prompt = buildRewritePrompt(section.name || "custom item", raw, tone, buildInput(section, item));
        const output = await result.provider.generateText(result.apiKey, {
          prompt,
          temperature: 0.4,
          maxTokens: 256,
        });
        setGeneratedSummaries((prev) => ({ ...prev, [item.id]: output }));
      } catch (err) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: (err as Error).message }));
      } finally {
        setIsGenerating((prev) => ({ ...prev, [item.id]: false }));
      }
    },
    [buildInput, ensureProvider, redaction.stripContactInfo, tone],
  );

  const handleGrammarSummary = useCallback(
    async (section: CustomSection, item: CustomSection["items"][number]) => {
      setLlmErrors((prev) => ({ ...prev, [item.id]: "" }));
      setGeneratedSummaries((prev) => ({ ...prev, [item.id]: "" }));
      if (!item.summary?.trim()) {
        setLlmErrors((prev) => ({
          ...prev,
          [item.id]: "Add a description before checking grammar.",
        }));
        return;
      }
      const result = ensureProvider("rewriting");
      if ("error" in result) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: result.error }));
        return;
      }
      setIsGenerating((prev) => ({ ...prev, [item.id]: true }));
      try {
        const raw = redaction.stripContactInfo
          ? redactContactInfo(item.summary)
          : item.summary;
        const prompt = buildGrammarPrompt(section.name || "custom item", raw);
        const output = await result.provider.generateText(result.apiKey, {
          prompt,
          temperature: 0.2,
          maxTokens: 256,
        });
        const grammarResult = processGrammarOutput(raw, output);
        if (grammarResult.error) {
          const errMsg = grammarResult.error;
          setLlmErrors((prev) => ({ ...prev, [item.id]: errMsg }));
          return;
        }
        if (grammarResult.noChanges) {
          setLlmErrors((prev) => ({ ...prev, [item.id]: "✓ No grammar issues found." }));
          return;
        }
        setGeneratedSummaries((prev) => ({
          ...prev,
          [item.id]: grammarResult.text || "",
        }));
      } catch (err) {
        setLlmErrors((prev) => ({ ...prev, [item.id]: (err as Error).message }));
      } finally {
        setIsGenerating((prev) => ({ ...prev, [item.id]: false }));
      }
    },
    [ensureProvider, redaction.stripContactInfo],
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
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`summary-${item.id}`}>
                              Description
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleGenerateSummary(sec, item)
                              }
                              disabled={isGenerating[item.id]}
                            >
                              {isGenerating[item.id] ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                              Generate
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleImproveSummary(sec, item)
                              }
                              disabled={isGenerating[item.id]}
                            >
                              Improve
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleGrammarSummary(sec, item)
                              }
                              disabled={isGenerating[item.id]}
                            >
                              Grammar
                            </Button>
                          </div>
                          <RichTextEditor
                            id={`summary-${item.id}`}
                            placeholder="Details about this item..."
                            minHeight="min-h-[60px]"
                            value={item.summary}
                            onChange={(value) =>
                              updateItem(sec.id, item.id, "summary", value)
                            }
                          />
                          {llmErrors[item.id] ? (
                            <p className="text-xs text-destructive">
                              {llmErrors[item.id]}
                            </p>
                          ) : null}
                          {generatedSummaries[item.id] ? (
                            <div className="rounded-md border bg-muted/30 p-3 space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Generated Description
                              </p>
                              <p className="text-sm whitespace-pre-wrap">
                                {generatedSummaries[item.id]}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    updateItem(
                                      sec.id,
                                      item.id,
                                      "summary",
                                      generatedSummaries[item.id],
                                    );
                                    setGeneratedSummaries((prev) => ({
                                      ...prev,
                                      [item.id]: "",
                                    }));
                                  }}
                                >
                                  Apply
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGenerateSummary(sec, item)}
                                  disabled={isGenerating[item.id]}
                                >
                                  Regenerate
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setGeneratedSummaries((prev) => ({
                                      ...prev,
                                      [item.id]: "",
                                    }))
                                  }
                                >
                                  Discard
                                </Button>
                              </div>
                            </div>
                          ) : null}
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
