/**
 * @file sampleCases.ts
 * @description Centralized sample legal dispute narratives for instant 1-click testing.
 */

import { SampleCase } from "@/types";

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: "real-estate",
    title: "Real Estate Builder Delay",
    category: "Real Estate & Property",
    narrative:
      "I booked a 3BHK flat in Apex Heights, Sector 62 Gurugram on 14th February 2021 by paying an advance booking amount of Rs 15 Lakhs via HDFC bank transfer. The Builder-Buyer Agreement was signed on 28th March 2021 with a committed possession clause within 24 months (28th March 2023) plus a 6-month grace period ending September 2023. As of September 2026, construction is stuck at 60% completion. I sent a formal legal notice on 10th January 2024 via registered post demanding 18% p.a. interest penalty or full refund, but the builder gave vague replies citing labor shortages. I have bank statements, registered BBA agreement, and email correspondence.",
  },
  {
    id: "b2b-software",
    title: "B2B Software Vendor Breach",
    category: "Breach of Contract",
    narrative:
      "Our firm techsolutions Pvt Ltd signed a Master Services Agreement (MSA) with CloudScale Systems on 1st November 2022 to develop a customized ERP portal for Rs 45 Lakhs. We paid 50% milestone advance (Rs 22.5 Lakhs) on 15th November 2022. The agreed delivery date was 30th June 2023 with an SLA clause guaranteeing 99.9% uptime and quarterly delivery milestones. CloudScale missed Milestone 2 and Milestone 3 deadlines repeatedly. On 15th December 2023, CloudScale unilaterally shut down our staging servers demanding an extra Rs 10 Lakhs beyond scope. We suffered Rs 30 Lakhs in business loss. We have the signed MSA, payment receipts, Slack chat logs, and email notices.",
  },
  {
    id: "employment-dispute",
    title: "Wrongful Termination & Bonus Claim",
    category: "Employment & Labor",
    narrative:
      "I was employed as Senior Product Lead at FinTech Global Corp since 10th June 2020 under an Employment Contract specifying a 3-month notice period and annual performance bonus clause. On 15th August 2023, my manager verbally asked me to resign within 24 hours without assigning cause. When I refused, HR issued a sudden termination letter on 18th August 2023 citing 'performance issues' without conducting any Performance Improvement Plan (PIP) or inquiry. They withheld my earned bonus of Rs 8 Lakhs and 2 months of pending salary. I sent an email representation on 25th August 2023 to HR and MD. I hold my offer letter, pay slips, performance appraisal emails rating 'Exceeded Expectations', and termination notice.",
  },
];
