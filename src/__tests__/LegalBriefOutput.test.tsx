import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LegalBriefOutput } from "@/components/LegalBriefOutput";
import { LegalBriefData } from "@/app/api/generate-brief/route";

const mockBrief: LegalBriefData = {
  caseSummary: "Client purchased apartment; builder delayed possession and unilaterally cancelled.",
  legalCategory: "Real Estate & Property",
  timeline: [
    {
      date: "10 March 2021",
      title: "Agreement Signed",
      details: "Client signed registered agreement and paid 85%.",
      keyParties: "Client & Builder",
      evidenceRef: "Registered Agreement",
    },
  ],
  missingFacts: [
    {
      category: "Contractual Terms",
      question: "Is there a specific penalty clause for delay?",
      rationale: "Required to compute interest claim under RERA.",
      importance: "High",
    },
  ],
  nextSteps: [
    {
      stepNumber: 1,
      action: "Gather Bank Transfer Receipts",
      category: "Document Gathering",
      urgency: "Immediate (Critical)",
      rationale: "Proves 85% consideration paid.",
    },
  ],
  legalRiskFactors: ["Builder insolvency risk", "Lack of price escalation clause"],
};

describe("LegalBriefOutput Component", () => {
  it("renders summary, risk factors, and legal category", () => {
    render(<LegalBriefOutput brief={mockBrief} />);
    expect(screen.getByText("Executive Case Brief")).toBeInTheDocument();
    expect(screen.getByText("Real Estate & Property")).toBeInTheDocument();
    expect(screen.getByText(/Builder insolvency risk/i)).toBeInTheDocument();
  });

  it("switches tabs when clicked", () => {
    render(<LegalBriefOutput brief={mockBrief} />);
    const timelineTab = screen.getByRole("tab", { name: /Chronological Timeline/i });
    fireEvent.click(timelineTab);
    expect(screen.getByText("10 March 2021")).toBeInTheDocument();
    expect(screen.getByText("Agreement Signed")).toBeInTheDocument();
  });
});
