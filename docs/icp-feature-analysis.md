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

### What's landing well (keep)

- "30 seconds a day" — the single strongest UX claim
- "Walk in with evidence, not apologies" — GP Export is the killer feature
- "Built for this, not adapted for this" — sharpest competitive positioning
- "Not another period tracker" — immediate differentiation

### What needs fixing

**A) Tighten from 98 angles down to ~6 pillars.** The ICP output generated too many near-duplicates. The 6 distinct angles that map to real segments:

| Pillar | Segment | Best hook |
|---|---|---|
| The Evidence | gp_frustrated | "Your doctor can't dismiss a timeline." |
| The Pattern | early_stage | "It's not random. It just looks that way until you start tracking." |
| The Rage / Identity | universal | "Nobody warned you about the rage. You're not broken." |
| The HRT Question | hrt_considering | "Starting HRT is one thing. Knowing if it's working — that's something else." |
| The Simplicity | tracker_fatigued | "30 seconds a day. Not a wellness routine." |
| Not Too Young | early_stage | "38 is not too young. And your list of symptoms is not nothing." |

**B) Add positive/aspirational angles.** Every angle currently leads with pain. For retention and word-of-mouth, need at least 1-2 angles about what happens AFTER tracking:

- "After 14 days, something clicked. I could finally see what was happening."
- "The first GP appointment where I wasn't explaining from scratch."

**C) Widen age targeting.** The GTM says 40-55 but the research is full of 33-39 year olds. The "too young" dismissal is the single most intense emotional trigger. **Updated target: 35–55** (revisit if data shows meaningful volume below 35).

---

## 3. Red Flags & Don'ts

### Medical claims risk

- "This Is Not Anxiety. This Is Hormones." — this is a diagnostic statement. The app explicitly says it's NOT a diagnostic tool. Soften to: "What if it's not just anxiety?"
- "Your body has been keeping receipts." — punchy, but veers into health-claim territory. The implication is "your body knows and we can prove it." Be careful.
- Any angle that says "prove it" to a doctor — the PDF is evidence for discussion, not proof of diagnosis. Use "show" instead of "prove."

### Expectation gaps (what's promised but not yet delivered)

| Messaging promise | Current app reality | Risk |
|---|---|---|
| "See the pattern" / "Pattern Recognition" | Only week-over-week averages + direction arrows | **MEDIUM** — users expect actual correlation insights ("sleep was worse on alcohol days"). Need at minimum the marker correlation in the Snapshot to land. |
| "Is HRT working?" | A daily checkbox (marker_medication) | **HIGH** — 8+ messaging angles promise HRT tracking, but there's no event-level logging, no before/after comparison, no dose tracking. This will disappoint. |
| "Symptom timeline your GP can read" | GP Export is designed but NOT built | **HIGH** — this is the #1 acquisition hook across all angles. It's locked behind Phase 6 in the delivery plan. Prioritize it. |

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
| "GP appointment preparation" | Strong match (GP Export) | Make this a landing page SEO target |
| "menopause app" | Partial match | Add "perimenopause AND menopause" to store listing. Many women search "menopause" when they mean peri. |
| "perimenopause anxiety" | Bundled in mood, not standalone | Split anxiety out as a separate symptom |
| "symptom diary for doctor" | Direct match | Use this exact phrase in ASO |
| "perimenopause supplements" | Not tracked | Consider supplement change marker |

---

## 5. MVP vs Premium Features

### MVP (Free — get users in the door)

| Feature | Status | Why free |
|---|---|---|
| Daily Check-In (symptoms + today's factors) | Built | Core habit loop |
| Symptom Selection (all 12 free, recommendation varies by journey stage) | Built | Personalization |
| Basic Timeline (7/14/30 days, averages) | Built | Immediate visual value |
| Weekly Snapshot (direction arrows) | Designed, not built | "See the pattern" promise |
| GP Export (PDF after 14 days) | Designed, not built | THE acquisition hook. Must be free. If gated, the core value prop is lost. |
| Push notification reminders | Designed, not built | Retention driver |
| 4-week symptom review prompt | Not built | Every 4 weeks, when the user opens the app, a light check-in screen asks: "Want to review your symptom list?" with options to add or remove. Keeps tracking relevant as symptoms evolve. Not a forced flow — easy to dismiss. |

### Premium tier — "Sulu Pro" or "Sulu+"

| Feature | ICP justification | Pricing signal |
|---|---|---|
| HRT Treatment Timeline — log start dates, dose changes, see before/after symptom comparison | 8+ messaging angles about "is HRT working?" — high willingness to pay for clarity | Strong |
| Pattern Correlations — "On days you marked alcohol, sleep was 1.2 points worse" with statistical confidence | "The Pattern Moment" angle — women are desperate for connections they can't see | Strong |
| Cycle Overlay — correlate symptoms with cycle day/phase | Research shows women manually doing this in spreadsheets | Medium-Strong |
| Extended History — 90/180/365 day views | "I've been tracking for 4 years" — long-term users want long-term views | Medium |
| Custom symptoms and factors — add your own beyond the core 12 symptoms and 7 factors (up to 5 additional each) | Power users want to track what matters to them specifically. Keeps the free tier clean while rewarding committed trackers. | Medium |
| Supplement Tracker — log what you're taking, see if it correlates | "The Supplement Spiral" — women spending money on supplements with no feedback | Medium |
| Multiple Export Formats — customizable GP reports, specialist formats | Differentiation for serious self-advocates | Low-Medium |
| Data Export (CSV/JSON) | Low demand but important for trust — "my data is mine" | Should probably stay free (trust signal) |

**Pricing suggestion:** The ICP research shows these are women with disposable income, already spending on supplements, doctor visits, and other apps. A $4.99-7.99/month or $39.99-59.99/year premium tier is reasonable. The free tier needs to be genuinely useful (GP Export included) so that premium feels like "more insight" not "unlock the basic features."

---

## Summary: Decisions & Actions

### ✓ Decided — needs code implementation

1. **Symptom list** — expanded from 9 to 12, ordered by ICP signal strength. Anxiety and Irritability/rage split out from Mood. Night sweats separated from Hot flashes. Menstrual changes restored. Heart palpitations added. See Section 1 for full list.
2. **Today's factors** — renamed from "markers" / "change markers" throughout. Updated list: HRT (from Medication), Stressful Day (from High Stress), Exercise, Alcohol, Supplement change (new), Illness/travel/disruption (new), Period started today (new). Caffeine removed.
3. **Age targeting** — widened from 40–55 to **35–55**. Revisit if data shows meaningful volume below 35.

### Still to do — product & messaging

4. **Keep GP Export free** — it's the acquisition engine. Gate premium on correlation depth, HRT tracking, and extended history. Currently designed but not built — prioritise.
5. **Build the Weekly Snapshot** — delivers on the "see the pattern" promise that 80%+ of messaging relies on. Currently designed but not built.
6. **Trim messaging to 6 pillars** — add at least 1 positive/aspirational angle ("after 14 days, something clicked"). Soften diagnostic claims to questions ("What if it's not just anxiety?").
7. ✓ **Symptom and factor descriptions written** — all 12 symptoms and 7 factors done. See Section 1. Factor descriptions appear as hover tooltips on the daily check-in, not always visible.
8. ✓ **Symptom tracking amount — decided.** All 12 symptoms are free to track. No cap. Gate premium on what you do with the data (correlations, HRT tracking, extended history) — not on how much data she can log. Recommendation varies by journey stage, pulled from onboarding answers:
    - New to symptoms / not sure → *"Start with 3. You can always add more."*
    - Periods changing / established → *"Most people find 5 a good starting point."*
    - Long-term / knows her symptoms → *"Pick up to 7. Fewer makes patterns clearer."*

    She can always change her symptom selection. Custom symptoms (beyond the 12) remain a premium feature.
9. ✓ **Notes section — decided.** Include a free-text notes field on every daily check-in screen. Always optional, always available. Shown as a small "Add a note" link at the bottom — below sliders and factors. Tapping expands a short text input (200 character limit to keep it brief). Invisible if you don't want it, there when you do. Notes appear alongside data in the GP export. Do not make it feel like a journal — it's context, not a diary.
10. ✓ **Onboarding questions — decided.** Five questions, in this order:

    1. **Age** — single input. Used to contextualise insights and framing (e.g. "not too young" acknowledgement for 35–39 year olds).
    2. **Where are you right now?** — cycle/stage in plain language, not clinical terms:
       - Still having regular periods
       - Periods are changing — irregular, heavier, lighter
       - Periods have mostly stopped
       - No periods for over a year
       - Honestly not sure
    3. **Are you currently taking HRT?** — yes / no / just started / thinking about it. Pre-selects HRT factor and surfaces HRT tracking if relevant.
    4. **What brought you here?** — intent question, changes which features are highlighted first:
       - I've been having symptoms I can't explain
       - I want to understand my patterns over time
       - I want something concrete to show my doctor
       - I'm not sure what's happening
    5. **Symptom selection** — flows naturally as the final onboarding step. Women choose from the 12 symptoms using the selection screen (labels + hover descriptions).

    *Reference: Balance menopause app (balance-menopause.com) asks age, cycle status, and symptoms in onboarding. Sulu uses the same structure but in the app voice — a conversation, not a clinical intake form. Each question must visibly change the experience based on the answer.*
11. **Plan individual screens** — map out each screen in the app flow with content, interactions, and edge cases before dev picks it up.

### Still to do — branding & design

11. **Create a logo** — needed before any public-facing materials or app store presence.
12. **Define font and colour scheme** — establish the visual identity to underpin the "elegant, calm" brand voice.
13. **Tone of voice — two distinct voices, document separately:**
    - **Ad voice** (ads, landing page, app store listing) — rawer, emotionally direct, stops the scroll. Leans into the anger, the dismissal, the "nobody warned you." This is where hooks like "Nobody warned you about the rage" and "Walk in with evidence, not apologies" live. Higher emotional charge, shorter sentences, designed to resonate fast.
    - **App voice** (daily check-in, notifications, patterns, GP export) — calm, intelligent, direct. Dry wit allowed. Never cheerful, never clinical, never performative. Speaks to wise women who are dealing with it and don't need hand-holding. Passes the 3am test. These are different jobs. The ad voice gets women in the door. The app voice keeps them there. Do not mix them.

### Parked for v2

- Period ended / last day of period (companion to Period started today)
- Vaginal dryness / discomfort, Libido changes, Weight changes / bloating (sensitive symptoms requiring careful UI handling)
