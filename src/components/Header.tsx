import React from "react";
import { Scale, Sparkles, Volume2, Code2, ExternalLink } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header role="banner" className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AOR-Briefing Assistant
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                AOR Legal Tool
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Pre-Consultation Case Fact Structuring & Audio Synthesis
            </p>
          </div>
        </div>

        {/* Badges & GitHub Repo link */}
        <nav aria-label="Quick External Links" className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-xs text-slate-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>Gemini AI</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-xs text-slate-200 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Web Speech TTS</span>
          </div>
          <a
            href="https://github.com/iamprasadayare/legal_assistance"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub Repository"
            className="flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 px-3 py-1 rounded-full text-xs text-indigo-200 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
};
