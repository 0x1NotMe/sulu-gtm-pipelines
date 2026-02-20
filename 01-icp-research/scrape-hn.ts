import "dotenv/config";
import axios from "axios";
import { RawContent, HNItem } from "../shared/types";
import { parseArgs, todayStamp, writeOutput, sleep, log } from "../shared/utils";

const QUERIES = [
  // Perimenopause & menopause general
  "perimenopause symptoms",
  "menopause workplace",
  "menopause brain fog work",
  "perimenopause technology",
  "menopause app tracking",

  // Health tracking & quantified self
  "symptom tracking app",
  "health tracking patterns",
  "quantified self health",
  "health data GP doctor",
  "personal health record",

  // Women's health tech
  "femtech menopause",
  "women health app",
  "period tracker menopause",
  "health app recommendation women",

  // Workplace impact
  "menopause work productivity",
  "brain fog work concentration",
  "perimenopause career impact",

  // Doctor communication
  "doctor patient data tracking",
  "health data appointment",
  "symptom diary doctor",

  // Sleep & wellbeing (HN audience cares about optimization)
  "sleep tracking insomnia",
  "sleep quality tracking app",
  "anxiety tracking patterns",

  // Mental health tracking
  "mood tracking app",
  "mental health tracking patterns",
  "burnout symptoms tracking",
];

const HN_API = "https://hn.algolia.com/api/v1";

async function searchHN(query: string, tags: string): Promise<HNItem[]> {
  const url = `${HN_API}/search?query=${encodeURIComponent(query)}&tags=${tags}&numericFilters=points>5&hitsPerPage=25`;
  const response = await axios.get(url, { timeout: 15000 });
  return (response.data?.hits ?? []).map((hit: any) => ({
    title: hit.title ?? hit.story_title ?? "",
    url: hit.url ?? hit.story_url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
    text: hit.comment_text ?? hit.story_text ?? "",
    points: hit.points ?? 0,
    created_at: hit.created_at ?? "",
    objectID: hit.objectID,
    story_url: hit.story_url,
  }));
}

async function main() {
  const args = parseArgs();
  const outputDir = args.outputDir ?? "01-icp-research/outputs";
  const queries = args.limit ? QUERIES.slice(0, args.limit) : QUERIES;

  log("hn", `Starting HN scrape — ${queries.length} queries`);

  if (args.dryRun) {
    log("hn", "DRY RUN — queries that would be executed:");
    queries.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
    return;
  }

  const allItems: HNItem[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    log("hn", `[${i + 1}/${queries.length}] ${query}`);

    try {
      // Search both stories and comments
      const [stories, comments] = await Promise.all([
        searchHN(query, "story"),
        searchHN(query, "comment"),
      ]);

      const combined = [...stories, ...comments];
      let newCount = 0;

      for (const item of combined) {
        if (seenIds.has(item.objectID)) continue;
        seenIds.add(item.objectID);
        allItems.push(item);
        newCount++;
      }

      log("hn", `  → ${newCount} new items (${stories.length} stories, ${comments.length} comments)`);
    } catch (err: any) {
      log("hn", `  ✗ Error: ${err.message}`);
    }

    if (i < queries.length - 1) {
      await sleep(500);
    }
  }

  // Convert to RawContent format
  const raw: RawContent[] = allItems.map((item) => ({
    source: "hn" as const,
    url: item.url,
    title: item.title,
    content: item.text,
    score: item.points,
    date: item.created_at,
  }));

  const stamp = todayStamp();
  const rawPath = writeOutput(outputDir, `hn-raw-${stamp}.json`, {
    metadata: {
      source: "hn",
      queriesRun: queries.length,
      totalItems: allItems.length,
      timestamp: new Date().toISOString(),
    },
    items: allItems,
    raw,
  });

  log("hn", `Done. ${allItems.length} unique items → ${rawPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
