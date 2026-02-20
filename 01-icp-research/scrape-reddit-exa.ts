import "dotenv/config";
import Exa from "exa-js";
import { ExaSearchResult, RawContent } from "../shared/types";
import { parseArgs, todayStamp, writeOutput, sleep, log } from "../shared/utils";

const QUERIES = [
  // === UNIVERSAL perimenopause pain points ===
  'site:reddit.com "perimenopause" symptoms confused',
  'site:reddit.com "perimenopause" "don\'t know what\'s wrong"',
  'site:reddit.com "perimenopause" doctor dismissed OR "not taken seriously"',
  'site:reddit.com "perimenopause" tracking symptoms',
  'site:reddit.com "perimenopause" "brain fog" OR "can\'t think" OR forgetful',
  'site:reddit.com "perimenopause" exhausted OR fatigue OR "no energy"',
  'site:reddit.com "perimenopause" anxiety OR "racing thoughts" OR overwhelm',
  'site:reddit.com "perimenopause" mood swings OR irritable OR rage',
  'site:reddit.com "perimenopause" "hot flashes" OR "night sweats" OR insomnia',
  'site:reddit.com "perimenopause" "thought I was going crazy"',

  // === GP / doctor frustration ===
  'site:reddit.com "perimenopause" GP OR doctor "didn\'t believe me"',
  'site:reddit.com "perimenopause" doctor appointment "couldn\'t explain"',
  'site:reddit.com "perimenopause" "blood test normal" symptoms',
  'site:reddit.com "perimenopause" "too young" menopause symptoms',
  'site:reddit.com "perimenopause" doctor "just anxiety" OR "just depression"',
  'site:reddit.com "menopause" GP dismissed OR gaslighted',
  'site:reddit.com "perimenopause" "wish I had" tracked OR evidence',

  // === Tracking & pattern recognition ===
  'site:reddit.com "perimenopause" "track symptoms" app OR journal',
  'site:reddit.com "perimenopause" pattern OR "didn\'t notice" until',
  'site:reddit.com "menopause" symptom tracker app recommendation',
  'site:reddit.com "perimenopause" "symptom diary" OR "symptom log"',
  'site:reddit.com "perimenopause" "started tracking" realized OR noticed',

  // === HRT / treatment seeking ===
  'site:reddit.com "perimenopause" HRT OR "hormone replacement" considering',
  'site:reddit.com "perimenopause" HRT "how did you know" OR "when to start"',
  'site:reddit.com "perimenopause" HRT evidence GP appointment',

  // === Emotional toll & identity ===
  'site:reddit.com "perimenopause" "feel like myself" OR "losing myself"',
  'site:reddit.com "perimenopause" "nobody told me" OR "nobody warned me"',
  'site:reddit.com "perimenopause" relationship OR partner "doesn\'t understand"',
  'site:reddit.com "perimenopause" work OR career OR "can\'t concentrate"',
  'site:reddit.com "perimenopause" lonely OR isolated OR "no one talks about"',

  // === Subreddit-specific ===
  'site:reddit.com/r/Menopause perimenopause symptoms tracking',
  'site:reddit.com/r/Menopause perimenopause doctor appointment',
  'site:reddit.com/r/Menopause symptom tracker app',
  'site:reddit.com/r/Perimenopause symptoms pattern',
  'site:reddit.com/r/Perimenopause doctor dismissed',
  'site:reddit.com/r/TwoXChromosomes perimenopause symptoms',
  'site:reddit.com/r/AskWomenOver40 perimenopause',
  'site:reddit.com/r/WomensHealth perimenopause symptoms tracking',

  // === Age-specific concerns ===
  'site:reddit.com "perimenopause" "early 40s" OR "late 30s" symptoms',
  'site:reddit.com "perimenopause" "am I too young" symptoms',
  'site:reddit.com "perimenopause" "is this normal" OR "is this perimenopause"',

  // === App & tool frustration ===
  'site:reddit.com "period tracker" perimenopause OR menopause "doesn\'t work"',
  'site:reddit.com "Clue" OR "Flo" perimenopause OR menopause tracking',
  'site:reddit.com menopause app recommendation OR "best app"',
  'site:reddit.com perimenopause "too complicated" OR overwhelm tracking',

  // === Sleep-specific (major pain point) ===
  'site:reddit.com "perimenopause" insomnia OR "can\'t sleep" OR "wake up"',
  'site:reddit.com "perimenopause" "night sweats" waking exhausted',

  // === LinkedIn / Quora via Exa (non-Reddit sources) ===
  'site:linkedin.com "perimenopause" workplace OR symptoms OR awareness',
  'site:linkedin.com "menopause" "at work" support OR policy',
  'site:quora.com "perimenopause" symptoms tracking doctor',
  'site:quora.com "perimenopause" "how do I know" symptoms',
];

async function main() {
  const args = parseArgs();
  const outputDir = args.outputDir ?? "01-icp-research/outputs";
  const queries = args.limit ? QUERIES.slice(0, args.limit) : QUERIES;

  log("exa", `Starting Exa scrape — ${queries.length} queries`);

  if (args.dryRun) {
    log("exa", "DRY RUN — queries that would be executed:");
    queries.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
    return;
  }

  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    console.error("EXA_API_KEY not set in .env");
    process.exit(1);
  }

  const exa = new Exa(apiKey);
  const allResults: ExaSearchResult[] = [];
  const allRaw: RawContent[] = [];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    log("exa", `[${i + 1}/${queries.length}] ${query}`);

    try {
      const result = await exa.searchAndContents(query, {
        numResults: 25,
        text: true,
        highlights: true,
        useAutoprompt: false,
        startPublishedDate: "2024-01-01",
      });

      const searchResult: ExaSearchResult = {
        query,
        results: result.results.map((r: any) => ({
          title: r.title ?? "",
          url: r.url,
          text: r.text ?? "",
          highlights: r.highlights ?? [],
          publishedDate: r.publishedDate,
          score: r.score ?? 0,
        })),
      };

      allResults.push(searchResult);

      for (const r of searchResult.results) {
        const subredditMatch = r.url.match(/reddit\.com\/r\/([^/]+)/);
        allRaw.push({
          source: "exa",
          url: r.url,
          title: r.title,
          content: r.text,
          highlights: r.highlights,
          score: r.score,
          date: r.publishedDate,
          subreddit: subredditMatch?.[1],
        });
      }

      log("exa", `  → ${searchResult.results.length} results`);
    } catch (err: any) {
      log("exa", `  ✗ Error: ${err.message}`);
    }

    if (i < queries.length - 1) {
      await sleep(500);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const dedupedRaw = allRaw.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  const stamp = todayStamp();
  const rawPath = writeOutput(outputDir, `exa-raw-${stamp}.json`, {
    metadata: {
      source: "exa",
      queriesRun: queries.length,
      totalResults: allRaw.length,
      uniqueResults: dedupedRaw.length,
      timestamp: new Date().toISOString(),
    },
    results: allResults,
    raw: dedupedRaw,
  });

  log("exa", `Done. ${dedupedRaw.length} unique results → ${rawPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
