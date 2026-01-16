"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Trash2, X } from "lucide-react";
import type { Interest } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";

interface InterestsFormProps {
  data: Interest[];
  onChange: (data: Interest[]) => void;
}

export function InterestsForm({ data, onChange }: InterestsFormProps) {
  const [newKeyword, setNewKeyword] = useState<{ [key: string]: string }>({});

  const addInterest = () => {
    const newInterest: Interest = {
      id: uuidv4(),
      name: "",
      keywords: [],
    };
    onChange([...data, newInterest]);
  };

  const removeInterest = (id: string) => {
    if (confirm("Are you sure you want to remove this interest category?")) {
      onChange(data.filter((item) => item.id !== id));
    }
  };

  const updateInterest = (id: string, name: string) => {
    onChange(data.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const addKeyword = (id: string) => {
    const keyword = newKeyword[id]?.trim();
    if (!keyword) return;

    onChange(
      data.map((item) =>
        item.id === id
          ? { ...item, keywords: [...item.keywords, keyword] }
          : item
      )
    );
    setNewKeyword({ ...newKeyword, [id]: "" });
  };

  const removeKeyword = (id: string, index: number) => {
    onChange(
      data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            keywords: item.keywords.filter((_, i) => i !== index),
          };
        }
        return item;
      })
    );
  };

  const handleKeywordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Interests
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={addInterest}>
          <Plus className="h-4 w-4 mr-2" />
          Add Interest
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
          No interests added yet.
        </div>
      )}

      {data.map((item) => (
        <CollapsibleSection
          key={item.id}
          title={item.name || "New Interest"}
          defaultOpen={true}
          actions={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeInterest(item.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Interest Name</Label>
              <Input
                placeholder="e.g. Photography, Hiking"
                value={item.name}
                onChange={(e) => updateInterest(item.id, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex flex-wrap gap-2 min-h-8">
                {item.keywords.map((keyword, kIndex) => (
                  <span
                    key={kIndex}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(item.id, kIndex)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword..."
                  value={newKeyword[item.id] || ""}
                  onChange={(e) =>
                    setNewKeyword({
                      ...newKeyword,
                      [item.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => handleKeywordKeyDown(e, item.id)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addKeyword(item.id)}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
}
