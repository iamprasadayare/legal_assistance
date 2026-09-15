"use client";

import React from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface AudioPlayerControlsProps {
  textToRead: string;
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onPlay: (text: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  title?: string;
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  textToRead,
  isSupported,
  isSpeaking,
  isPaused,
  rate,
  voices,
  selectedVoice,
  onPlay,
  onPause,
  onResume,
  onStop,
  onRateChange,
  onVoiceChange,
  title = "Read Aloud Briefing",
}) => {
  if (!isSupported) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
        <VolumeX className="w-4 h-4 text-amber-500" />
        <span>Browser Text-to-Speech API is not supported on this browser device.</span>
      </div>
    );
  }

  const handlePlayToggle = () => {
    if (isSpeaking) {
      if (isPaused) {
        onResume();
      } else {
        onPause();
      }
    } else {
      onPlay(textToRead);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Status & Equalizer */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <Volume2
              className={`w-5 h-5 ${
                isSpeaking && !isPaused
                  ? "text-emerald-400 animate-pulse"
                  : "text-indigo-400"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {title}
              </span>
              {isSpeaking && !isPaused && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Playing Audio
                </span>
              )}
              {isSpeaking && isPaused && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Paused
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Listen to full structured legal output using native browser voice synthesis.
            </p>
          </div>
        </div>

        {/* Center/Right Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayToggle}
            disabled={!textToRead}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
              isSpeaking && !isPaused
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            } ${!textToRead ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              isSpeaking
                ? isPaused
                  ? "Resume Audio"
                  : "Pause Audio"
                : "Read Aloud"
            }
          >
            {isSpeaking && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : isSpeaking && isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isSpeaking && (
            <button
              onClick={onStop}
              className="p-2 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all"
              title="Stop Audio"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Speed / Rate Selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="0.8" className="bg-slate-900">
                0.8x Slow
              </option>
              <option value="1.0" className="bg-slate-900">
                1.0x Normal
              </option>
              <option value="1.2" className="bg-slate-900">
                1.2x Fast
              </option>
              <option value="1.5" className="bg-slate-900">
                1.5x Rapid
              </option>
            </select>
          </div>

          {/* Voice Selector (if multiple available) */}
          {voices.length > 1 && (
            <select
              value={selectedVoice?.name || ""}
              onChange={(e) => {
                const v = voices.find((voice) => voice.name === e.target.value);
                if (v) onVoiceChange(v);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none max-w-[140px] truncate"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name} className="bg-slate-900">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};
