"use client";
import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function TagInput({ value, onChange, placeholder = "Agregar tag...", suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && value.length > 0) removeTag(value.length - 1);
  }

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s.toLowerCase()));

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
        {value.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md text-xs font-medium">
            #{tag}
            <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500 transition">×</button>
          </span>
        ))}
        <input value={input} onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }} onKeyDown={handleKeyDown} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} placeholder={value.length === 0 ? placeholder : ""} className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filtered.slice(0, 8).map((s) => (
            <button key={s} type="button" onMouseDown={() => addTag(s)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
