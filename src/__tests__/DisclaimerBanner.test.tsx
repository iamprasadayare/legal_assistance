import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

describe("DisclaimerBanner Component", () => {
  it("renders top disclaimer banner with legal notice text", () => {
    render(<DisclaimerBanner variant="top" />);
    expect(
      screen.getByText(/This tool provides informational structuring only and does not constitute legal advice/i)
    ).toBeInTheDocument();
  });

  it("renders card disclaimer variant cleanly", () => {
    render(<DisclaimerBanner variant="card" />);
    expect(screen.getByText(/Legal Disclaimer & Terms of Use/i)).toBeInTheDocument();
  });
});
