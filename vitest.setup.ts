import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Web Speech API window.speechSynthesis for testing environment
if (typeof window !== "undefined") {
  window.speechSynthesis = {
    getVoices: vi.fn().mockReturnValue([
      { name: "Google US English", lang: "en-US", default: true } as SpeechSynthesisVoice,
    ]),
    speak: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    cancel: vi.fn(),
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  window.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
    text,
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
    lang: "en-US",
    onstart: null,
    onend: null,
    onerror: null,
    onpause: null,
    onresume: null,
    onmark: null,
    onboundary: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as any;
}
