const express = require('express')

const { requireAuth } = require('../middleware/auth')
const { getUsageSnapshot } = require('../services/usageService')

const router = express.Router()

// GET /api/usage — today's report/chat quota usage for the current business
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const usage = await getUsageSnapshot(req.businessId)
    res.json(usage)
  } catch (err) {
    next(err)
  }
})

module.exports = router
