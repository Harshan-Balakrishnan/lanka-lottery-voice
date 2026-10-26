import type { MatchOutcome, MatchRequest } from "./types.js";

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/**
 * Guard rails shared by every lottery-specific evaluator.
 * This function does not define prize rules and must not be treated as a board result.
 */
export function checkTicket(request: MatchRequest): MatchOutcome {
  const { ticket, result, ruleSet, now, maxResultAgeHours } = request;

  if (!ticket.userConfirmed ||
      !Array.isArray(ticket.numbers) ||
      ticket.numbers.length === 0 ||
      ticket.numbers.some((number) => typeof number !== "string" || number.trim().length === 0)) {
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
  if (!isValidIsoDate(ticket.drawDate) ||
      !isValidIsoDate(result.provenance.drawDate) ||
      result.provenance.board !== ticket.board ||
      result.provenance.lotteryId !== ticket.lotteryId ||
      result.provenance.drawDate !== ticket.drawDate) {
    return { status: "cannot_check", reason: "wrong_draw" };
  }

  let sourceIsHttps = false;
  try {
    sourceIsHttps = new URL(result.provenance.sourceUrl).protocol === "https:";
  } catch {
    sourceIsHttps = false;
  }
  if (!sourceIsHttps) {
    return { status: "cannot_check", reason: "unverified_result" };
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
      result.provenance.ruleSetVersion !== ruleSet.version ||
      !isValidIsoDate(ruleSet.effectiveFrom) ||
      (ruleSet.effectiveTo !== undefined && !isValidIsoDate(ruleSet.effectiveTo)) ||
      ticket.drawDate < ruleSet.effectiveFrom ||
      (ruleSet.effectiveTo !== undefined && ticket.drawDate > ruleSet.effectiveTo)) {
    return { status: "cannot_check", reason: "rule_missing" };
  }

  return ruleSet.evaluate(ticket, result);
}
