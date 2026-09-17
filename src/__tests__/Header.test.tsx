import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/Header";

describe("Header Component", () => {
  it("renders branding title and subtitle", () => {
    render(<Header />);
    expect(screen.getByText("AOR-Briefing Assistant")).toBeInTheDocument();
    expect(screen.getByText("AOR Legal Tool")).toBeInTheDocument();
  });

  it("renders GitHub repository link", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: /GitHub Repository/i });
    expect(link).toHaveAttribute("href", "https://github.com/iamprasadayare/legal_assistance");
  });
});
