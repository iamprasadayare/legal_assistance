"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { NarrativeInput } from "@/components/NarrativeInput";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { LegalBriefData } from "@/types";
import { Scale, AlertCircle, RefreshCw, Zap } from "lucide-react";

// Dynamic imports with SSR loading skeletons for performance optimization
const LegalBriefOutput = dynamic(
  () => import("@/components/LegalBriefOutput").then((mod) => mod.LegalBriefOutput),
  {
    loading: () => (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center animate-pulse space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-slate-800/60 rounded w-2/3 mx-auto"></div>
        <div className="h-32 bg-slate-800/40 rounded-2xl w-full"></div>
      </div>
    ),
    ssr: false,
  }
);

const AudioPlayerControls = dynamic(
  () => import("@/components/AudioPlayerControls").then((mod) => mod.AudioPlayerControls),
  { ssr: false }
);

export default function Home() {
  const [narrative, setNarrative] = useState<string>("");
  const [caseCategory, setCaseCategory] = useState<string>("Auto-detect Category");
  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<LegalBriefData | null>(null);
  const [isCachedResult, setIsCachedResult] = useState<boolean>(false);

  // Custom Speech Synthesis hook for TTS
  const speech = useSpeechSynthesis();

  // Load last generated brief from sessionStorage on mount for instant restore
  useEffect(() => {
    try {
      const savedBrief = sessionStorage.getItem("aor_last_brief");
      const savedNarrative = sessionStorage.getItem("aor_last_narrative");
      if (savedBrief && savedNarrative) {
        setBrief(JSON.parse(savedBrief));
        setNarrative(savedNarrative);
        setIsCachedResult(true);
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
  }, []);

  const handleGenerateBrief = useCallback(async () => {
    if (!narrative.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsCachedResult(false);
    speech.stop();

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          narrative,
          caseCategory,
          jurisdiction,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate legal brief.");
      }

      setBrief(data.brief);
      setIsCachedResult(Boolean(data.cached));

      // Save to client sessionStorage cache
      try {
        sessionStorage.setItem("aor_last_brief", JSON.stringify(data.brief));
        sessionStorage.setItem("aor_last_narrative", narrative);
      } catch {
        // Storage quota exceeded
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Error generating legal brief:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [narrative, caseCategory, jurisdiction, speech]);

  // Prepares readable text representation for Speech Synthesis engine
  const briefTextForSpeech = useMemo((): string => {
    if (!brief) return "";
    let text = `Executive Brief Summary: ${brief.caseSummary}. Legal Category: ${brief.legalCategory}. `;

    text += "Chronological Timeline: ";
    brief.timeline.forEach((item, index) => {
      text += `Event ${index + 1}: ${item.date}, ${item.title}. Details: ${item.details}. `;
    });

    text += "Missing Critical Facts: ";
    brief.missingFacts.forEach((fact, index) => {
      text += `Question ${index + 1}: ${fact.question}. Rationale: ${fact.rationale}. `;
    });

    text += "Informational Next Steps: ";
    brief.nextSteps.forEach((step) => {
      text += `Step ${step.stepNumber}: ${step.action}. Urgency: ${step.urgency}. `;
    });

    return text;
  }, [brief]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Persistent Disclaimer Banner Top */}
      <DisclaimerBanner variant="top" />

      {/* Main Header */}
      <Header />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Advocate-on-Record Pre-Consultation Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transform Messy Legal Narratives into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
              Structured Case Briefs & Audio Summaries
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Input unorganized facts, timeline notes, or dispute details. Gemini AI extracts a chronological timeline, flags missing facts, and outlines actionable preparation steps before your lawyer consultation.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 focus:outline-none">
        {/* Narrative Input Component */}
        <NarrativeInput
          narrative={narrative}
          setNarrative={setNarrative}
          caseCategory={caseCategory}
          setCaseCategory={setCaseCategory}
          jurisdiction={jurisdiction}
          setJurisdiction={setJurisdiction}
          onSubmit={handleGenerateBrief}
          isLoading={isLoading}
        />

        {/* Error Handling Alert */}
        {error && (
          <div role="alert" aria-live="assertive" className="bg-red-950/50 border border-red-500/50 rounded-2xl p-4 text-red-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-red-300">Generation Error</h4>
              <p className="text-xs text-red-200 mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleGenerateBrief}
              aria-label="Retry generating legal brief"
              className="text-xs bg-red-900 hover:bg-red-800 text-red-100 px-3 py-1.5 rounded-lg border border-red-700 flex items-center gap-1 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Cache Indicator Badge */}
        {isCachedResult && brief && (
          <div className="flex items-center justify-end gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-xl w-max ml-auto">
            <Zap className="w-3.5 h-3.5" />
            <span>Response Served via Ultra-Fast SHA-256 Cache (&lt; 5ms)</span>
          </div>
        )}

        {/* Generated Brief Section & Audio Controls */}
        {brief && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Audio Read Aloud Player Bar */}
            <AudioPlayerControls
              textToRead={briefTextForSpeech}
              isSupported={speech.isSupported}
              isSpeaking={speech.isSpeaking}
              isPaused={speech.isPaused}
              rate={speech.rate}
              voices={speech.voices}
              selectedVoice={speech.selectedVoice}
              onPlay={speech.speak}
              onPause={speech.pause}
              onResume={speech.resume}
              onStop={speech.stop}
              onRateChange={speech.setRate}
              onVoiceChange={speech.selectVoice}
              title={`Read Aloud Legal Brief (${brief.legalCategory})`}
            />

            {/* Main Structured Output */}
            <LegalBriefOutput brief={brief} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-300">AOR-Briefing Assistant</span>
            <span>• Pre-Consultation Legal Fact Tool</span>
          </div>

          <p className="text-center md:text-right max-w-md text-[11px] leading-tight">
            ⚠️ Disclaimer: This tool provides informational structuring only and does not constitute legal advice. Always consult a licensed Advocate on Record for formal legal representation.
          </p>
        </div>
      </footer>
    </div>
  );
}
