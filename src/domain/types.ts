export type LotteryBoard = "NLB" | "DLB";

/** Status assigned by a trusted source-validation policy, never by a client. */
export type ResultVerificationStatus =
  | "VERIFIED_CURRENT"
  | "VERIFIED_BUT_OLD"
  | "SOURCE_UNAVAILABLE"
  | "UNVERIFIED"
  | "CONFLICTING_SOURCES"
  | "CORRECTED_OR_SUPERSEDED";

export interface ResultProvenance {
  board: LotteryBoard;
  lotteryId: string;
  lotteryName: string;
  /** Local draw date, YYYY-MM-DD; not a retrieval timestamp. */
  drawDate: string;
  drawNumber?: string;
  sourceUrl: string;
  /** ISO 8601 timestamp in UTC. */
  retrievedAt: string;
  publishedAt?: string;
  verification: ResultVerificationStatus;
  schemaVersion: string;
  ruleSetVersion?: string;
  /** Hash of canonical source content or equivalent immutable integrity reference. */
  contentHash?: string;
  supersededByRecordId?: string;
}

export interface LotteryResult {
  provenance: ResultProvenance;
  winningNumbers: readonly string[];
  winningLetters?: readonly string[];
  /** Immutable internal record identifier; do not expose raw source HTML as trusted markup. */
  sourceRecordId: string;
}

export interface TicketReading {
  board: LotteryBoard;
  lotteryId: string;
  drawDate: string;
  drawNumber?: string;
  /** Strings preserve leading zeroes and must not be converted to numbers. */
  numbers: readonly string[];
  letters?: readonly string[];
  /** OCR confidence is not a probability of winning. */
  ocrConfidence?: number;
  userConfirmed: boolean;
}

export interface RuleSet {
  lotteryId: string;
  version: string;
  /** Inclusive ISO date, YYYY-MM-DD. */
  effectiveFrom: string;
  /** Inclusive ISO date, YYYY-MM-DD. Omit only when current validity is verified. */
  effectiveTo?: string;
  /** Each production lottery needs its own audited evaluator. */
  evaluate: (ticket: TicketReading, result: LotteryResult) => MatchOutcome;
}

export type CannotVerifyReason =
  | "missing_result"
  | "unverified_result"
  | "conflicting_sources"
  | "corrected_or_superseded"
  | "wrong_draw"
  | "rule_missing"
  | "ticket_unconfirmed"
  | "invalid_data";

export type MatchOutcome =
  | { status: "POSSIBLE_MATCH"; explanationKey: string; matchedFields: readonly string[] }
  | { status: "NO_MATCH_UNDER_VERIFIED_RULES"; explanationKey: string; matchedFields: readonly string[] }
  | { status: "CANNOT_VERIFY"; reason: CannotVerifyReason }
  | { status: "RESULT_NOT_CURRENT"; explanationKey: string }
  | { status: "UNSUPPORTED_LOTTERY"; lotteryId: string };

export interface MatchRequest {
  ticket: TicketReading;
  result?: LotteryResult;
  ruleSet?: RuleSet;
  now: Date;
}
