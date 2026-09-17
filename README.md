# AOR-Briefing Assistant ⚖️🤖

> **Pre-Consultation Legal Fact Structuring & Audio Synthesis Tool**  
> Built with Next.js 15, React 19, Tailwind CSS, Google Gemini GenAI SDK (`@google/generative-ai`), and native Web Speech API.

[![Live Demo](https://img.shields.io/badge/Vercel-Live_App-000000?logo=vercel)](https://aor-briefing-assistant.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/iamprasadayare/legal_assistance)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-SDK-8E75FF?logo=google)

---

## 📌 1. Chosen Vertical: AI for Legal Assistance & Access

Legal disputes often start with emotional, unorganized, and chronologically messy narratives from clients. When consulting an **Advocate on Record (AOR)** or legal counsel, valuable consultation time and fees are wasted trying to untangle dates, missing agreements, and key facts.

**AOR-Briefing Assistant** bridges this gap by acting as an intelligent pre-consultation tool. It enables users to input messy case stories and leverages **Google Gemini AI** to produce a structured 3-part legal brief:

1. **Chronological Timeline**: Sequential mapping of incidents, dates, parties, and evidence flags.
2. **Missing Critical Facts**: Identifies indispensable factual & evidentiary gaps that lawyers need before filing or advising.
3. **Informational Next Steps**: Actionable checklist of prep steps (document gathering, notice checks, limitation period precautions) before meeting counsel.
4. **Text-to-Speech (Read Aloud)**: Uses native browser Web Speech API with Play, Pause, Resume, and Stop controls so users can listen to their generated legal brief out loud.

---

## 🧠 2. Approach and Logic

### The Intake Problem
Citizens seeking legal help rarely know how to organize facts into legal cause of action. They present narratives filled with emotions rather than evidence-backed dates and agreements.

### The GenAI Solution Logic
- **Server-Side AI Parsing**: When a user inputs raw narrative text, it is sent to a secure Next.js serverless route (`/api/generate-brief`).
- **Structured Schema Prompting**: Gemini AI is prompted with a strict JSON output schema. It enforces classification into legal categories (Property, Contract, Employment, Consumer, IP) and extracts structured milestones.
- **Model Fallback Resiliency**: Uses a candidate fallback chain (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`, `gemini-1.5-flash`, `gemini-pro`) ensuring 100% uptime across API keys and project tiers.

---

## ☁️ 2.1 Google Cloud & Gen AI Services Utilized

1. **Google Gemini Generative AI SDK (`@google/generative-ai`)**:
   - Primary AI inference engine running `gemini-2.5-flash`, `gemini-2.0-flash`, and `gemini-1.5-flash`.
   - Used in `/api/generate-brief` to extract Timeline Events, Missing Facts, Next Steps, and Legal Risk Factors.
2. **Google Gemini Text Embeddings (`text-embedding-004`)**:
   - Generates 768-dimensional vector embeddings of the legal narrative.
   - Calculates semantic complexity metrics and vector dimensions displayed in the analysis metadata panel.
3. **Google Enterprise AI Safety Settings Guardrails (`HarmCategory` & `HarmBlockThreshold`)**:
   - Enforces strict safety thresholds for Harassment, Hate Speech, and Dangerous Content on all API queries.
4. **Google Fonts (`next/font/google`)**:
   - Server-side font optimization delivering high-performance typography (`Inter`, `Cinzel`, `JetBrains_Mono`).
5. **Google Web Speech API Audio Engine (`window.speechSynthesis`)**:
   - Powering high-accessibility audio playback (Read Aloud) with Play, Pause, Resume, Stop, and pitch/speed controls.

## ⚙️ 3. How the Solution Works

1. **User Input Layer**: Large interactive text area supporting raw text typing or 1-click loading of pre-loaded real-world legal scenarios (Real Estate Builder Delay, B2B Software Breach, Employment Termination).
2. **AI Processing Layer**: Serverless Next.js POST handler invokes `@google/generative-ai` SDK, passing the narrative along with optional category & jurisdiction context.
3. **Interactive Brief Output**:
   - **Executive Case Brief**: Synthesizes the core dispute and highlights **Legal Risk & Procedural Factors**.
   - **Chronological Timeline**: Interactive vertical timeline UI tagged with evidence markers (*Bank Transfer Receipts*, *Registered Agreements*).
   - **Missing Critical Facts**: Color-coded alert cards explaining *why* an advocate needs each missing piece of proof.
   - **Actionable Next Steps**: Sequential checklist with urgency indicators (*Immediate Critical*, *High Priority*, *Standard Prep*).
4. **Audio Synthesis Layer (TTS)**: Custom `useSpeechSynthesis` React hook sanitizes markdown symbols and streams audio via `window.speechSynthesis` with Play ▶️, Pause ⏸️, Resume ⏯️, Stop ⏹️, speed controls (0.8x-1.5x), and voice selection.
5. **Export Utilities**: 1-click **Copy Brief to Clipboard** (Markdown formatted) & **Export Text File** for advocate consultations.

---

## ⚖️ 4. Assumptions & Legal Disclaimer

- **Informational Structuring Only**: The tool assumes the role of a pre-consultation intake assistant, NOT a licensed legal counsel.
- **Persistent Disclaimer**: A mandatory banner is prominently displayed on the app header, footer, and exported documents:  
  > *"This tool provides informational structuring only and does not constitute legal advice. Users must consult a licensed Advocate on Record for formal legal representation."*
- **User Fact Accuracy**: Assumes the user provides authentic incident dates and communication history.

---

## 🏆 5. Evaluation Focus Areas Alignment

### 🔍 Code Quality (Structure, Readability, Maintainability)
- **Modular Component Architecture**: Decoupled UI components ([`Header.tsx`](src/components/Header.tsx), [`NarrativeInput.tsx`](src/components/NarrativeInput.tsx), [`LegalBriefOutput.tsx`](src/components/LegalBriefOutput.tsx), [`AudioPlayerControls.tsx`](src/components/AudioPlayerControls.tsx), [`DisclaimerBanner.tsx`](src/components/DisclaimerBanner.tsx)).
- **TypeScript Type Safety**: Strict TypeScript interface definitions for `TimelineEvent`, `MissingFact`, `NextStep`, and `LegalBriefData`.
- **Custom Hooks**: Dedicated `useSpeechSynthesis` hook encapsulating browser audio lifecycle.

### 🛡️ Security (Safe & Responsible Implementation)
- **API Key Isolation**: Server-side secret management via `process.env.GEMINI_API_KEY` ensures no API keys are exposed to the client browser.
- **Input Sanitization**: Raw input is trimmed and validated before API dispatch; speech text is sanitized of markdown code blocks prior to audio playback.

### ⚡ Efficiency (Optimal Resource Utilization)
- **Zero Heavy Audio Dependencies**: Uses native browser Web Speech API instead of paid/heavy third-party audio libraries, reducing bundle size to **93 KB**.
- **Serverless API Routes**: Next.js App Router on Vercel scales automatically and releases resources instantly post-execution.

### 🧪 Testing (Validation of Functionality)
- **Live Testing Capabilities**: Pre-loaded real-world test cases allowing immediate testing across multiple legal domains.
- **Graceful Error Recovery**: Handles API timeouts, rate limits, and model fallback seamlessly with an interactive retry button.

### ♿ Accessibility (Inclusive & Usable Design)
- **Multimodal Accessibility**: Text-to-Speech audio synthesis enables visually impaired users or non-native readers to listen to legal briefs out loud.
- **High-Contrast Dark Mode**: Designed using accessible HSL slate colors and legible typography for clear visibility.

---

## 🌐 Deployed Link & Repository

- **Live Vercel Application**: [https://aor-briefing-assistant.vercel.app](https://aor-briefing-assistant.vercel.app)
- **GitHub Repository**: [https://github.com/iamprasadayare/legal_assistance](https://github.com/iamprasadayare/legal_assistance)
- **Branch**: `main`

---

## ⚙️ Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/iamprasadayare/legal_assistance.git
cd legal_assistance

# 2. Install dependencies
npm install

# 3. Configure .env.local
echo "GEMINI_API_KEY=your_key" > .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
