# Sulu — GTM Pipeline 1: ICP Research Scraper

**Product:** Sulu — daily symptom tracking app for women in perimenopause
**Runtime:** Local TypeScript scripts executed via Claude Code
**Cost per run:** ~$0.30 (Claude API only; all scrapers use free tiers)

---

## ICP Segments

Primary ICP is women 40-55 experiencing perimenopause — particularly those whose doctors have dismissed their symptoms and who want evidence for GP conversations.

| Tier | Segment | Key Insight |
|------|---------|-------------|
| 1A | GP Frustrated | Strongest emotional driver; doctors dismissed symptoms as "just anxiety" |
| 1B | Early Stage | High uncertainty; "is this perimenopause?"; need validation and patterns |
| 1C | HRT Considering | Actively researching treatment; need evidence to bring to GP |
| 1D | Tracker Fatigued | Tried period trackers/health apps but found them overwhelming or irrelevant |
| 2 | Established | Already managing symptoms; may already have workarounds; lower urgency |

Each pain point and messaging angle is tagged with segments: `early_stage`, `established`, `hrt_considering`, `gp_frustrated`, `tracker_fatigued`, `universal`.

---

## Setup

```bash
cp .env.example .env
# Fill in:
#   EXA_API_KEY     — https://exa.ai (free tier, 1000 searches/month)
#   ANTHROPIC_API_KEY — for pain point analysis

npm install
```

---

## Pipeline Scripts

### 1.1 — Exa Scraper (`scrape-reddit-exa.ts`)

**Primary data source.** Exa indexes Reddit, LinkedIn, and Quora. We use `site:` scoped queries to search all three.

- ~50 queries across all ICP segments + LinkedIn/Quora
- Uses `searchAndContents` with `text: true` and `highlights: true`
- 500ms delay between queries; ~30s total runtime
- Output: `01-icp-research/outputs/exa-raw-YYYY-MM-DD.json`

Key subreddits targeted:
- **Primary:** r/Menopause, r/Perimenopause
- **Women's health:** r/WomensHealth, r/AskWomenOver40, r/TwoXChromosomes
- **Cross-platform:** LinkedIn (workplace impact), Quora (general questions)

### 1.2 — Reddit Public JSON Fallback (`scrape-reddit-json.ts`)

**Fallback / supplement.** Uses Reddit's public `.json` endpoints (no auth required).

- 12 subreddits: perimenopause communities first, then women's health, then broader
- 18 search terms (perimenopause-specific + tracking + emotional)
- 2s delay between requests (non-negotiable); 60s backoff on 429
- Fetches top 5 posts per search + top 10 comments each
- ~15-20min runtime
- Output: `01-icp-research/outputs/reddit-json-raw-YYYY-MM-DD.json`

### 1.3 — Hacker News Scraper (`scrape-hn.ts`)

**Supplement.** HN Algolia API — free, no auth, generous limits.

- ~26 queries: perimenopause, health tracking, femtech, quantified self
- Searches both stories and comments
- 500ms between queries; ~15s runtime
- Output: `01-icp-research/outputs/hn-raw-YYYY-MM-DD.json`

### 1.4 — Pain Point Analyzer (`analyze-pain-points.ts`)

**Analysis engine.** Merges all raw data, deduplicates by URL, batches into chunks of 20, sends each to Claude for analysis.

- Tags every pain point with applicable ICP segments
- Generates segment-aware messaging angles (warm, adult tone — never clinical or wellness-preachy)
- Prioritizes GP frustration and doctor dismissal as strongest emotional drivers

Outputs:
- `pain-points-ranked.json` — ranked by frequency, tagged with segments
- `messaging-angles.md` — human-readable with segment labels and verbatim quotes
- `ad-source-material.json` — headlines, hooks, body copy, CTAs per segment

---

## Execution

```bash
# Primary — run first, ~30s
npx ts-node 01-icp-research/scrape-reddit-exa.ts

# Supplement — optional, ~15-20min, fills gaps
npx ts-node 01-icp-research/scrape-reddit-json.ts

# Supplement — HN content, ~15s
npx ts-node 01-icp-research/scrape-hn.ts

# Analysis — merges all sources, ~2min (Claude API calls)
npx ts-node 01-icp-research/analyze-pain-points.ts
```

### CLI Flags (all scripts)

```
--limit N          # Process only N queries (for testing)
--output-dir DIR   # Override output directory
--dry-run          # Show what would be fetched, don't call APIs
```

Analyzer-only flags:
```
--skip-exa         # Skip Exa data in analysis
--skip-reddit      # Skip Reddit JSON data
--skip-hn          # Skip HN data
```

---

## Cost Estimate

| Source | Free Tier | Our Usage | Cost |
|--------|-----------|-----------|------|
| Exa.ai | 1000 searches/month | ~50 searches/run | $0 |
| Reddit .json | Unlimited (rate limited) | ~1080 requests/run | $0 |
| HN Algolia | Unlimited | ~52 requests/run | $0 |
| Claude API (analysis) | Pay per token | ~200k input tokens | ~$0.30 |
| **Total per run** | | | **~$0.30** |

---

## Future Pipelines

These are planned but not yet implemented:

**Pipeline 2 — Ad Creative Generation**
- Angle categories: doctor_dismissal, symptom_confusion, pattern_blindness, tracking_fatigue, hrt_evidence, identity_loss
- Ad formats: before/after tracking, GP export reveal, weekly snapshot demo, testimonial-style
- Show real perimenopause scenarios (GP conversations, sleep struggles, brain fog at work)

**Pipeline 3 — Social Media Content**
- Target: Instagram (carousels, Reels), Facebook Groups (perimenopause communities), TikTok (PerimenoTok)
- Content pillars: Validation (40%), Education (30%), Product (20%), Humor (10%)
- Warm, adult tone — never clinical, never preachy

**Pipeline 4 — Provider Outreach**
- Target: GPs, OB-GYNs, menopause specialists, telehealth providers
- One-pager for clinicians showing GP Export feature
- Email sequences for provider partnerships

---

## Notes

1. **Exa is primary, Reddit JSON is fragile.** Reddit can throttle/block unauthenticated requests at any time. Never depend on it alone.
2. **If Reddit API approval comes through**, add `scrape-reddit-oauth.ts`. The analyzer already merges from multiple sources.
3. **Exa's `highlights` are gold.** Use them as primary input for verbatim quote extraction. Fall back to full text only if highlights are insufficient.
4. **Test with `--limit 3` first.** Verify output structure before full runs.
5. **Tone is everything:** "A clearer record" — not a wellness app, not medical advice, not telling anyone what to do.
