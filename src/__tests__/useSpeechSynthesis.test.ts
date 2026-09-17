import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

describe("useSpeechSynthesis Hook", () => {
  it("initializes with default speech state", () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.rate).toBe(1.0);
  });

  it("updates speech rate cleanly", () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.setRate(1.25);
    });

    expect(result.current.rate).toBe(1.25);
  });

  it("handles stop command without throwing error", () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.stop();
    });

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });
});
