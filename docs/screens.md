# Sulu — Screen Inventory

All screens in the app, grouped by area. The tab bar has 5 tabs: **Calendar | Insights | Log (center FAB) | Learn | Profile**.

---

## 1. Public (Unauthenticated)

### 1.1 Welcome Screen
**Route:** `(public)/index`

The landing page users see before signing in.

- Large "Sulu" logo text with an organic blob illustration
- Tagline: *"A small daily check-in."* / *"Notice how your symptoms change over time. No advice. No fixing. Just a clearer record."*
- **Continue with Apple** button (iOS only, black pill)
- **Continue with Google** button (white pill with Google logo)
- "or" divider
- **Sign in with email** text link
- Footer: "By continuing, you agree to our Terms and Privacy Policy"

### 1.2 Email Login Screen
**Route:** `(public)/email-login`

Dual-mode email auth screen — toggles between sign-in and sign-up.

- Back arrow button (top-left)
- Heading: "Welcome back" (sign-in) / "Create account" (sign-up)
- **Name** field (sign-up only)
- **Email** field
- **Password** field (min 6 characters)
- **Forgot password?** link (sign-in only) — sends reset email
- Toggle: "Don't have an account? Sign up" / "Already have an account? Sign in"
- **Sign in / Create account** button (sticky at bottom)

---

## 2. Onboarding (Post-Auth, First-Time Users)

Linear flow: Consent → Intent → Age → Stage → HRT → Symptoms → Notifications

### 2.1 Consent Screen
**Route:** `(auth)/onboarding/consent`

Privacy and data consent.

- Shield icon
- Heading: *"Your privacy is our priority"*
- Three paragraphs explaining data handling, encryption, and no-sell policy
- Checkbox: "I agree to the Terms of Service and Privacy Policy, and I consent to the data processing"
- **Continue** button (disabled until checkbox is ticked)
- Tapping "Terms of Service" opens in-app legal modal; "Privacy Policy" opens web browser

### 2.2 Intent Screen
**Route:** `(auth)/onboarding/intent`

Asks why the user is here. Multi-select.

- Target icon
- Heading: *"What do you want to achieve with Sulu?"*
- Subtitle: *"Pick as many as feel right."*
- 4 cards with toggle switches:
  - "I've been having symptoms I can't explain"
  - "I want to understand my patterns over time"
  - "I want something concrete to show my doctor"
  - "I'm not sure — just curious"
- **Continue** button

### 2.3 Age Screen
**Route:** `(auth)/onboarding/age`

Birth year input.

- Cake icon
- Heading: *"What year were you born?"*
- Large numeric text input (4 digits, centered, e.g. "1978")
- Validates age between 18–99
- **Continue** button
- **Skip this step** link

### 2.4 Stage Screen
**Route:** `(auth)/onboarding/stage`

Menstrual cycle stage. Single-select with radio buttons.

- Activity icon
- Heading: *"Where are you right now?"*
- Subtitle: *"There's no wrong answer."*
- 5 cards:
  - "Still having regular periods"
  - "Periods are changing"
  - "Periods have mostly stopped"
  - "No periods for over a year"
  - "Honestly not sure"
- **Continue** button

### 2.5 HRT Screen
**Route:** `(auth)/onboarding/hrt`

Hormone Replacement Therapy status. Single-select with radio buttons.

- Pill icon
- Heading: *"Are you taking Hormone Replacement Therapy (HRT)?"*
- 4 cards:
  - "Yes, currently taking HRT"
  - "No"
  - "Just started"
  - "Thinking about it"
- **Continue** button

### 2.6 Symptoms Screen
**Route:** `(auth)/onboarding/symptoms`

Choose which symptoms to track. Multi-select.

- Heading: *"What do you want to understand better?"*
- Guidance text varies based on selected cycle stage (e.g. "Start with 3", "Most people find 5 a good starting point")
- List of all 12 ICP-ordered symptoms, each as a card with icon, label, description, and toggle switch
- Counter text: "3 selected — looking good"
- **Continue with N symptom(s)** button

### 2.7 Notifications Screen
**Route:** `(auth)/onboarding/notifications`

Daily reminder setup. Final onboarding step — saves all onboarding data to profile.

- Bell icon
- Heading: *"Stay on track"*
- Subtitle: *"A gentle daily nudge to log how you're feeling."*
- Time picker: list of hourly slots from 6:00 AM to 10:00 PM (cards with checkmarks)
- **Set reminder** button
- **Skip for now** link
- On completion: writes onboarding data to Supabase profile, navigates to main tabs

---

## 3. Main Tabs (Authenticated)

### 3.1 Insights (Timeline) Tab — Home
**Route:** `(auth)/(tabs)/index`
**Tab label:** Insights
**Tab icon:** TrendingUp

The main dashboard showing trends and history.

- Header: "Your timeline" with current month/year
- Calendar icon button (top-right) — navigates to Calendar tab
- **Calendar strip** — horizontal scrollable week view with date dots for entries
- **Range selector** — 7 / 14 / 30 days (Premium: "All")
- **Trend line chart** — plots top 2 most-active tracked symptoms with color legend
- **Day detail card** — shows symptom values for the selected date
- "Start today's check-in" prompt card (if no entry for today)
- **Weekly snapshot** — summary of past 14 days (shown after 14+ entries)
- Empty state: sprout icon, "Not much to see yet"

### 3.2 Calendar Tab
**Route:** `(auth)/(tabs)/calendar`
**Tab label:** Calendar
**Tab icon:** Calendar

Full month calendar with entry editing.

- Header: "Calendar"
- **Month calendar** — grid with navigation arrows, dots for days with entries
  - Today has a coral border ring
  - Selected date is highlighted coral (or grey if locked)
  - Dates older than 30 days are dimmed/locked for free users
- **Selected date label** — e.g. "Tuesday, Feb 25"
- **Premium lock banner** — "Editing entries older than 30 days requires Premium" with Upgrade button (shown for locked dates)
- **Symptom sliders** — same as Log screen, for the selected date
- **Factor toggles** — same as Log screen
- **Notes** text input
- Sticky **Save entry / Saved / Upgrade to edit** button

### 3.3 Log Tab (Center FAB)
**Route:** `(auth)/(tabs)/log`
**Tab label:** Log
**Tab icon:** Plus (raised coral circle FAB with spring animation + haptics)

Today's daily check-in form.

- Header: "How was today?" with current date (e.g. "Saturday, Mar 1")
- Calendar icon badge (top-right)
- **Section 1 — Symptoms:** Sliders (0–10) for each tracked symptom. Each slider shows the symptom label with a coral-colored icon.
- **Section 2 — Factors:** 7 toggle cards in a 2-column grid (e.g. Exercise, Stress, Alcohol, etc.)
- **Section 3 — Notes:** Free-text input
- Sticky **Save today / Saving... / Saved!** button
- Unsaved changes prompt when navigating away
- Auto-navigates to Insights tab after saving

### 3.4 Learn Tab
**Route:** `(auth)/(tabs)/learn`
**Tab label:** Learn
**Tab icon:** BookOpen

Educational articles placeholder.

- Header: "Learn" with subtitle "Understanding your body through perimenopause"
- BookOpen icon badge (top-right)
- Intro text: "Evidence-based articles written with care — so you can feel informed, not overwhelmed."
- 3 teaser cards, each with:
  - GraduationCap icon
  - Title (e.g. "What's actually happening during perimenopause?")
  - Description
  - "Coming soon" badge
  - Chevron arrow (non-functional)

### 3.5 Profile Tab
**Route:** `(auth)/(tabs)/profile`
**Tab label:** Profile
**Tab icon:** User

Settings, account management, and subscription.

- Header: "Profile" with Cloud icon badge
- **User greeting**: Avatar circle (with Premium star badge if subscribed), "Good morning/afternoon/evening, [Name]", "SULU PREMIUM" or "SULU MEMBER" badge
- **Subscription section**:
  - Premium users: "Sulu Premium — Active" row (taps to manage subscription)
  - Free users: Upsell card with "Upgrade to Premium" heading, description, and "Explore Premium" button
- **Preferences group**:
  - Tracked symptoms → count, opens symptom editor modal
  - Daily reminder → current time or "Off", opens time picker modal
- **Data & Reports group**:
  - Export summary for GP → generates PDF report (basic for free, professional for Premium)
  - Export data (CSV) → "Coming soon"
- **Account group**:
  - Privacy & Security → opens privacy info modal
  - Delete account → confirmation alert, schedules 7-day deletion
- **Support group**:
  - Share feedback → opens feedback form modal
- **Sign out** button
- Version number footer

#### Profile Sub-Modals:
- **Symptom Editor Modal** (pageSheet): Full list of 12 symptoms with icons, labels, descriptions, and toggle switches. "Save Preferences" sticky button.
- **Notification Time Picker Modal** (bottom sheet): "Off" option + hourly time slots 6 AM–10 PM. Current selection highlighted.
- **Privacy & Security Modal** (pageSheet): Shield icon, privacy text, links to Privacy Policy (web) and Terms of Service (in-app modal).
- **Feedback Form Modal** (pageSheet): Feedback submission form.
- **Legal Modal**: Renders Terms of Service or Privacy Policy text.

---

## 4. Detail Screens (Authenticated, No Tab)

### 4.1 Symptom Detail Screen
**Route:** `(auth)/symptom-detail?symptomId=...`

Deep-dive into a single symptom's trends and correlations.

- Back arrow + symptom name header + "Symptom Detail" label
- **Trend line chart** — 30-day view for this symptom
- **Personal Insight** card — generated text about the symptom's pattern (e.g. "Hot flushes tend to be stronger on days with poor sleep")
- **Common Triggers** — pill badges showing correlated factors (e.g. "Poor Sleep" in coral, "Exercise" in green)
- **Gentle Advice** — sage-colored card with a supportive quote
- Empty state: "Not enough data yet" (needs 3+ entries)

### 4.2 Weekly Insights Screen
**Route:** `(auth)/weekly-insights`

Week-over-week comparison of symptoms and factors.

- Back arrow + "Weekly Insights" header with date range
- **Summary Hero** — overall summary of the week
- **What changed over time** — symptom change rows comparing this week vs last week (arrows up/down/stable)
- **What showed up on stronger days** — marker correlation cards
- **Gentle Reminder** — motivational card with sparkles icon
- Empty state: "Not enough data yet" (needs 3+ current week entries and 1+ prior week)

### 4.3 Pending Deletion Screen
**Route:** `(auth)/pending-deletion`

Shown when a user has scheduled account deletion.

- Clock icon
- Large countdown number (days remaining)
- "Your account is scheduled for deletion on [date]"
- Warning: "After this date, all your data will be permanently removed"
- "Changed your mind?" section
- **Cancel deletion** button (primary)
- **Sign out** button (ghost)

---

## 5. Error Screen

### 5.1 Not Found
**Route:** `+not-found`

404 screen for invalid routes.

---

## Navigation Summary

```
(public)/
  index ................... Welcome (login options)
  email-login ............. Email sign-in / sign-up

(auth)/
  onboarding/
    consent ............... Privacy consent + terms
    intent ................ Why are you here? (multi-select)
    age ................... Birth year input
    stage ................. Cycle stage (single-select)
    hrt ................... HRT status (single-select)
    symptoms .............. Symptom selection (multi-select)
    notifications ......... Daily reminder setup → completes onboarding

  (tabs)/
    calendar .............. Month calendar + entry editor
    index ................. Insights / Timeline (home tab)
    log ................... Daily check-in (center FAB)
    learn ................. Articles (coming soon)
    profile ............... Settings, subscription, account

  symptom-detail .......... Single symptom deep-dive
  weekly-insights ......... Week-over-week comparison
  pending-deletion ........ Account deletion countdown
```
