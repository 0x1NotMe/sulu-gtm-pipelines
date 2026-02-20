import "dotenv/config";
import axios from "axios";
import { RawContent, RedditPost, RedditComment } from "../shared/types";
import { parseArgs, todayStamp, writeOutput, sleep, log } from "../shared/utils";

const SUBREDDITS = [
  // Primary — perimenopause & menopause communities
  "Menopause",
  "Perimenopause",

  // Women's health & age-specific
  "WomensHealth",
  "AskWomenOver40",
  "AskWomenOver30",
  "TwoXChromosomes",

  // Health & wellness tracking
  "HealthAnxiety",
  "ChronicIllness",

  // Relationships & impact
  "relationship_advice",
  "DeadBedrooms",

  // Work impact
  "workingmoms",
  "antiwork",
];

const SEARCH_TERMS = [
  // Core perimenopause pain
  "perimenopause symptoms confused",
  "perimenopause doctor dismissed",
  "perimenopause brain fog",
  "perimenopause anxiety rage",
  "perimenopause tracking symptoms",
  "perimenopause hot flashes night sweats",
  "perimenopause insomnia sleep",
  // GP & medical frustration
  "perimenopause blood test normal",
  "menopause doctor gaslighted",
  "perimenopause too young",
  // Tracking & apps
  "symptom tracker menopause app",
  "period tracker perimenopause",
  "tracking symptoms patterns",
  // Emotional toll
  "perimenopause losing myself",
  "perimenopause nobody told me",
  "perimenopause relationship partner",
  // HRT seeking
  "perimenopause HRT evidence",
  "perimenopause HRT appointment",
];

const USER_AGENT = "sulu-gtm-research/1.0 (market research for symptom tracking app)";
const REQUEST_DELAY_MS = 2000;
const BACKOFF_DELAY_MS = 60000;

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": USER_AGENT },
        timeout: 15000,
      });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 429) {
        log("reddit", `  429 rate limited — backing off ${BACKOFF_DELAY_MS / 1000}s`);
        await sleep(BACKOFF_DELAY_MS);
        continue;
      }
      if (attempt === retries) throw err;
      await sleep(REQUEST_DELAY_MS);
    }
  }
}

async function fetchTopComments(permalink: string): Promise<RedditComment[]> {
  try {
    const url = `https://www.reddit.com${permalink}.json?limit=10&sort=top`;
    const data = await fetchWithRetry(url);
    if (!Array.isArray(data) || data.length < 2) return [];

    const comments = data[1]?.data?.children ?? [];
    return comments
      .filter((c: any) => c.kind === "t1" && c.data?.body)
      .slice(0, 10)
      .map((c: any) => ({
        body: c.data.body,
        score: c.data.score ?? 0,
      }));
  } catch {
    return [];
  }
}

async function main() {
  const args = parseArgs();
  const outputDir = args.outputDir ?? "01-icp-research/outputs";

  const subreddits = SUBREDDITS;
  const terms = args.limit ? SEARCH_TERMS.slice(0, args.limit) : SEARCH_TERMS;

  log("reddit", `Starting Reddit JSON scrape — ${subreddits.length} subs × ${terms.length} terms`);

  if (args.dryRun) {
    log("reddit", "DRY RUN — searches that would be executed:");
    for (const sub of subreddits) {
      for (const term of terms) {
        console.log(`  r/${sub}: "${term}"`);
      }
    }
    return;
  }

  const allPosts: RedditPost[] = [];
  const seenUrls = new Set<string>();
  let requestCount = 0;

  for (const subreddit of subreddits) {
    for (const term of terms) {
      log("reddit", `r/${subreddit}: "${term}"`);

      try {
        const searchUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(term)}&sort=relevance&t=year&limit=25&restrict_sr=on`;
        const data = await fetchWithRetry(searchUrl);
        requestCount++;

        const posts = data?.data?.children ?? [];
        let newCount = 0;

        for (const post of posts) {
          const p = post.data;
          if (!p?.permalink || seenUrls.has(p.permalink)) continue;
          seenUrls.add(p.permalink);

          await sleep(REQUEST_DELAY_MS);
          requestCount++;

          const comments = await fetchTopComments(p.permalink);

          allPosts.push({
            title: p.title ?? "",
            selftext: p.selftext ?? "",
            score: p.score ?? 0,
            permalink: p.permalink,
            num_comments: p.num_comments ?? 0,
            subreddit: p.subreddit ?? subreddit,
            created_utc: p.created_utc ?? 0,
            url: `https://www.reddit.com${p.permalink}`,
            comments,
          });
          newCount++;

          // Only fetch comments for top 5 posts per search to manage rate limits
          if (newCount >= 5) break;
        }

        log("reddit", `  → ${newCount} new posts`);
      } catch (err: any) {
        log("reddit", `  ✗ Error: ${err.message}`);
      }

      await sleep(REQUEST_DELAY_MS);
      requestCount++;
    }
  }

  // Convert to RawContent format
  const raw: RawContent[] = allPosts.map((post) => {
    const commentText = post.comments
      .map((c) => `[comment, score:${c.score}] ${c.body}`)
      .join("\n\n");

    return {
      source: "reddit_json" as const,
      url: post.url,
      title: post.title,
      content: `${post.selftext}\n\n---COMMENTS---\n\n${commentText}`,
      score: post.score,
      date: new Date(post.created_utc * 1000).toISOString(),
      subreddit: post.subreddit,
    };
  });

  const stamp = todayStamp();
  const rawPath = writeOutput(outputDir, `reddit-json-raw-${stamp}.json`, {
    metadata: {
      source: "reddit_json",
      subreddits: subreddits.length,
      searchTerms: terms.length,
      totalRequests: requestCount,
      uniquePosts: allPosts.length,
      timestamp: new Date().toISOString(),
    },
    posts: allPosts,
    raw,
  });

  log("reddit", `Done. ${allPosts.length} posts (${requestCount} requests) → ${rawPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
