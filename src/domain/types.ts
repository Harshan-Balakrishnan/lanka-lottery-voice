export type LotteryBoard = "NLB" | "DLB";

export type VerificationStatus =
  | "verified"
  | "unverified"
  | "stale"
  | "unavailable"
  | "ambiguous";

export interface ResultProvenance {
  board: LotteryBoard;
  lotteryId: string;
  lotteryName: string;
  drawDate: string;
  drawNumber?: string;
  sourceUrl: string;
  retrievedAt: string;
  publishedAt?: string;
  verification: VerificationStatus;
  ruleSetVersion?: string;
}

export interface LotteryResult {
  provenance: ResultProvenance;
  winningNumbers: readonly string[];
  winningLetters?: readonly string[];
  /** Raw published content retained for traceability; never display without sanitising. */
  sourceRecordId: string;
}

export interface TicketReading {
  board: LotteryBoard;
  lotteryId: string;
  drawDate: string;
  numbers: readonly string[];
  letters?: readonly string[];
  /** Confidence is OCR confidence only; it is not a probability of winning. */
  ocrConfidence?: number;
  userConfirmed: boolean;
}

export interface RuleSet {
  lotteryId: string;
  version: string;
  /** ISO date from which the rules apply. */
  effectiveFrom: string;
  /** Inclusive end date; omitted only when current validity is confirmed. */
  effectiveTo?: string;
  /** Matching is intentionally not generic; each lottery needs an audited implementation. */
  evaluate: (ticket: TicketReading, result: LotteryResult) => MatchOutcome;
}

export type MatchOutcome =
  | { status: "possible_match"; explanationKey: string; matchedFields: readonly string[] }
  | { status: "no_match"; explanationKey: string; matchedFields: readonly string[] }
  | { status: "cannot_check"; reason: "unverified_result" | "stale_result" | "wrong_draw" | "rule_missing" | "ticket_unconfirmed" | "unsupported_lottery" };

export interface MatchRequest {
  ticket: TicketReading;
  result?: LotteryResult;
  ruleSet?: RuleSet;
  now: Date;
  maxResultAgeHours: number;
}
