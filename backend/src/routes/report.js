const prisma = require('../lib/prisma')
const express = require('express')

const { generateReport } = require('../services/aiService')
const { requireAuth } = require('../middleware/auth')
const { checkAndIncrementUsage, refundUsage } = require('../services/usageService')

const router = express.Router()


// POST /api/report/generate
// Daily quota (5/day/business, persisted in the DB — survives restarts,
// unlike the old in-memory hourly limiter) guards spend on the 3-agent
// Claude pipeline.
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const businessId = req.businessId // from JWT via requireAuth

    const usage = await checkAndIncrementUsage(businessId, 'reports')
    if (!usage.allowed) {
      return res.status(429).json({
        error: `Daily report limit reached (${usage.limit}/day). Resets at midnight UTC.`,
        usage,
      })
    }

    let report
    try {
      report = await generateReport(businessId)
    } catch (genErr) {
      // Don't charge the daily quota for a generation that failed
      await refundUsage(businessId, 'reports')
      throw genErr
    }
    res.json(report)
  } catch (err) {
    next(err)
  }
})

// GET /api/report/latest
router.get('/latest', requireAuth, async (req, res, next) => {
  try {
    const businessId = req.businessId // from JWT via requireAuth
    const report = await prisma.aIReport.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    })
    if (!report) return res.status(404).json({ error: 'No report found' })
    res.json(report)
  } catch (err) {
    next(err)
  }
})

module.exports = router
