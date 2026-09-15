# AOR-Briefing Assistant ⚖️🤖

> **Pre-Consultation Legal Fact Structuring & Audio Synthesis Tool**
> Built with Next.js, React, Tailwind CSS, Google Gemini GenAI SDK (`@google/generative-ai`), and native Web Speech API.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-SDK-8E75FF?logo=google)

---

## 📌 Problem Vertical: AI for Legal Assistance & Access

Legal disputes often start with emotional, unorganized, and chronologically messy narratives from clients. When consulting an **Advocate on Record (AOR)** or legal counsel, valuable consultation time and fees are wasted trying to untangle dates, missing agreements, and key facts.

**AOR-Briefing Assistant** bridge this gap by acting as an intelligent pre-consultation assistant. It enables users to input messy case stories and leverages **Google Gemini AI** to produce a structured 3-part legal brief:

1. **Chronological Timeline**: Sequential mapping of incidents, dates, parties, and evidence flags.
2. **Missing Critical Facts**: Identifies indispensable factual & evidentiary gaps that lawyers need before filing or advising.
3. **Informational Next Steps**: Actionable checklist of prep steps (document gathering, notice checks, limitation period precautions) before meeting counsel.
4. **Text-to-Speech (Read Aloud)**: Uses native browser Web Speech API with Play, Pause, Resume, and Stop controls so users can listen to their generated legal brief out loud.

---

## ⚖️ Mandatory Legal Disclaimer

> **IMPORTANT DISCLAIMER**: This tool provides informational structuring only and does not constitute legal advice. Users must consult a licensed Advocate on Record for formal legal counsel and representation.

A persistent notice banner is rendered across the application and embedded into all exported briefs.

---

## 🚀 Key Features

- **Messy Narrative Parsing**: Large text area with pre-loaded real-world sample cases (Real Estate Builder Delay, Breach of Software Contract, Wrongful Employment Termination).
- **Secure Gemini API Integration**: Next.js App Router API route (`/api/generate-brief`) using the official `@google/generative-ai` SDK with `GEMINI_API_KEY`.
- **Structured Interactive UI**:
  - **Timeline View**: Visual vertical timeline with incident date badges and evidence tags.
  - **Missing Facts Cards**: Color-coded priority alerts highlighting critical legal gaps.
  - **Actionable Next Steps**: Numbered steps with urgency badges.
- **Native Browser Text-to-Speech (Free)**:
  - Play ▶️, Pause ⏸️, Resume ⏯️, Stop ⏹️ controls.
  - Rate speed control (0.8x to 1.5x) and voice selection.
- **Export & Portability**: 1-click **Copy Brief to Clipboard** (Markdown formatted) & **Export Text File** for print or email.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide Icons, Modern Dark Slate Theme
- **GenAI Engine**: `@google/generative-ai` SDK (`gemini-1.5-flash` / `gemini-2.0-flash`)
- **Audio Synthesis**: Native `window.speechSynthesis` (Web Speech API)
- **Deployment**: Vercel ready

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/iamprasadayare/legal_assistance.git
cd legal_assistance/aor-briefing-assistant
npm install
```

### 2. Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Vercel Deployment Instructions

1. Push code to your GitHub repository: `https://github.com/iamprasadayare/legal_assistance`.
2. Connect your repository to **Vercel**.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio API Key)*
4. Click **Deploy**.

---

## 📄 License & Attribution

Submitted for the **AI for Legal Assistance & Access** Challenge.
Created by Prasad Ayare.
