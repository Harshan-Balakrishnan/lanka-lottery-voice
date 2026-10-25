import type { MatchOutcome, MatchRequest } from "./types.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isValidTimestamp(value: string): boolean {
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

/**
 * Safety gates shared by lottery-specific evaluators.
 * Source policy must set VERIFIED_CURRENT only after checking the draw identity,
 * source freshness and publication/correction state for that particular lottery.
 * This function intentionally has no universal max-age threshold.
 */
export function checkTicket(request: MatchRequest): MatchOutcome {
  const { ticket, result, ruleSet, now } = request;

  if (!ticket.userConfirmed) {
    return { status: "CANNOT_VERIFY", reason: "ticket_unconfirmed" };
  }
  if (!isValidIsoDate(ticket.drawDate) ||
      !ticket.lotteryId.trim() ||
      ticket.numbers.length === 0 ||
      ticket.numbers.some((value) => typeof value !== "string" || value.length === 0)) {
    return { status: "CANNOT_VERIFY", reason: "invalid_data" };
  }
  if (!result) {
    return { status: "CANNOT_VERIFY", reason: "missing_result" };
  }

  const provenance = result.provenance;
  switch (provenance.verification) {
    case "VERIFIED_BUT_OLD":
    case "SOURCE_UNAVAILABLE":
      return { status: "RESULT_NOT_CURRENT", explanationKey: "result.not_current" };
    case "CONFLICTING_SOURCES":
      return { status: "CANNOT_VERIFY", reason: "conflicting_sources" };
    case "CORRECTED_OR_SUPERSEDED":
      return { status: "CANNOT_VERIFY", reason: "corrected_or_superseded" };
    case "UNVERIFIED":
      return { status: "CANNOT_VERIFY", reason: "unverified_result" };
    case "VERIFIED_CURRENT":
      break;
    default:
      return { status: "CANNOT_VERIFY", reason: "unverified_result" };
  }

  if (!isValidIsoDate(provenance.drawDate) ||
      !isValidTimestamp(provenance.retrievedAt) ||
      !Number.isFinite(now.getTime()) ||
      Date.parse(provenance.retrievedAt) > now.getTime() ||
      !provenance.sourceUrl.startsWith("https://") ||
      !provenance.schemaVersion.trim() ||
      !result.sourceRecordId.trim() ||
      result.winningNumbers.length === 0 ||
      result.winningNumbers.some((value) => typeof value !== "string" || value.length === 0)) {
    return { status: "CANNOT_VERIFY", reason: "invalid_data" };
  }

  if (provenance.board !== ticket.board ||
      provenance.lotteryId !== ticket.lotteryId ||
      provenance.drawDate !== ticket.drawDate ||
      (ticket.drawNumber !== undefined && provenance.drawNumber !== ticket.drawNumber)) {
    return { status: "CANNOT_VERIFY", reason: "wrong_draw" };
  }

  if (!ruleSet) {
    return { status: "CANNOT_VERIFY", reason: "rule_missing" };
  }
  if (ruleSet.lotteryId !== ticket.lotteryId ||
      provenance.ruleSetVersion !== ruleSet.version ||
      !isValidIsoDate(ruleSet.effectiveFrom) ||
      (ruleSet.effectiveTo !== undefined && !isValidIsoDate(ruleSet.effectiveTo)) ||
      ruleSet.effectiveFrom > ticket.drawDate ||
      (ruleSet.effectiveTo !== undefined && ruleSet.effectiveTo < ticket.drawDate) ||
      (ruleSet.effectiveTo !== undefined && ruleSet.effectiveTo < ruleSet.effectiveFrom)) {
    return { status: "CANNOT_VERIFY", reason: "rule_missing" };
  }

  return ruleSet.evaluate(ticket, result);
}
