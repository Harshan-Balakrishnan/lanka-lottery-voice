import type { MatchOutcome, MatchRequest } from "./types.js";

/**
 * Guard rails shared by every lottery-specific evaluator.
 * This function does not define prize rules and must not be treated as a board result.
 */
export function checkTicket(request: MatchRequest): MatchOutcome {
  const { ticket, result, ruleSet, now, maxResultAgeHours } = request;

  if (!ticket.userConfirmed) {
    return { status: "cannot_check", reason: "ticket_unconfirmed" };
  }
  if (!result) {
    return { status: "cannot_check", reason: "unverified_result" };
  }
  if (result.provenance.verification !== "verified") {
    return {
      status: "cannot_check",
      reason: result.provenance.verification === "stale" ? "stale_result" : "unverified_result"
    };
  }
  if (result.provenance.board !== ticket.board ||
      result.provenance.lotteryId !== ticket.lotteryId ||
      result.provenance.drawDate !== ticket.drawDate) {
    return { status: "cannot_check", reason: "wrong_draw" };
  }

  const retrievedAt = Date.parse(result.provenance.retrievedAt);
  if (!Number.isFinite(retrievedAt) || !Number.isFinite(now.getTime()) ||
      !Number.isFinite(maxResultAgeHours) || maxResultAgeHours < 0) {
    return { status: "cannot_check", reason: "unverified_result" };
  }
  if (now.getTime() - retrievedAt > maxResultAgeHours * 60 * 60 * 1000 ||
      retrievedAt > now.getTime()) {
    return { status: "cannot_check", reason: "stale_result" };
  }

  if (!ruleSet || ruleSet.lotteryId !== ticket.lotteryId ||
      result.provenance.ruleSetVersion !== ruleSet.version) {
    return { status: "cannot_check", reason: "rule_missing" };
  }

  if (ticket.numbers.length === 0) {
    return { status: "cannot_check", reason: "ticket_unconfirmed" };
  }

  return ruleSet.evaluate(ticket, result);
}
