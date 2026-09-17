import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AudioPlayerControls } from "@/components/AudioPlayerControls";

describe("AudioPlayerControls Component", () => {
  const defaultProps = {
    textToRead: "Sample legal summary text",
    isSupported: true,
    isSpeaking: false,
    isPaused: false,
    rate: 1.0,
    voices: [],
    selectedVoice: null,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onStop: vi.fn(),
    onRateChange: vi.fn(),
    onVoiceChange: vi.fn(),
    title: "Read Aloud Briefing",
  };

  it("renders Read Aloud button and controls", () => {
    render(<AudioPlayerControls {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Read Aloud/i })).toBeInTheDocument();
  });

  it("calls onPlay when Read Aloud button is clicked", () => {
    render(<AudioPlayerControls {...defaultProps} />);
    const playBtn = screen.getByRole("button", { name: /Read Aloud/i });
    fireEvent.click(playBtn);
    expect(defaultProps.onPlay).toHaveBeenCalledWith("Sample legal summary text");
  });
});
