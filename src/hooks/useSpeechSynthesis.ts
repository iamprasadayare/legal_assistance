"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SpeechSynthesisState {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRateState] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        try {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices);
          if (availableVoices.length > 0) {
            setSelectedVoice((prev) => {
              if (prev) return prev;
              const englishVoice = availableVoices.find(
                (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en")
              );
              return englishVoice || availableVoices[0];
            });
          }
        } catch (err) {
          console.warn("Failed to retrieve speech voices:", err);
        }
      };

      updateVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      .replace(/#{1,6}\s?/g, "") // Remove headers
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // Remove bold/italic
      .replace(/`{1,3}[^`]*`{1,3}/g, "") // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links
      .replace(/[-*+]\s+/g, ". ") // Replace bullet points with pauses
      .replace(/\n+/g, " ") // Clean newlines
      .trim();
  };

  const stop = useCallback(() => {
    if (!isSupported || typeof window === "undefined") return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancel errors
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || typeof window === "undefined") return;

      // Clean up previous playback safely
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }

      setIsSpeaking(false);
      setIsPaused(false);

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) return;

      // Small delay to ensure browser speech engine resets cleanly
      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = rate;
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
          };

          utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
            // Ignore normal cancellations or interruptions when user stops speech
            if (e.error === "canceled" || e.error === "interrupted") {
              setIsSpeaking(false);
              setIsPaused(false);
              return;
            }
            console.warn("Speech synthesis notice:", e.error || e);
            setIsSpeaking(false);
            setIsPaused(false);
          };

          utterance.onpause = () => {
            setIsPaused(true);
          };

          utterance.onresume = () => {
            setIsPaused(false);
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn("Failed to initiate SpeechSynthesisUtterance:", err);
          setIsSpeaking(false);
          setIsPaused(false);
        }
      }, 50);
    },
    [isSupported, rate, selectedVoice]
  );

  const pause = useCallback(() => {
    if (!isSupported || typeof window === "undefined") return;
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } catch {
      // Fallback
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || typeof window === "undefined") return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } catch {
      // Fallback
    }
  }, [isSupported]);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  }, []);

  const selectVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    rate,
    voices,
    selectedVoice,
    speak,
    pause,
    resume,
    stop,
    setRate,
    selectVoice,
  };
}
