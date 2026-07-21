const prisma = require('../lib/prisma')

const LIMITS = {
  reports: { column: 'reportsUsedToday', limit: 5 },
  chat: { column: 'chatMsgsUsedToday', limit: 20 },
}

/**
 * Atomically check-and-increment a daily usage counter for a business.
 * Resets the counter (in the same statement) the first time it's touched
 * on a new UTC day — no cron job needed.
 *
 * Race-safe: the WHERE clause only matches (and only then increments) if
 * the caller is still under the limit for today, so two concurrent
 * requests can't both slip through and overshoot the cap.
 *
 * @returns {{ allowed: boolean, used: number, limit: number }}
 */
async function checkAndIncrementUsage(businessId, kind) {
  const { column, limit } = LIMITS[kind]

  const rows = await prisma.$queryRawUnsafe(
    `UPDATE "Business"
     SET "${column}" = CASE WHEN "usageDate"::date = CURRENT_DATE THEN "${column}" + 1 ELSE 1 END,
         "usageDate" = CURRENT_DATE
     WHERE id = $1
       AND ("usageDate"::date IS DISTINCT FROM CURRENT_DATE OR "${column}" < $2)
     RETURNING "${column}" AS used`,
    businessId,
    limit,
  )

  if (rows.length === 0) {
    // Statement matched no row — quota already hit for today
    return { allowed: false, used: limit, limit }
  }

  return { allowed: true, used: Number(rows[0].used), limit }
}

/**
 * Read-only usage snapshot for both quotas — does not mutate state.
 * If usageDate isn't today, the stored counter is stale, so report 0 used
 * without writing to the DB (the next actual action will do the reset).
 */
async function getUsageSnapshot(businessId) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { reportsUsedToday: true, chatMsgsUsedToday: true, usageDate: true },
  })

  const today = new Date().toISOString().slice(0, 10)
  const usageDay = business?.usageDate ? business.usageDate.toISOString().slice(0, 10) : null
  const isToday = usageDay === today

  const tomorrowUTC = new Date()
  tomorrowUTC.setUTCHours(24, 0, 0, 0)

  return {
    reports: {
      used: isToday ? business.reportsUsedToday : 0,
      limit: LIMITS.reports.limit,
      remaining: LIMITS.reports.limit - (isToday ? business.reportsUsedToday : 0),
    },
    chat: {
      used: isToday ? business.chatMsgsUsedToday : 0,
      limit: LIMITS.chat.limit,
      remaining: LIMITS.chat.limit - (isToday ? business.chatMsgsUsedToday : 0),
    },
    resetsAt: tomorrowUTC.toISOString(),
  }
}

/**
 * Refund one unit of usage after a request that was counted but then
 * failed downstream (e.g. the Claude API call itself errored) — a failed
 * generation shouldn't cost the user part of their daily quota.
 */
async function refundUsage(businessId, kind) {
  const { column } = LIMITS[kind]
  await prisma.$executeRawUnsafe(
    `UPDATE "Business" SET "${column}" = GREATEST("${column}" - 1, 0) WHERE id = $1`,
    businessId,
  )
}

module.exports = { checkAndIncrementUsage, getUsageSnapshot, refundUsage }
