export interface RawContent {
  source: "exa" | "reddit_json" | "hn";
  url: string;
  title: string;
  content: string;
  highlights?: string[];
  score?: number;
  date?: string;
  subreddit?: string;
}

export interface ExaSearchResult {
  query: string;
  results: {
    title: string;
    url: string;
    text: string;
    highlights?: string[];
    publishedDate?: string;
    score: number;
  }[];
}

export interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  permalink: string;
  num_comments: number;
  subreddit: string;
  created_utc: number;
  url: string;
  comments: RedditComment[];
}

export interface RedditComment {
  body: string;
  score: number;
}

export interface HNItem {
  title: string;
  url: string;
  text: string;
  points: number;
  created_at: string;
  objectID: string;
  story_url?: string;
}

export type ICPSegment =
  | "early_stage"
  | "established"
  | "hrt_considering"
  | "gp_frustrated"
  | "tracker_fatigued"
  | "universal";

export type CoverageStatus = "directly_addressed" | "gap" | "opportunity";

export interface PainPoint {
  category: string;
  pain_point: string;
  verbatim_quotes: string[];
  frequency: number;
  intensity: "low" | "medium" | "high" | "extreme";
  segments: ICPSegment[];
  sources: string[];
  coverage_status?: CoverageStatus;
  app_feature?: string | null;
}

export interface MessagingAngle {
  angle: string;
  target_emotion: string;
  target_segment: ICPSegment;
  hook: string;
  supporting_quotes: string[];
  app_solution: string;
}

export interface AdSourceMaterial {
  headline: string;
  pain_point: string;
  target_segment: ICPSegment;
  hook_type: "fear" | "frustration" | "aspiration" | "social_proof";
  body_copy: string;
  cta: string;
  verbatim_quotes: string[];
}

export interface CLIArgs {
  limit?: number;
  outputDir?: string;
  dryRun: boolean;
  skipExa: boolean;
  skipReddit: boolean;
  skipHn: boolean;
}
