import { describe, expect, it } from "vitest";
import { checkTicket } from "../src/domain/match-ticket.js";
import type { LotteryResult, MatchRequest, RuleSet, TicketReading } from "../src/domain/types.js";

const ticket: TicketReading = {
  board: "NLB",
  lotteryId: "example-lottery",
  drawDate: "2026-10-24",
  numbers: ["123456"],
  userConfirmed: true
};

const result: LotteryResult = {
  provenance: {
    board: "NLB",
    lotteryId: "example-lottery",
    lotteryName: "Example (test only)",
    drawDate: "2026-10-24",
    sourceUrl: "https://www.nlb.lk/",
    retrievedAt: "2026-10-24T12:00:00.000Z",
    verification: "verified",
    ruleSetVersion: "test-v1"
  },
  winningNumbers: ["123456"],
  sourceRecordId: "test-fixture"
};

const ruleSet: RuleSet = {
  lotteryId: "example-lottery",
  version: "test-v1",
  effectiveFrom: "2026-01-01",
  evaluate: () => ({ status: "possible_match", explanationKey: "test.possible_match", matchedFields: ["numbers"] })
};

function request(overrides: Partial<MatchRequest> = {}): MatchRequest {
  return {
    ticket,
    result,
    ruleSet,
    now: new Date("2026-10-24T13:00:00.000Z"),
    maxResultAgeHours: 24,
    ...overrides
  };
}

describe("checkTicket safety gates", () => {
  it("requires the user to confirm the ticket reading", () => {
    expect(checkTicket(request({ ticket: { ...ticket, userConfirmed: false } })))
      .toEqual({ status: "cannot_check", reason: "ticket_unconfirmed" });
  });

  it("does not match an unverified source", () => {
    const unverified = { ...result, provenance: { ...result.provenance, verification: "unverified" as const } };
    expect(checkTicket(request({ result: unverified })))
      .toEqual({ status: "cannot_check", reason: "unverified_result" });
  });

  it("rejects results for another draw", () => {
    const otherDraw = { ...result, provenance: { ...result.provenance, drawDate: "2026-10-23" } };
    expect(checkTicket(request({ result: otherDraw })))
      .toEqual({ status: "cannot_check", reason: "wrong_draw" });
  });

  it("rejects stale results", () => {
    expect(checkTicket(request({ now: new Date("2026-10-26T13:00:00.000Z") })))
      .toEqual({ status: "cannot_check", reason: "stale_result" });
  });

  it("requires a rule set matching the exact lottery and version", () => {
    expect(checkTicket(request({ ruleSet: undefined })))
      .toEqual({ status: "cannot_check", reason: "rule_missing" });
    expect(checkTicket(request({ ruleSet: { ...ruleSet, version: "wrong-version" } })))
      .toEqual({ status: "cannot_check", reason: "rule_missing" });
  });

  it("delegates to the lottery-specific evaluator only after every gate passes", () => {
    expect(checkTicket(request())).toEqual({
      status: "possible_match",
      explanationKey: "test.possible_match",
      matchedFields: ["numbers"]
    });
  });
});
