import { describe, expect, it } from "vitest";
import { checkTicket } from "../src/domain/match-ticket.js";
import type { LotteryResult, MatchRequest, RuleSet, TicketReading } from "../src/domain/types.js";

const ticket: TicketReading = {
  board: "NLB",
  lotteryId: "example-lottery",
  drawDate: "2026-10-24",
  drawNumber: "42",
  numbers: ["001234", "09"],
  letters: ["A"],
  userConfirmed: true
};

const result: LotteryResult = {
  provenance: {
    board: "NLB",
    lotteryId: "example-lottery",
    lotteryName: "Example (test fixture only)",
    drawDate: "2026-10-24",
    drawNumber: "42",
    sourceUrl: "https://www.nlb.lk/",
    retrievedAt: "2026-10-24T12:00:00.000Z",
    verification: "VERIFIED_CURRENT",
    schemaVersion: "test-schema-v1",
    ruleSetVersion: "test-v1",
    contentHash: "fixture-hash"
  },
  winningNumbers: ["001234", "09"],
  winningLetters: ["A"],
  sourceRecordId: "test-fixture-42"
};

const ruleSet: RuleSet = {
  lotteryId: "example-lottery",
  version: "test-v1",
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  evaluate: () => ({
    status: "POSSIBLE_MATCH",
    explanationKey: "test.possible_match",
    matchedFields: ["numbers", "letters"]
  })
};

function request(overrides: Partial<MatchRequest> = {}): MatchRequest {
  return {
    ticket,
    result,
    ruleSet,
    now: new Date("2026-10-24T13:00:00.000Z"),
    ...overrides
  };
}

describe("checkTicket trust gates", () => {
  it("requires explicit user confirmation", () => {
    expect(checkTicket(request({ ticket: { ...ticket, userConfirmed: false } })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "ticket_unconfirmed" });
  });

  it("preserves leading zeroes by treating numbers as strings", () => {
    expect(ticket.numbers[0]).toBe("001234");
    expect(checkTicket(request()).status).toBe("POSSIBLE_MATCH");
  });

  it("does not match an unverified result", () => {
    const unverified = {
      ...result,
      provenance: { ...result.provenance, verification: "UNVERIFIED" as const }
    };
    expect(checkTicket(request({ result: unverified })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "unverified_result" });
  });

  it("does not verdict a result marked old even if it was retrieved recently", () => {
    const old = {
      ...result,
      provenance: { ...result.provenance, verification: "VERIFIED_BUT_OLD" as const }
    };
    expect(checkTicket(request({ result: old })))
      .toEqual({ status: "RESULT_NOT_CURRENT", explanationKey: "result.not_current" });
  });

  it("does not convert an unavailable source into a no-match verdict", () => {
    const unavailable = {
      ...result,
      provenance: { ...result.provenance, verification: "SOURCE_UNAVAILABLE" as const }
    };
    expect(checkTicket(request({ result: unavailable })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "source_unavailable" });
  });

  it("stops when sources conflict", () => {
    const conflicting = {
      ...result,
      provenance: { ...result.provenance, verification: "CONFLICTING_SOURCES" as const }
    };
    expect(checkTicket(request({ result: conflicting })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "conflicting_sources" });
  });

  it("stops when a result has been corrected or superseded", () => {
    const superseded = {
      ...result,
      provenance: { ...result.provenance, verification: "CORRECTED_OR_SUPERSEDED" as const }
    };
    expect(checkTicket(request({ result: superseded })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "corrected_or_superseded" });
  });

  it("rejects a result for a different draw date or number", () => {
    const wrongDate = { ...result, provenance: { ...result.provenance, drawDate: "2026-10-23" } };
    const wrongNumber = { ...result, provenance: { ...result.provenance, drawNumber: "41" } };
    expect(checkTicket(request({ result: wrongDate })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "wrong_draw" });
    expect(checkTicket(request({ result: wrongNumber })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "wrong_draw" });
  });

  it("rejects missing result, missing rule and a mismatched rule version", () => {
    const { result: _result, ...withoutResult } = request();
    const { ruleSet: _ruleSet, ...withoutRule } = request();
    expect(checkTicket(withoutResult)).toEqual({ status: "CANNOT_VERIFY", reason: "missing_result" });
    expect(checkTicket(withoutRule)).toEqual({ status: "CANNOT_VERIFY", reason: "rule_missing" });
    expect(checkTicket(request({ ruleSet: { ...ruleSet, version: "wrong-version" } })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "rule_missing" });
  });

  it("requires the draw date to fall inside the rule's effective dates", () => {
    expect(checkTicket(request({
      ruleSet: { ...ruleSet, effectiveFrom: "2026-10-25" }
    }))).toEqual({ status: "CANNOT_VERIFY", reason: "rule_missing" });
    expect(checkTicket(request({
      ruleSet: { ...ruleSet, effectiveTo: "2026-10-23" }
    }))).toEqual({ status: "CANNOT_VERIFY", reason: "rule_missing" });
  });

  it("rejects malformed dates, timestamps and missing required result fields", () => {
    const badTicket = { ...ticket, drawDate: "2026-02-30" };
    const badTimestamp = {
      ...result,
      provenance: { ...result.provenance, retrievedAt: "yesterday" }
    };
    const emptyNumbers = { ...result, winningNumbers: [] };
    expect(checkTicket(request({ ticket: badTicket })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "invalid_data" });
    expect(checkTicket(request({ result: badTimestamp })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "invalid_data" });
    expect(checkTicket(request({ result: emptyNumbers })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "invalid_data" });
  });

  it("rejects result timestamps in the future", () => {
    const future = {
      ...result,
      provenance: { ...result.provenance, retrievedAt: "2026-10-25T00:00:00.000Z" }
    };
    expect(checkTicket(request({ result: future })))
      .toEqual({ status: "CANNOT_VERIFY", reason: "invalid_data" });
  });

  it("delegates to the lottery-specific evaluator only after all gates pass", () => {
    expect(checkTicket(request())).toEqual({
      status: "POSSIBLE_MATCH",
      explanationKey: "test.possible_match",
      matchedFields: ["numbers", "letters"]
    });
  });
});
