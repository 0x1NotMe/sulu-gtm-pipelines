# Sulu — Health Report Feature Specification

| | |
|---|---|
| Document version | 1.1 |
| Last updated | March 2026 |
| Author | Sulu Product Team |
| Status | Draft — decisions updated |
| Audience | Product, Engineering, Design |

---

## Terminology decisions (applied throughout this document)

- **"GP"** is replaced with **"your doctor"** in all user-facing copy. "GP" is used in AU/UK/NZ/IE but not in the US or Canada. "Your doctor" is universal and includes specialists — gynaecologists, endocrinologists, menopause specialists.
- **"GP Health Report"** is renamed **"Health Report"** as the user-facing document name.
- **"Clinical Insights Report"** is renamed **"Pattern Insights"** — "clinical" is too medical and conflicts with the app voice.
- Internal / code references to "GP Export" can remain until internationalisation.

---

## Executive Summary

The Health Report is a feature that enables Sulu users to generate a structured, data-backed document summarising their perimenopause symptoms, trends, and patterns. The report is designed to be shared with healthcare providers to support medical conversations and improve diagnostic outcomes.

This feature addresses a core problem in perimenopause care: women are frequently dismissed, misdiagnosed, or under-treated because they lack the language and evidence to advocate for themselves in time-limited appointments.

> **Why this matters:** 54% of perimenopausal women report feeling inadequately informed about their symptoms (Flo Health, 2024). The average woman requires 10 healthcare appointments before receiving an appropriate menopause diagnosis (Balance, 2023). A structured symptom report transforms a subjective conversation into an evidence-based one.

---

## Strategic Context

The Health Report serves two strategic purposes:

1. **Mission alignment:** It directly supports Sulu's core purpose of helping women get taken seriously by healthcare providers. This is the feature that turns tracked data into real-world impact.

2. **Premium conversion:** It is the primary driver for premium subscriptions. The free tier offers a genuinely useful Symptom Summary. The premium tier adds Pattern Insights — data-driven analysis that changes the outcome of appointments.

---

## Feature Overview

The Health Report exists in two tiers, both accessible from the Profile screen under a dedicated "My Reports" section. Users can also be prompted to generate a report at meaningful moments (after 30 days of tracking, before a tagged appointment, etc).

### Tier structure

| Capability | Free Tier | Premium Tier |
|---|:---:|:---:|
| Report name | Symptom Summary | Symptom Summary + Pattern Insights |
| Length | 1 page | 4–5 pages |
| Data range | Last 30 days | Full history / custom range |
| Symptom data | Averages and frequency | Trends, comparisons, severity over time |
| Correlations | Not included | Factor-symptom analysis |
| Symptom clusters | Not included | Identified and described |
| Conversation prompts | 1 free (rest gated) | Data-driven, personalised — all included |
| Customisation | None | Date range, symptom selection, tone |
| Generation limit | Once every 7 days | Unlimited |
| Format | PDF | PDF (branded layout) |

> **Design principle:** Tracking is free. Intelligence is premium. The user never loses access to their own data or their ability to log symptoms. What they pay for is the app doing the hard work of turning that data into something that changes the outcome of a medical appointment.

---

## Free Tier: Symptom Summary

### Purpose

Give every Sulu user something concrete to bring to an appointment. A woman with a printed one-page summary is already better prepared than 90% of perimenopause consultations. This report is functional, clear, and genuinely useful — not a teaser for premium.

### Content specification

**Header block:** User's name, report date range (last 30 days), generation date. Sulu branding in top corner (subtle, not promotional).

**Tracking overview:** Single line summary, e.g. "Sarah has been tracking with Sulu for 47 days, logging on 42 of those days."

**Symptom table:** Each tracked symptom listed with: symptom name, average severity (None / Mild / Moderate / Severe), number of days logged out of total, and a simple frequency descriptor (e.g. "most days", "occasionally").

**Factors summary:** A list of which Today's factors were logged and how often. E.g. "Stressful Day — recorded on 19 of 30 days". No analysis of correlations. *(Note: "High Stress" renamed to "Stressful Day" throughout.)*

**30-day visual:** A compact mini chart (sparkline or small bar chart) showing symptom severity over the last 30 days. One row per symptom. Visual only — no written trend analysis.

**Pattern Insights tease:** At the bottom of every free report, a clearly labelled blurred section showing "X patterns identified in your data" with a lock icon and an upgrade prompt. Additionally, one free conversation prompt surfaces in full — the most compelling one identified from the user's data. Remaining prompts are gated: "2 more conversation starters available with Premium." Specific enough to feel real. Non-blocking. Never vague.

**Footer:** "Generated by Sulu — a symptom tracking app for perimenopause. This is not a medical document."

### Constraints

- Fixed 30-day window — not configurable
- No written analysis, correlations, or trend commentary
- No customisation of which symptoms to include
- Generation limit: once every 7 days (updated from 1 per calendar month)
- PDF format only

---

## Premium Tier: Pattern Insights

### Purpose

Transform logged data into a structured document that supports medical advocacy. This report doesn't just show what happened — it analyses patterns, identifies correlations, and provides the user with language to navigate an appointment. The goal is to make it significantly harder for a healthcare provider to dismiss the user's experience.

### Page 1 — Patient Overview

- Patient name, age, life stage (from onboarding data — reflect what the user told us, do not assume "perimenopause" if user selected "not sure" in onboarding), total tracking duration
- HRT status and any recorded changes during the reporting period
- Consistency metric: "Logged 5+ days per week for 12 consecutive weeks"
- Framing paragraph — a generated summary in plain language, e.g.:

> *"Sarah, age 46, has been tracking symptoms daily for 3 months. Her data shows a pattern of escalating vasomotor symptoms with strong sleep-disruption correlation. The following report summarises her logged experience to support medical discussion."*

> ⚠️ **Note:** The framing paragraph must not assume a perimenopause diagnosis. If the user selected "not sure" or "still having regular periods" in onboarding, use neutral language: "tracking symptoms" rather than "tracking perimenopause symptoms."

### Page 2 — Symptom Detail

For each tracked symptom, the report includes:

- Severity trend over the full selected date range, presented as a clear line chart
- Frequency analysis: average days per week, with directional trend (increasing / stable / decreasing)
- Worst period identification: e.g. "Hot flashes peaked during weeks 6–8, averaging Severe on 4 of 7 days"
- Period comparison: current month vs first month of tracking, with percentage change in both frequency and severity

### Page 3 — Correlations & Patterns

This is the core premium differentiator. The app performs analysis that neither the user nor the doctor has time to do manually.

**Factor-symptom correlations:** Identifies statistically meaningful relationships between logged factors and symptom severity. Always uses "associated with" language, never "caused by." Example: "On days with Supplement change logged, sleep severity was 45% higher than average."

**Symptom clusters:** Identifies symptoms that frequently co-occur. Example: "Sleep disruption, brain fog, and low mood appeared together on 73% of days they were logged, suggesting a linked pattern."

**Cycle overlay:** If the user is tracking periods (Period started today factor), symptom intensity is mapped against cycle timing to identify hormonal patterns. Example insights:
- "Your sleep was worse in the 7 days before your last 3 periods."
- "Brain fog tends to lift in the days after your period starts."

**Trigger matrix:** A visual grid showing which factors correlate with which symptoms and the strength of each relationship.

### Page 4 — Conversation Prompts

Pre-written, first-person statements and questions the user can read directly to their doctor. Generated from the user's actual data — not generic templates. Reference specific symptoms, durations, and severity.

**Decided:** HRT references are kept in conversation prompts (Option A). Women should be having this conversation with their doctor — watering it down loses the point. Each prompt is marked with \* and a single disclaimer footnote appears at the bottom of the page. Prompts are not marked individually — the footnote covers all.

**Voice rule:** Prompts must sound like something a real woman would actually say in an appointment — not medical language, not clinical. Data first, question second, no jargon.

Example outputs:

> *"My hot flashes have been getting worse for three months, not better. I want to talk about what we can do about that."* \*

> *"When I don't sleep, my brain fog the next day is bad enough to affect my work. Can we focus on the sleep specifically?"* \*

> *"I'm not on HRT yet. My symptoms have been building for months. I'd like to talk about whether it's the right option for me."* \*

---
*\* These prompts are conversation starters based on your tracked data, not medical recommendations.*

---

These prompts solve the "I froze in the appointment" problem directly.

### Page 5 (optional) — Data Appendix

- Complete daily log table for the selected date range
- Raw data for clinicians who prefer to review source material
- Can be excluded if user prefers a shorter report

---

## Report Generation Flow

The user accesses report generation from Profile → My Reports → Generate New Report.

### Step 1: Select report type

Free users see a single option: "Symptom Summary (last 30 days)" with a preview of what the report includes. A clearly labelled premium card shows the Pattern Insights addition with a feature comparison and upgrade prompt.

Premium users choose between both options, with the full report pre-selected.

### Step 2: Configure (premium only)

- Date range: Last 30 days, 90 days, 6 months, 12 months, or custom
- Symptom selection: Choose which tracked symptoms to include (default: all)
- Report tone: "Factual summary" or "Help me advocate" (the latter includes conversation prompts)
- Personal note: Optional free-text field that appears at the top of the report
- Doctor name: Optional field for tagging the report to a specific appointment

### Step 3: Preview

An in-app scrollable preview of the full report in the Sulu visual style (cream and terracotta palette, Playfair headings, clean data visualisation). The user can review every section before generating the final PDF.

### Step 4: Export

- Download as PDF to device
- Share via native share sheet (email, AirDrop, messaging)
- Print directly from the app
- Report is saved in-app under My Reports with date and optional doctor tag

---

## Smart Prompting & Distribution

The report feature should surface at the right moments, not just wait in a menu. All trigger copy must pass the 3am test — calm, structured, easy to process.

### Trigger moments

- After 30 days of tracking: *"You've been logging for a month. Ready to see your first report?"*
- After a high-severity week: *"This was a difficult week. A report can help your doctor understand what you've been experiencing."* *(updated from "tough week / what you're going through" — too informal/sympathy-led)*
- Before a tagged appointment: If the user has logged an appointment date, prompt report generation 2 days before
- On the weekly snapshot screen: A persistent but subtle "Share with your doctor" link

### Upsell moments (free → premium)

These should feel informative, not aggressive. Specific, not vague.

- After viewing Symptom Summary: *"Want to include trend analysis and conversation prompts? See what Pattern Insights includes."*
- When correlation engine detects a strong pattern for a free user: *"We found [X] patterns in your data. Upgrade to see the full analysis."* *(must be specific — number of patterns, not just "something")*
- When a free user tries to generate within 7 days: *"Your next free report is available in [X] days. Pattern Insights members can generate unlimited reports."*

---

## Technical Considerations

### Data requirements

- Minimum 14 days of logged data to generate any report (show clear messaging before this threshold)
- Correlation analysis requires minimum 30 days of data to be statistically meaningful
- Conversation prompts require minimum 60 days for trend-based language (shorter periods get simpler prompts)

### Generation

- Reports should generate client-side where possible to avoid sending health data to additional servers
- PDF generation via a client-side library (e.g. react-pdf) with server fallback for complex charts
- Conversation prompts are generated using template-based logic with data interpolation — not LLM-generated (for regulatory and trust reasons)

### Data privacy

- Reports contain sensitive health data — generated PDFs must not be cached on servers
- Shared reports should carry a disclaimer that data is user-reported and not clinically verified
- Exported data must comply with the **Australian Privacy Act 1988** (primary jurisdiction) and **GDPR** for EU users. TGA regulations should also be reviewed given the health data context. *(Original doc referenced GDPR only — Sulu is an Australian app.)*

### Localisation

- Date formats must respect user's locale (DD/MM/YYYY vs MM/DD/YYYY)
- "Doctor" is the default term (replaces "GP" for international readiness). AU/UK launch may use "GP" in marketing but UI defaults to "doctor."
- Conversation prompts will need professional translation for non-English markets

---

## Success Metrics

### Primary metrics

| Metric | Target | Measurement |
|---|---|---|
| Free report generation rate | 40% of users with 30+ days of tracking | Monthly active users who generate at least 1 report |
| Premium conversion from report | 15% of free report viewers upgrade within 30 days | Funnel: free report generated → premium CTA tapped → subscribed |
| Report share rate | 25% of generated reports are shared externally | Share sheet opened / total reports generated |
| Retention impact | Users who generate reports retain 2x better at 90 days | Cohort analysis: report generators vs non-generators |

### Qualitative signals

- User feedback referencing the report as a reason for subscribing
- Social media mentions of "showing my doctor" or "finally being taken seriously"
- Healthcare provider feedback on report utility

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Users interpret the report as medical advice | High — liability exposure | Clear disclaimers on every report. Language reviewed by medical advisor. Never use diagnostic language. |
| Doctors dismiss the report as "just an app" | Medium — undermines user trust | Professional visual design. Factual, non-prescriptive language. Optional advocacy tone setting. |
| Correlation analysis produces misleading patterns | Medium — user makes incorrect health decisions | Minimum data thresholds before showing correlations. Language always says "associated with" not "caused by". Statistical significance thresholds. |
| Free tier report is too good — no upgrade incentive | Low — affects revenue | Free report is deliberately static and summary-only. The gap to Pattern Insights is clear and justified. |
| Premium report is too complex for users | Medium — low engagement | Default settings should produce a great report with zero configuration. Customisation is optional. |

---

## Suggested Phasing

### Phase 1: MVP (4–6 weeks)

- Free tier Symptom Summary report with fixed 30-day window
- PDF generation with symptom table, averages, and 30-day mini charts (sparkline per symptom)
- Accessible from Profile → My Reports
- Generation limit: once every 7 days for free users
- Pattern Insights tease: blurred section + 1 free conversation prompt
- Premium upgrade CTA on the report screen

### Phase 2: Pattern Insights Report (6–8 weeks)

- Premium tier full report with full history
- Trend charts and severity-over-time visualisation
- Factor-symptom correlation analysis
- Date range and symptom selection configuration
- In-app preview before PDF generation

### Phase 3: Conversation Engine (4–6 weeks)

- Conversation prompt generation from user data
- Report tone selection (factual vs advocacy)
- Smart prompting at trigger moments
- Personal note and doctor tagging

### Phase 4: Polish & Growth (ongoing)

- Symptom cluster detection
- Cycle overlay analysis
- Trigger matrix visualisation
- Partner/supporter sharing
- Localisation for non-English markets

---

## Open Questions for Discussion

1. ✓ **Free report: charts or text-only? — decided.** Include the 30-day mini charts (sparkline or small bar chart) in the free Symptom Summary. Charts increase perceived value without giving away the premium product — the premium differentiator is the *analysis* (Pattern Insights), not the visuals. A woman handing her doctor a page with a visible severity chart lands differently than a table of averages. Phase 1 engineering should target a simple sparkline per symptom via react-pdf.

2. ✓ **Under 14 days of data — decided.** No partial report. Users under the 14-day threshold see a milestone-style progress indicator — not just a counter. Design should feel like anticipation, not a gate. Show: a preview of what the report will look like (locked/blurred), the tracking streak so far, and a clear milestone marker ("X days to go — keep logging"). This protects report quality (a 6-day report is almost meaningless data) while giving the user a sense of progress and something to work toward. Copy must pass the 3am test — calm and motivating, not guilt-inducing.

3. ✓ **HRT references in conversation prompts — decided.** Keep HRT references. Women should be having this conversation with their doctor. Each prompt marked with \* and a single disclaimer footnote at the bottom of the page: *"These prompts are conversation starters based on your tracked data, not medical recommendations."* Prompts rewritten in real language — no medical jargon, no clinical phrasing.

4. ✓ **Pricing — decided.** $4.99/month or $49.99/year.

5. ✓ **Shareable web link — parked for v2.** PDF is sufficient for launch. Time-limited shareable URL is better UX but adds engineering and privacy complexity. Revisit after launch.

6. ✓ **Healthcare provider partnerships — parked, not a launch priority.** The long-term play (GP networks accepting Sulu reports as standard pre-appointment input, or EHR integration) is strategically valuable but requires regulatory groundwork, healthcare procurement cycles (12–24 months), and likely a B2B commercial model. Revisit post-launch once consumer traction is established. In the meantime: professional report design, factual non-prescriptive language, and "your doctor" terminology all keep this option open without requiring any specific decisions now. No action required for v1.
