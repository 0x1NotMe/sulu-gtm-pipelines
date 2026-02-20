import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import { RawContent, PainPoint, MessagingAngle, AdSourceMaterial, ICPSegment, CoverageStatus } from "../shared/types";
import { parseArgs, todayStamp, writeOutput, findLatestFile, log } from "../shared/utils";

const BATCH_SIZE = 20;

const ICP_SEGMENTS_DESCRIPTION = `
ICP Segments (tag every pain point and angle with ALL that apply):
- "early_stage" — women 38-45 just starting to notice changes, unsure if it's perimenopause, often dismissed by doctors
- "established" — women 45-55 with clear, ongoing symptoms, managing multiple symptoms daily, may have been dealing with this for years
- "hrt_considering" — women actively researching or considering HRT, need evidence for GP conversations
- "gp_frustrated" — women whose doctors dismissed symptoms, told them they're "too young", or attributed symptoms to anxiety/depression
- "tracker_fatigued" — women who tried period trackers or health apps but found them too complicated, not perimenopause-specific, or overwhelming
- "universal" — applies broadly to all women experiencing perimenopause regardless of stage
`;

const APP_FEATURES_DESCRIPTION = `
Sulu Feature Set (use this to tag coverage_status for each pain point):

DIRECTLY ADDRESSED (coverage_status = "directly_addressed"):
- Daily Check-In: 30-second symptom logging with simple 0-3 sliders, not overwhelming
- Symptom Selection: Choose 3-7 symptoms to track from 9 perimenopause-specific options
- Timeline View: Visual history showing symptoms and change markers over 7/14/30 days
- Weekly Snapshot: Week-over-week comparison showing patterns, direction arrows, marker correlations
- GP Export: PDF summary for healthcare discussions — locked until 14+ days of tracking
- Change Markers: Track medication/HRT changes, alcohol, stress, exercise, illness alongside symptoms
- Pattern Recognition: Automatic correlation between change markers and symptom intensity

PARTIALLY ADDRESSED / GAPS (coverage_status = "gap"):
- Doctor communication: GP Export helps but no appointment prep or talking points
- Emotional support: Validates through pattern recognition but no community or peer support
- HRT tracking: Change markers capture HRT starts/changes but no HRT-specific outcome tracking
- Comprehensive health picture: Tracks selected symptoms but not diet, supplements, or detailed lifestyle factors

NOT ADDRESSED / OPPORTUNITIES (coverage_status = "opportunity"):
- Community features or peer support groups
- HRT effectiveness tracking over time
- Doctor/specialist finder
- Educational content about perimenopause
- Integration with health apps (Apple Health, etc.)
- Predictive patterns ("symptoms may intensify based on your pattern")
- Appointment booking or reminders
- Partner/family education resources
`;

const ANALYSIS_PROMPT = `You are an expert ICP (Ideal Customer Profile) researcher for Sulu — a daily symptom tracking app for women in perimenopause that helps them notice patterns and bring something concrete to GP appointments.

The app is NOT medical advice, NOT a wellness platform, NOT a diagnostic tool. It's a personal record — elegant, calm, and written for adults. The core promise: walk into appointments with a clear timeline in 30 seconds.

Target users: Women 40-55 experiencing perimenopause who notice symptoms but can't see patterns, want something simple to track without overwhelm, and want evidence for GP conversations.

${ICP_SEGMENTS_DESCRIPTION}
${APP_FEATURES_DESCRIPTION}

Analyze the following real forum posts and comments from women experiencing perimenopause. Extract:

1. **Pain Points** — What frustrates them? What's broken? What wastes their time? What makes them feel dismissed? Tag each with which ICP segment(s) it applies to.
2. **Verbatim Quotes** — Copy exact phrases that express emotion, frustration, or desire. These are gold for ad copy.
3. **Desired Outcomes** — What do they wish existed? What would make their life easier?
4. **Objections** — What are they skeptical about regarding health apps, tracking tools, etc.?
5. **Frequency Signals** — How common is each pain point across the data?
6. **Coverage Status** — For each pain point, determine how well the app addresses it using the feature set above:
   - "directly_addressed": The app already solves this with an existing feature
   - "gap": The app partially helps but doesn't fully solve the problem
   - "opportunity": The app doesn't address this at all — potential new feature

For each pain point, rate intensity:
- **low**: Minor annoyance mentioned in passing
- **medium**: Clear frustration, multiple people mention it
- **high**: Strong emotional language, many people affected
- **extreme**: Desperate, angry, or hopeless language, very common

Return a JSON object with this exact structure:
{
  "pain_points": [
    {
      "category": "string (e.g., 'Doctor Dismissal', 'Symptom Confusion', 'Tracking Overwhelm', 'Pattern Blindness')",
      "pain_point": "string (clear description)",
      "verbatim_quotes": ["exact quotes from the data"],
      "frequency": number (1-10, how often this comes up),
      "intensity": "low|medium|high|extreme",
      "segments": ["early_stage"|"established"|"hrt_considering"|"gp_frustrated"|"tracker_fatigued"|"universal"],
      "sources": ["urls where this was found"],
      "coverage_status": "directly_addressed|gap|opportunity",
      "app_feature": "string (which app feature addresses this, or null if opportunity)"
    }
  ],
  "messaging_angles": [
    {
      "angle": "string (marketing angle name)",
      "target_emotion": "string (primary emotion to tap into)",
      "target_segment": "early_stage"|"established"|"hrt_considering"|"gp_frustrated"|"tracker_fatigued"|"universal",
      "hook": "string (opening line for ad/post — warm, adult, non-medical tone)",
      "supporting_quotes": ["verbatim quotes that back this up"],
      "app_solution": "string (how the app solves this)"
    }
  ],
  "ad_source_material": [
    {
      "headline": "string (punchy, short)",
      "pain_point": "string (which pain point this targets)",
      "target_segment": "early_stage"|"established"|"hrt_considering"|"gp_frustrated"|"tracker_fatigued"|"universal",
      "hook_type": "fear|frustration|aspiration|social_proof",
      "body_copy": "string (2-3 sentences, elegant and adult tone, never preachy or wellness-y)",
      "cta": "string (call to action)",
      "verbatim_quotes": ["quotes to use in ads"]
    }
  ]
}

IMPORTANT:
- Prioritize GP frustration and doctor dismissal — this is the strongest emotional driver.
- Use warm, adult language. Never clinical, never wellness-preachy.
- "universal" means it applies to all segments equally.
- EVERY pain point MUST have a coverage_status. Use the app feature set above to determine the correct tag.
- For "directly_addressed", set app_feature to the specific feature name (e.g., "Daily Check-In", "GP Export").
- For "gap", set app_feature to the partially-relevant feature.
- For "opportunity", set app_feature to null.
- Return ONLY valid JSON, no markdown code fences.`;

function loadRawData(outputDir: string, args: ReturnType<typeof parseArgs>): RawContent[] {
  const all: RawContent[] = [];

  if (!args.skipExa) {
    const exaFile = findLatestFile(outputDir, "exa-raw-");
    if (exaFile) {
      const data = JSON.parse(fs.readFileSync(exaFile, "utf-8"));
      const items: RawContent[] = data.raw ?? [];
      log("analyze", `Loaded ${items.length} items from Exa (${exaFile})`);
      all.push(...items);
    } else {
      log("analyze", "No Exa data found — skipping");
    }
  }

  if (!args.skipReddit) {
    const redditFile = findLatestFile(outputDir, "reddit-json-raw-");
    if (redditFile) {
      const data = JSON.parse(fs.readFileSync(redditFile, "utf-8"));
      const items: RawContent[] = data.raw ?? [];
      log("analyze", `Loaded ${items.length} items from Reddit JSON (${redditFile})`);
      all.push(...items);
    } else {
      log("analyze", "No Reddit JSON data found — skipping");
    }
  }

  if (!args.skipHn) {
    const hnFile = findLatestFile(outputDir, "hn-raw-");
    if (hnFile) {
      const data = JSON.parse(fs.readFileSync(hnFile, "utf-8"));
      const items: RawContent[] = data.raw ?? [];
      log("analyze", `Loaded ${items.length} items from HN (${hnFile})`);
      all.push(...items);
    } else {
      log("analyze", "No HN data found — skipping");
    }
  }

  return all;
}

function deduplicateByUrl(items: RawContent[]): RawContent[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatItemForPrompt(item: RawContent): string {
  const parts = [`[${item.source}] ${item.title}`];
  if (item.subreddit) parts.push(`r/${item.subreddit}`);
  if (item.url) parts.push(item.url);
  parts.push("");

  // Prefer highlights (Exa) for conciseness, fall back to full content
  if (item.highlights && item.highlights.length > 0) {
    parts.push("Key excerpts:");
    for (const h of item.highlights) {
      parts.push(`> ${h}`);
    }
  }

  if (item.content) {
    // Truncate long content to keep batches manageable
    const maxLen = item.highlights?.length ? 500 : 2000;
    const truncated = item.content.length > maxLen
      ? item.content.slice(0, maxLen) + "..."
      : item.content;
    parts.push(truncated);
  }

  return parts.join("\n");
}

function batchItems(items: RawContent[], size: number): RawContent[][] {
  const batches: RawContent[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function analyzeBatch(
  client: Anthropic,
  batch: RawContent[],
  batchNum: number,
  totalBatches: number
): Promise<{ pain_points: PainPoint[]; messaging_angles: MessagingAngle[]; ad_source_material: AdSourceMaterial[] }> {
  const formattedContent = batch.map(formatItemForPrompt).join("\n\n---\n\n");

  log("analyze", `Batch ${batchNum}/${totalBatches} — ${batch.length} items, ~${formattedContent.length} chars`);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\nHere are the forum posts to analyze:\n\n${formattedContent}`,
      },
    ],
  });

  let text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // Strip markdown code fences that LLMs sometimes add despite instructions
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  return JSON.parse(text);
}

function mergeResults(
  results: { pain_points: PainPoint[]; messaging_angles: MessagingAngle[]; ad_source_material: AdSourceMaterial[] }[]
): { pain_points: PainPoint[]; messaging_angles: MessagingAngle[]; ad_source_material: AdSourceMaterial[] } {
  // Merge all pain points, dedup by category+pain_point, sum frequencies
  const painMap = new Map<string, PainPoint>();
  for (const r of results) {
    for (const pp of r.pain_points) {
      const key = `${pp.category}::${pp.pain_point}`.toLowerCase();
      const existing = painMap.get(key);
      if (existing) {
        existing.frequency = Math.min(10, existing.frequency + pp.frequency);
        existing.verbatim_quotes.push(...pp.verbatim_quotes);
        existing.sources.push(...pp.sources);
        existing.segments.push(...(pp.segments ?? []));
        // Upgrade intensity
        const intensityOrder = { low: 0, medium: 1, high: 2, extreme: 3 };
        if (intensityOrder[pp.intensity] > intensityOrder[existing.intensity]) {
          existing.intensity = pp.intensity;
        }
        // Merge coverage_status: prefer directly_addressed > gap > opportunity
        if (pp.coverage_status) {
          const coverageOrder: Record<CoverageStatus, number> = { directly_addressed: 2, gap: 1, opportunity: 0 };
          const existingRank = existing.coverage_status ? coverageOrder[existing.coverage_status] : -1;
          const newRank = coverageOrder[pp.coverage_status];
          if (newRank > existingRank) {
            existing.coverage_status = pp.coverage_status;
          }
        }
        // Keep first non-null app_feature
        if (!existing.app_feature && pp.app_feature) {
          existing.app_feature = pp.app_feature;
        }
      } else {
        painMap.set(key, { ...pp, segments: pp.segments ?? ["universal"] });
      }
    }
  }

  // Deduplicate quotes, sources, and segments
  const painPoints = Array.from(painMap.values())
    .map((pp) => ({
      ...pp,
      verbatim_quotes: [...new Set(pp.verbatim_quotes)],
      sources: [...new Set(pp.sources)],
      segments: [...new Set(pp.segments)] as ICPSegment[],
    }))
    .sort((a, b) => b.frequency - a.frequency);

  // Merge messaging angles — just concat and dedupe by angle name
  const angleMap = new Map<string, MessagingAngle>();
  for (const r of results) {
    for (const ma of r.messaging_angles) {
      const key = ma.angle.toLowerCase();
      if (!angleMap.has(key)) angleMap.set(key, ma);
    }
  }

  // Merge ad source material — concat all
  const allAds = results.flatMap((r) => r.ad_source_material);

  return {
    pain_points: painPoints,
    messaging_angles: Array.from(angleMap.values()),
    ad_source_material: allAds,
  };
}

function generateMessagingMarkdown(
  painPoints: PainPoint[],
  angles: MessagingAngle[]
): string {
  const lines: string[] = [
    "# Sulu — ICP Pain Points & Messaging Angles",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "---",
    "",
    "## Top Pain Points (Ranked by Frequency)",
    "",
  ];

  for (const pp of painPoints.slice(0, 20)) {
    lines.push(`### ${pp.category} — ${pp.pain_point}`);
    lines.push(`**Intensity:** ${pp.intensity} | **Frequency:** ${pp.frequency}/10 | **Segments:** ${pp.segments.join(", ")}`);
    if (pp.coverage_status) {
      const statusLabel = pp.coverage_status === "directly_addressed" ? "Directly Addressed"
        : pp.coverage_status === "gap" ? "Gap"
        : "Opportunity";
      const featureNote = pp.app_feature ? ` → ${pp.app_feature}` : "";
      lines.push(`**Coverage:** ${statusLabel}${featureNote}`);
    }
    lines.push("");
    lines.push("Verbatim quotes:");
    for (const q of pp.verbatim_quotes.slice(0, 5)) {
      lines.push(`> "${q}"`);
    }
    lines.push("");
  }

  lines.push("---", "", "## Messaging Angles", "");

  for (const ma of angles) {
    lines.push(`### ${ma.angle}`);
    lines.push(`**Target segment:** ${ma.target_segment} | **Target emotion:** ${ma.target_emotion}`);
    lines.push(`**Hook:** "${ma.hook}"`);
    lines.push(`**App solution:** ${ma.app_solution}`);
    lines.push("");
    if (ma.supporting_quotes.length > 0) {
      lines.push("Supporting quotes:");
      for (const q of ma.supporting_quotes.slice(0, 3)) {
        lines.push(`> "${q}"`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

async function main() {
  const args = parseArgs();
  const outputDir = args.outputDir ?? "01-icp-research/outputs";

  log("analyze", "Loading raw data from all sources...");
  const rawData = loadRawData(outputDir, args);

  if (rawData.length === 0) {
    console.error("No raw data found. Run scrapers first.");
    process.exit(1);
  }

  const deduped = deduplicateByUrl(rawData);
  log("analyze", `${rawData.length} total items → ${deduped.length} after dedup`);

  // Filter out items with very little content
  const filtered = deduped.filter(
    (item) => (item.content?.length ?? 0) + (item.highlights?.join("").length ?? 0) > 50
  );
  log("analyze", `${filtered.length} items with sufficient content`);

  if (args.dryRun) {
    log("analyze", "DRY RUN — would analyze these batches:");
    const batches = batchItems(filtered, BATCH_SIZE);
    batches.forEach((b, i) => console.log(`  Batch ${i + 1}: ${b.length} items`));
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set in .env");
    process.exit(1);
  }

  const client = new Anthropic();
  const batches = batchItems(filtered, BATCH_SIZE);
  log("analyze", `Split into ${batches.length} batches of ~${BATCH_SIZE}`);

  const batchResults: { pain_points: PainPoint[]; messaging_angles: MessagingAngle[]; ad_source_material: AdSourceMaterial[] }[] = [];

  for (let i = 0; i < batches.length; i++) {
    try {
      const result = await analyzeBatch(client, batches[i], i + 1, batches.length);
      batchResults.push(result);
    } catch (err: any) {
      log("analyze", `Batch ${i + 1} failed: ${err.message}`);
      // Continue with other batches
    }
  }

  if (batchResults.length === 0) {
    console.error("All batches failed. Check API key and try again.");
    process.exit(1);
  }

  log("analyze", `Merging results from ${batchResults.length} successful batches...`);
  const merged = mergeResults(batchResults);

  const stamp = todayStamp();

  // Output 1: Ranked pain points
  const ppPath = writeOutput(outputDir, `pain-points-ranked.json`, {
    metadata: {
      sourcesUsed: {
        exa: !args.skipExa,
        reddit_json: !args.skipReddit,
        hn: !args.skipHn,
      },
      totalItemsAnalyzed: filtered.length,
      batchesProcessed: batchResults.length,
      timestamp: new Date().toISOString(),
    },
    pain_points: merged.pain_points,
  });
  log("analyze", `Pain points → ${ppPath}`);

  // Output 2: Messaging angles markdown
  const mdContent = generateMessagingMarkdown(merged.pain_points, merged.messaging_angles);
  const mdPath = `${outputDir}/messaging-angles.md`;
  fs.writeFileSync(mdPath, mdContent);
  log("analyze", `Messaging angles → ${mdPath}`);

  // Output 3: Ad source material
  const adPath = writeOutput(outputDir, `ad-source-material.json`, {
    metadata: {
      painPointsUsed: merged.pain_points.length,
      anglesGenerated: merged.messaging_angles.length,
      adsGenerated: merged.ad_source_material.length,
      timestamp: new Date().toISOString(),
    },
    messaging_angles: merged.messaging_angles,
    ad_source_material: merged.ad_source_material,
  });
  log("analyze", `Ad source material → ${adPath}`);

  log("analyze", "Done!");
  console.log(`\nSummary:`);
  console.log(`  Pain points:      ${merged.pain_points.length}`);
  console.log(`  Messaging angles: ${merged.messaging_angles.length}`);
  console.log(`  Ad materials:     ${merged.ad_source_material.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
