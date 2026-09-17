"use client";

import React, { memo } from "react";
import { Sparkles, FileText, Trash2, ArrowRight, Loader2, BookOpen, Layers } from "lucide-react";
import { SAMPLE_CASES } from "@/constants/sampleCases";

interface NarrativeInputProps {
  narrative: string;
  setNarrative: (val: string) => void;
  caseCategory: string;
  setCaseCategory: (val: string) => void;
  jurisdiction: string;
  setJurisdiction: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const CATEGORIES = [
  "Auto-detect Category",
  "Real Estate & Property",
  "Breach of Contract",
  "Employment & Labor",
  "Consumer Protection",
  "Corporate & Partnership",
  "Civil Litigation",
  "Intellectual Property",
  "Criminal Defense",
];

export const NarrativeInput: React.FC<NarrativeInputProps> = memo(({
  narrative,
  setNarrative,
  caseCategory,
  setCaseCategory,
  jurisdiction,
  setJurisdiction,
  onSubmit,
  isLoading,
}) => {
  const wordCount = narrative.trim() ? narrative.trim().split(/\s+/).length : 0;
  const charCount = narrative.length;

  const loadSample = (sampleText: string, category: string) => {
    setNarrative(sampleText);
    setCaseCategory(category);
  };

  return (
    <section
      aria-label="Case Input Form"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      {/* Header & Sample Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span>Case Narrative & Facts</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Describe the dispute, timeline of events, agreements, and communications in your own words.
          </p>
        </div>

        {/* Quick Sample Loaders */}
        <div aria-label="Sample Case Loader Buttons" className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            Samples:
          </span>
          {SAMPLE_CASES.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => loadSample(sc.narrative, sc.category)}
              aria-label={`Load sample narrative for ${sc.title}`}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Bar (Category & Jurisdiction) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="case-category-select" className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            Legal Category Context (Optional)
          </label>
          <select
            id="case-category-select"
            value={caseCategory}
            onChange={(e) => setCaseCategory(e.target.value)}
            aria-label="Select legal category context"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jurisdiction-input" className="block text-xs font-bold text-slate-300 mb-1">
            Jurisdiction / Location (Optional)
          </label>
          <input
            id="jurisdiction-input"
            type="text"
            placeholder="e.g. India (RERA / High Court), California (USA), UK"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            aria-label="Enter jurisdiction or court location"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative mb-3">
        <label htmlFor="case-narrative-textarea" className="sr-only">
          Case Narrative Details
        </label>
        <textarea
          id="case-narrative-textarea"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          placeholder="Paste or type your narrative here... (Include dates, names, money involved, agreements, notice dates, WhatsApp/Email exchanges, and key actions taken)"
          rows={9}
          aria-label="Enter messy legal case narrative text"
          aria-describedby="narrative-counter"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-mono leading-relaxed"
        />

        {/* Counter & Clear Button with ARIA Live Region */}
        <div id="narrative-counter" aria-live="polite" className="flex items-center justify-between mt-1 px-1 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          {narrative && (
            <button
              type="button"
              onClick={() => setNarrative("")}
              aria-label="Clear typed case narrative"
              className="text-slate-300 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Clear Text
            </button>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !narrative.trim()}
          aria-label="Generate Legal Brief using Gemini AI"
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isLoading || !narrative.trim()
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
              : "bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-extrabold shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" aria-hidden="true" />
              <span>Analyzing Narrative with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" aria-hidden="true" />
              <span>Generate Legal Brief</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </section>
  );
});

NarrativeInput.displayName = "NarrativeInput";
