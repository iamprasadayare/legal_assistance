import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NarrativeInput } from "@/components/NarrativeInput";

describe("NarrativeInput Component", () => {
  const defaultProps = {
    narrative: "",
    setNarrative: vi.fn(),
    caseCategory: "Auto-detect Category",
    setCaseCategory: vi.fn(),
    jurisdiction: "",
    setJurisdiction: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
  };

  it("renders textarea and submit button", () => {
    render(<NarrativeInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Paste or type your narrative here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate Legal Brief/i })).toBeInTheDocument();
  });

  it("disables submit button when narrative is empty", () => {
    render(<NarrativeInput {...defaultProps} narrative="" />);
    const submitBtn = screen.getByRole("button", { name: /Generate Legal Brief/i });
    expect(submitBtn).toBeDisabled();
  });

  it("enables submit button when narrative is provided", () => {
    render(<NarrativeInput {...defaultProps} narrative="Purchased flat on March 2021" />);
    const submitBtn = screen.getByRole("button", { name: /Generate Legal Brief/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("calls setNarrative when clicking a sample case button", () => {
    render(<NarrativeInput {...defaultProps} />);
    const sampleBtn = screen.getByRole("button", { name: /Real Estate & Builder Delay/i });
    fireEvent.click(sampleBtn);
    expect(defaultProps.setNarrative).toHaveBeenCalled();
  });
});
