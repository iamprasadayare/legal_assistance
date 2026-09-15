"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { NarrativeInput } from "@/components/NarrativeInput";
import { LegalBriefOutput } from "@/components/LegalBriefOutput";
import { AudioPlayerControls } from "@/components/AudioPlayerControls";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { LegalBriefData } from "@/app/api/generate-brief/route";
import { Scale, AlertCircle, RefreshCw, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  const [narrative, setNarrative] = useState<string>("");
  const [caseCategory, setCaseCategory] = useState<string>("Auto-detect Category");
  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<LegalBriefData | null>(null);

  // Custom Speech Synthesis hook for TTS
  const speech = useSpeechSynthesis();

  const handleGenerateBrief = async () => {
    if (!narrative.trim()) return;

    setIsLoading(true);
    setError(null);
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
    } catch (err: any) {
      console.error("Error generating legal brief:", err);
      setError(err.message || "An unexpected error occurred while communicating with Gemini AI.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepares readable text representation for Speech Synthesis engine
  const getBriefTextForSpeech = (): string => {
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
  };

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
          <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-4 text-red-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-red-300">Generation Error</h4>
              <p className="text-xs text-red-200 mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleGenerateBrief}
              className="text-xs bg-red-900 hover:bg-red-800 text-red-100 px-3 py-1.5 rounded-lg border border-red-700 flex items-center gap-1 font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Generated Brief Section & Audio Controls */}
        {brief && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Audio Read Aloud Player Bar */}
            <AudioPlayerControls
              textToRead={getBriefTextForSpeech()}
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
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6">
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
