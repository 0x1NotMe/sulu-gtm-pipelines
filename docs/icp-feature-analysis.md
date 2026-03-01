# ICP Research x Feature Analysis

## 1. What to Track — Gaps & Recommendations

### Symptom list mismatch between design docs and code

The product design (copy.md) defines 9 symptoms including Irritability and Menstrual changes, but the actual code (constants/symptoms.ts) swapped these out for Headaches, Digestive Issues, Joint Pain, and Skin Changes — giving 9 different symptoms. This matters because:

| Research says is critical | Current code status | Impact |
|---|---|---|
| Anxiety / overwhelm (separate from mood) | Bundled into "Mood Changes" | **HIGH** — Anxiety misattribution is a top-3 pain point. Women need to show GPs "this is anxiety, not depression." Splitting it makes the GP Export far more powerful. |
| Rage / irritability | Not present as separate symptom | **HIGH** — "Why does no one warn you about the rage?" is one of the strongest emotional hooks. It needs its own slider. |
| Menstrual changes | Not in code at all | **MEDIUM** — Women correlating symptoms with cycle irregularity is a core pattern-finding behaviour. Without this, the "see the pattern" promise is weaker. |
| Night sweats (separate from hot flashes) | Bundled with "Hot Flashes" | **MEDIUM** — GPs respond most to hot flashes AND night sweats. Splitting them makes exports more credible to doctors. |

### Recommended symptom list (12 symptoms, ordered by ICP signal strength)

Ordered by how frequently and intensely women discuss each symptom in peri communities — highest signal first.

1. Hot flashes
2. Sleep disruption
3. Anxiety / overwhelm (separate from mood — critical per research)
4. Rage / irritability (massive ICP signal — "the rage")
5. Brain fog
6. Fatigue / low energy
7. Night sweats (split from hot flashes — GPs treat as separate clinical data)
8. Low mood / emotional swings (narrowed from "Mood Changes")
9. Menstrual changes (restored from design doc)
10. Heart palpitations (under-represented in apps — differentiation opportunity)
11. Joint / muscle pain
12. Headaches / migraines

Drop as standalones: digestive issues, skin changes. Fold into hint text where relevant.

### Symptom descriptions (selection screen)

One line each. Written for instant recognition, not explanation. Validated against ICP research verbatim quotes where possible.

| Symptom | Description |
|---|---|
| Hot flashes | "A wave of heat, arriving without warning." |
| Sleep disruption | "Can't get to sleep. Can't stay asleep. Sometimes both." |
| Anxiety / overwhelm | "Dread that arrives without reason. Sometimes it doesn't leave." |
| Rage / irritability | "Rage that feels out of proportion. And is completely real." |
| Brain fog | "The word that won't come. The thing you just forgot." |
| Fatigue / low energy | "Tired in a way sleep doesn't fix." |
| Night sweats | "Waking up soaked. Usually around 3am." |
| Low mood / emotional swings | "Flat when you should feel fine. Tearful when you least expect it." |
| Menstrual changes | "Periods that aren't what they used to be." |
| Heart palpitations | "The kind of heartbeat that makes you Google 'heart attack symptoms'." |
| Joint / muscle pain | "Stiffness or aching that wasn't there before." |
| Headaches / migraines | "More headaches than before. Or worse ones." |

### Future version symptoms (v2+)

Hold these back until the core 12 are validated. Women discuss them frequently but they require more sensitive UI handling or are lower daily-logging frequency.

- **Vaginal dryness / discomfort** — very commonly discussed; frame neutrally (e.g. "Intimate comfort")
- **Libido changes** — same caveat; "Sex drive" works as label
- **Weight changes / bloating** — major discussion topic but harder to quantify on a daily slider

### Naming decision: "Today's factors"

The design docs use "Change markers," the code uses "markers" — both feel technical. **"Today's factors"** is warmer, more human, and consistent with the brand voice (elegant, calm). Use this in all UI copy and future documentation. Update code references from `marker_*` IDs when feasible.

### Current factors (updated)

| Marker | Status | Notes |
|---|---|---|
| HRT / Hormones | Rename from "Medication" | "Medication" is too broad — covers paracetamol to antidepressants. Rename to "HRT" to match ICP intent and messaging. |
| Alcohol | Keep | Solid confounder. |
| Stressful Day | Rename from "High Stress" | Friendlier, clearer framing. Distinct from the Anxiety symptom slider. |
| Exercise | Keep | Useful confounder. |
| Supplement change | Add | "The Supplement Spiral" — women are trying magnesium, melatonin, GABA, progesterone cream, 5-HTP. Lets them see if anything actually helped. |
| Illness / travel / disruption | Add | In design doc but missing from code. Women need to flag bad weeks as outliers — critical for data integrity. |
| Period started today | Add | Anchors cycle position to symptom data. Unlocks luteal phase pattern insights without making Sulu a period tracker. |
| ~~Caffeine~~ | Remove | Lower signal than others. Drop for now. |

### Factor descriptions

**UX note:** Descriptions are not always visible on the daily check-in screen. They appear as a tooltip on hover, before tapping. Keeps the UI clean for daily use — context is there when needed, invisible when not.

| Factor | Description |
|---|---|
| HRT / Hormones | "For days you've taken HRT or other hormonal support." |
| Alcohol | "Had a drink. Worth knowing if it affects how you feel." |
| Stressful Day | "Work, family, life. One of those days." |
| Exercise | "Any movement today — walk, gym, swim, anything." |
| Supplement change | "Started, stopped, or changed a supplement." |
| Illness / travel / disruption | "Not a typical day. Flag it so your patterns stay clean." |
| Period started today | "First day of your period. Helps connect cycle timing to symptoms." |

### Period started — confirmed ✓

**Add "Period started today"** as a factor within Today's factors. One-tap, binary. This anchors cycle position to symptom data without making Sulu a period tracker — it's context, not prediction.

**Future version (v2+):** Add **"Period ended"** (or "Last day of period") as a companion factor. Together, the two data points give the app cycle length over time and a clean luteal phase window to analyse against.

**Cycle-phase insights this unlocks** (surface in Weekly Snapshot or pattern view):
- "Your sleep was worse in the 7 days before your last 3 periods."
- "Brain fog tends to lift in the days after your period starts."
- "Your anxiety scores were higher in the week before your period."
- "Hot flashes spiked around the time your period was due."

These are the "pattern moment" insights women are currently doing manually in spreadsheets — and they're the strongest possible retention hook because they explain something the user couldn't see before.

---

## 2. Messaging Improvements

### Terminology decision: "GP" → "your doctor" / "Health Report"

"GP" is used in Australia, UK, NZ and Ireland but not in the US (Primary Care Physician / PCP) or Canada (Family Doctor). To avoid localisation pain at international expansion:

- **User-facing document name:** "Health Report" (not "GP Health Report" or "GP Export"). Works across all markets and includes specialists — gynaecologists, endocrinologists, menopause specialists — not just primary care.
- **In-app and marketing copy:** Use **"your doctor"** everywhere. "Walk in with evidence, not apologies" works with "doctor." "Your doctor can't dismiss a timeline" is already correct.
- **Internal / code references:** "GP Export" can stay as the internal feature name for now — rename when internationalising.
- **Australian launch:** "GP" is fine in spoken/PR context where it resonates locally. UI copy should use "your doctor" from day one.

### What's landing well (keep)

- "30 seconds a day" — the single strongest UX claim
- "Walk in with evidence, not apologies" — the Health Report is the killer feature
- "Built for this, not adapted for this" — sharpest competitive positioning
- "Not another period tracker" — immediate differentiation

### Messaging pillars — finalised

Trimmed from 98 ICP angles to 7 distinct pillars. Each maps to a real user segment. Use these as the brief for all ad creative, landing page copy, and App Store listing.

> **Diagnostic language rule (applied throughout):** Never make diagnostic statements. Soften claims to questions. "This is hormones, not anxiety" → "What if it's not just anxiety?" Use "show your doctor" not "prove to your doctor."

---

#### Pillar 1 — The Evidence
**Segment:** gp_frustrated (women who feel dismissed by healthcare)
**Hook:** "Your doctor can't dismiss a timeline."

> Three months of symptoms.
> One clear document.
> Walk in with evidence, not apologies.

---

#### Pillar 2 — The Pattern
**Segment:** early_stage (confused, not yet connecting the dots)
**Hook:** "It's not random. It just looks that way until you start tracking."

> The bad weeks feel random until they aren't.
> 30 seconds a day. 14 days of data.
> Something starts to make sense.

---

#### Pillar 3 — The Rage / Identity
**Segment:** universal — strongest emotional hook across all segments
**Hook:** "Nobody warned you about the rage. You're not broken."

> Nobody warned you about the rage.
> Not a bad mood. Not stress.
> Actual rage — at the traffic, at the question, at nothing.
> You're not broken. You might be in perimenopause.

---

#### Pillar 4 — The HRT Question
**Segment:** hrt_considering (on HRT or considering it)
**Hook:** "Starting HRT is one thing. Knowing if it's working — that's something else."

> You started HRT.
> But how do you actually know if it's working?
> Track the before. Track the after. See the difference.

---

#### Pillar 5 — The Simplicity
**Segment:** tracker_fatigued (burned out by other wellness apps)
**Hook:** "30 seconds a day. Not a wellness routine."

> Not a journal. Not a mood board.
> 30 seconds. A few sliders. Done.
> The data builds quietly in the background.

---

#### Pillar 6 — Not Too Young
**Segment:** early_stage (dismissed due to age, often 35–42)
**Hook:** "38 is not too young. And your list of symptoms is not nothing."

> "You're too young for perimenopause."
> That doesn't make the brain fog less real.
> Or the rage. Or the 3am wakeups.
> 38 is not too young. Start tracking.

---

#### Pillar 7 — The After *(aspirational — use for retention, word-of-mouth, testimonial-style ads)*
**Segment:** universal — needed to balance pain-led messaging
**Hook:** "After 14 days, something clicked."

> After 14 days, something clicked.
> I could finally see what was happening.

> The first appointment where I wasn't explaining from scratch.
> She actually listened.

*Note: Every other pillar leads with pain. Pillar 7 shows what happens after tracking — critical for retention messaging and word-of-mouth. At least 1–2 ad executions should come from this pillar.*

---

**Age targeting — decided:** 35–55. The "too young" dismissal is the single most intense emotional trigger in ICP research. Revisit if data shows meaningful volume below 35.

---

## 3. Red Flags & Don'ts

### Medical claims risk

- "This Is Not Anxiety. This Is Hormones." — this is a diagnostic statement. The app explicitly says it's NOT a diagnostic tool. Soften to: "What if it's not just anxiety?"
- "Your body has been keeping receipts." — punchy, but veers into health-claim territory. The implication is "your body knows and we can prove it." Be careful.
- Any angle that says "prove it" to a doctor — the PDF is evidence for discussion, not proof of diagnosis. Use "show" instead of "prove."

### Expectation gaps (what's promised but not yet delivered)

| Messaging promise | Current app reality | Risk |
|---|---|---|
| "See the pattern" / "Pattern Recognition" | ✅ Weekly Snapshot with direction arrows (↑↓→) + symptom detail screen with trigger correlations ("alcohol days correlate with worse sleep") | **LOW** — core pattern promise is now delivered. Correlation insights are live per symptom. |
| "Is HRT working?" | A daily checkbox (factor toggle) | **HIGH** — 8+ messaging angles promise HRT tracking, but there's no event-level logging, no before/after comparison, no dose tracking. This will disappoint. |
| "Symptom timeline your GP can read" | ✅ GP Export built — professional PDF with per-symptom averages, severity, trends, factor frequencies, notes. Unlocks after 14 days. | **RESOLVED** — #1 acquisition hook is live. |

### Over-indexing on GP frustration

~60% of messaging angles target gp_frustrated. While this is the loudest signal, it means the app's entire value proposition hinges on "you'll use this at your next appointment." Women who DON'T have upcoming appointments (or whose doctors are already supportive) have no reason to stick with tracking. Build messaging for the daily utility of understanding yourself, not just the appointment payoff.

### Copy voice tension

The brand voice is "elegant, calm, lightly funny" but the ICP research has surfaced raw anger, desperation, and grief. The messaging angles are channeling this anger directly. For ads this tension might work. For in-app copy, stay calm. Don't let acquisition anger bleed into the daily experience.

---

## 4. ICP Keyword Match / Mismatch

| ICP keyword/phrase | Sulu match? | Action |
|---|---|---|
| "perimenopause symptom tracker" | Direct match | Primary ASO keyword |
| "too young for perimenopause" | Messaging only, not in product | Add educational content or "Did you know?" onboarding note |
| "is this perimenopause" | Good match to early_stage onboarding | Consider "Am I in perimenopause?" as a landing page / content angle |
| "perimenopause brain fog" | Direct match (tracked symptom) | Strong, keep |
| "perimenopause rage" / "irritability" | MISSING from app | Add irritability/rage as a symptom |
| "HRT tracking" / "is HRT working" | Weak match (just a checkbox) | Build HRT event logging |
| "period tracker perimenopause" | Positioning says "NOT a period tracker" | Correct — but add menstrual changes as a trackable symptom so you capture this search intent without being a period app |
| "GP appointment preparation" | Strong match (Health Report) | Make this a landing page SEO target for AU/UK. Use "doctor appointment preparation" for US expansion. |
| "menopause app" | Partial match | Add "perimenopause AND menopause" to store listing. Many women search "menopause" when they mean peri. |
| "perimenopause anxiety" | Bundled in mood, not standalone | Split anxiety out as a separate symptom |
| "symptom diary for doctor" | Direct match | Use this exact phrase in ASO |
| "perimenopause supplements" | Not tracked | Consider supplement change marker |

---

## 5. MVP vs Premium Features

### MVP (Free — get users in the door)

| Feature | Status | Why free |
|---|---|---|
| Daily Check-In (symptoms + today's factors + notes) | ✅ Built | Core habit loop |
| Symptom Selection (all 12 free, recommendation varies by journey stage) | ✅ Built | Personalization |
| Basic Timeline (7/14/30 days, averages, Skia charts) | ✅ Built | Immediate visual value |
| Weekly Snapshot (direction arrows, week-over-week comparison) | ✅ Built | "See the pattern" promise |
| Symptom Detail (30-day trends, trigger correlations) | ✅ Built | Deeper pattern insights per symptom |
| Health Report — Symptom Summary (free tier) | ✅ Built | THE acquisition hook. Must be free. Generates after 14 days of tracking. Regeneration limit: once every 7 days. Includes per-symptom averages, severity trends, factor frequencies, and notes. Always teases Pattern Insights (see below). |
| Push notification reminders (daily, custom time) | ✅ Built | Retention driver |
| Email auth (sign-up, sign-in, password reset) | ✅ Built | Wider audience beyond OAuth |
| 4-week symptom review prompt | Not built | Every 4 weeks, when the user opens the app, a light check-in screen asks: "Want to review your symptom list?" with options to add or remove. Keeps tracking relevant as symptoms evolve. Not a forced flow — easy to dismiss. |

### Premium tier — "Sulu Pro" or "Sulu+"

| Feature | ICP justification | Pricing signal |
|---|---|---|
| Health Report — Pattern Insights (premium tier) | Unlimited report generation. Adds to the free Symptom Summary: data-driven pattern analysis, personalised conversation starters for the doctor appointment, cycle correlations. **Not "Clinical Insights" — too medical. "Pattern Insights" is the correct user-facing label.** Tease mechanic: (A) blurred Pattern Insights section at the bottom of every free report, showing "X patterns identified in your data" with a lock; (B) one free conversation prompt surfaces, with remaining ones gated — "2 more conversation starters available in Premium." Specific enough to feel real, non-blocking, never vague. | Strong |
| HRT Treatment Timeline — log start dates, dose changes, see before/after symptom comparison | 8+ messaging angles about "is HRT working?" — high willingness to pay for clarity | Strong |
| Pattern Correlations — "On days you marked alcohol, sleep was 1.2 points worse" with statistical confidence | "The Pattern Moment" angle — women are desperate for connections they can't see | Strong |
| Cycle Overlay — correlate symptoms with cycle day/phase | Research shows women manually doing this in spreadsheets | Medium-Strong |
| Extended History — 90/180/365 day views | "I've been tracking for 4 years" — long-term users want long-term views | Medium |
| Custom symptoms and factors — add your own beyond the core 12 symptoms and 7 factors (up to 5 additional each) | Power users want to track what matters to them specifically. Keeps the free tier clean while rewarding committed trackers. | Medium |
| Supplement Tracker — log what you're taking, see if it correlates | "The Supplement Spiral" — women spending money on supplements with no feedback | Medium |
| Multiple Export Formats — customizable GP reports, specialist formats | Differentiation for serious self-advocates | Low-Medium |
| Data Export (CSV/JSON) | Low demand but important for trust — "my data is mine" | Should probably stay free (trust signal) |

**Pricing — decided:** $4.99/month or $49.99/year. The free tier needs to be genuinely useful (Health Report included) so that premium feels like "more insight" not "unlock the basic features."

---

## Summary: Decisions & Actions

### ✓ Implemented (code complete)

1. ✅ **Symptom list** — expanded from 9 to 12, ordered by ICP signal strength. Anxiety and Irritability/rage split out from Mood. Night sweats separated from Hot flashes. Menstrual changes restored. Heart palpitations added. See Section 1 for full list. *Implemented in `constants/symptoms.ts` with icons, descriptions, and slider labels.*
2. ✅ **Today's factors** — renamed from "markers" / "change markers" throughout. Updated list: HRT (from Medication), Stressful Day (from High Stress), Exercise, Alcohol, Supplement change (new), Illness/travel/disruption (new), Period started today (new). Caffeine removed. *Implemented in `constants/markers.ts`.*
3. ✅ **Age targeting** — widened from 40–55 to **35–55**. Revisit if data shows meaningful volume below 35.
4. ✅ **GP Export (free)** — professional PDF with per-symptom averages, severity levels, trends, factor frequencies, and recent notes. Unlocks after 14 days of tracking with progress bar. Uses expo-print + expo-sharing. *Implemented in `lib/gpExport.ts` + `hooks/useGPExport.ts`.*
5. ✅ **Weekly Snapshot** — direction arrows comparing current vs prior week averages (↑ worse, ↓ better, → stable within ±0.3). Shows up to 7 tracked symptoms. Accessible from trends tab with ≥14 days of data. *Implemented in `components/timeline/WeeklySnapshot.tsx` + `app/(auth)/weekly-insights.tsx`.*
6. ✅ **Symptom and factor descriptions** — all 12 symptoms and 7 factors done. See Section 1. Factor descriptions appear inline in daily check-in and onboarding.
7. ✅ **Symptom tracking amount** — all 12 symptoms free to track, no cap. Recommendation varies by journey stage (3/5/7 based on onboarding answers). Custom symptoms (beyond 12) remain premium.
8. ✅ **Notes section** — free-text field on every daily check-in. "Anything else on your mind?" placeholder. 200-character limit. Appears in GP export. *Implemented in `components/checkin/NotesInput.tsx`.*
9. ✅ **Onboarding** — 7-step flow (exceeds original 5): consent → age → stage → HRT → intent → symptom selection → notifications. Stage-based guidance for symptom count. Progressive bar. *Implemented in `app/(auth)/onboarding/`.*
10. ✅ **Daily check-in** — core habit loop with symptom sliders (0–3 severity), factor toggles (2-column layout), notes input, sticky save button with state feedback, and unsaved-changes guard. *Implemented in `app/(auth)/(tabs)/log.tsx`.*
11. ✅ **Basic timeline (7/14/30 days)** — range selector, calendar strip with entry indicators, Skia-based trend charts (primary + secondary symptoms), per-symptom averages, day detail card. *Implemented in `app/(auth)/(tabs)/index.tsx`.*
12. ✅ **Push notification reminders** — daily repeating notification with 17 time options (6 AM–10 PM). Stores time in profile. Expo Go guard. Disable option in settings. *Implemented in `lib/notifications.ts` + onboarding step.*
13. ✅ **Email auth** — sign-up (email + password + name), sign-in, password reset. Email format validation. Hardened against sign-up email enumeration. Branded Supabase email templates. *Implemented in `app/(public)/email-login.tsx` + `lib/auth.ts`.*
14. ✅ **Symptom detail screen** — 30-day trend chart per symptom, trigger correlations (which factors correlate with better/worse), gentle advice text. Requires ≥3 check-ins. *Implemented in `app/(auth)/symptom-detail.tsx`.*
15. ✅ **Logo** — animated dual-blob S monogram. Multiple formats: icon.png, adaptive-icon.png, splash-icon.png, favicon.png, feature-graphic.png. *In `assets/`.*
16. ✅ **Design system** — Playfair Display font (bold/semibold), full typography scale (display → caption), warm palette (cream #FAF6F0, terracotta #C47358, plum #4A2040, sage #A3B18A, sand #EDE4D6), severity spectrum, spacing/radii/shadow system. *Implemented in `constants/designTokens.ts`.*

### Still to do — product

17. **4-week symptom review prompt** — full spec below. *Not yet implemented.*

---

#### Feature spec: 4-week symptom review prompt

**Purpose:** Symptoms change over time. A woman who started tracking hot flashes and brain fog three months ago may now have those under control but be struggling with joint pain and low mood. Keeping the tracked list relevant is critical to data quality and retention. This prompt surfaces at the right moment to make that easy.

**Tier:** Free.

---

**Trigger logic**

- Fires every 4 weeks from the date of last review or last dismiss — not from sign-up date
- Only triggers when the user opens the app (not via push notification)
- Requires at least 14 days of logged data before the first trigger (no point reviewing a list they've barely used)
- Does not fire if the user has opened the symptom selection screen themselves in the last 4 weeks (they've already reviewed)

---

**Screen design**

Full screen — not a bottom sheet or modal. This is a moment, not a nudge. The user should feel it's worth a few seconds, not swipe it away reflexively.

Layout:
- Calm header: *"Time to check in on your symptom list."*
- Subtext: *"You've been tracking for [X] weeks. Some symptoms might have shifted."*
- Current symptom list, displayed as chips or rows
- Low-logging flag: any symptom not logged in the last 3 weeks is surfaced with a note — *"You haven't logged this in 3 weeks — still relevant?"* This makes the decision informed, not arbitrary
- Two actions per flagged symptom: **Keep** / **Remove**
- "Add a symptom" option at the bottom for anything new
- Primary CTA: *"Done"*
- Secondary: *"Remind me later"* (resets the 4-week clock from today)

---

**Copy (app voice)**

| Element | Copy |
|---|---|
| Header | "Time to check in on your symptom list." |
| Subtext | "You've been tracking for [X] weeks. Some things might have shifted." |
| Low-logging flag | "You haven't logged this in 3 weeks — still relevant?" |
| Add prompt | "Something new showing up? Add it." |
| Primary CTA | "Done" |
| Secondary CTA | "Remind me later" |
| After save | "Updated." |

Copy rules: no cheerleading, no congratulations. Passes the 3am test.

---

**Dismiss behaviour**

- "Done" with no changes: counts as a valid review. Clock resets for 4 weeks.
- "Remind me later": clock resets for 4 weeks from today.
- Hard back / close without action: does not count as a review. Prompt re-shows on next app open within the same trigger window (within 7 days of trigger date), then resets to 4 weeks.

---

**Edge cases**

| Scenario | Behaviour |
|---|---|
| User has only 1 symptom tracked | Show prompt normally — they may want to add |
| User logs all symptoms regularly | Show prompt with no low-logging flags — simple confirmation screen |
| User removes all symptoms | Block — must keep at least 1. Show: *"Keep at least one symptom to continue tracking."* |
| User is mid check-in | Do not interrupt. Show on next app open. |

### Still to do — messaging

18. ✅ **Messaging pillars — finalised.** Trimmed to 7 pillars (6 pain-led + 1 aspirational "The After"). Full copy written for each. Diagnostic language rule applied throughout: soften claims to questions ("What if it's not just anxiety?"), use "show" not "prove." See Section 2 for complete pillar briefs.
19. ✅ **Tone of voice — two distinct voices, documented separately.** See `docs/tone-of-voice.md`. Ad voice (ads, landing page, App Store listing) and app voice (daily check-in, notifications, report copy, onboarding) are fully documented with principles, examples, side-by-side comparisons, and a quick reference table.

### Parked for v2

- Period ended / last day of period (companion to Period started today)
- Vaginal dryness / discomfort, Libido changes, Weight changes / bloating (sensitive symptoms requiring careful UI handling)
- **Cyclical progesterone reminder (premium)** — if a woman has indicated she's on HRT, offer a smart reminder for when to start Prometrium (cyclical progesterone, typically taken days 14–28 of a 28-day cycle). Assumption: she's on a standard cyclical protocol. Requires HRT event logging to be built first. High value for women navigating HRT — removes the mental load of tracking the progesterone window manually.
