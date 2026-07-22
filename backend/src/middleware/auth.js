const prisma = require('../lib/prisma')
const { createClient } = require('@supabase/supabase-js')


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)


async function requireAuth(req, res, next) {
  try {
    // 1. Extract Bearer token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const token = authHeader.slice(7)

    // 2. Verify JWT with Supabase — validates signature + expiry
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // 3. Resolve business for this user
    // If the client sends x-business-id, verify the user owns that business.
    // Otherwise fall back to the first business for this user.
    const requestedId = req.headers['x-business-id']

    let business
    if (requestedId) {
      business = await prisma.business.findFirst({
        where: { id: requestedId, userId: user.id },
        select: { id: true },
      })
      if (!business) {
        return res.status(403).json({ error: 'Business not found or access denied' })
      }
    } else {
      // Upsert on the unique userId — atomic, so concurrent first-login
      // requests can't race and create duplicate businesses for one user.
      const emailName = (user.email || '').split('@')[0] || 'My Business'
      const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
      business = await prisma.business.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          name: displayName,
          cashOnHand: 0,
        },
        select: { id: true },
      })
    }

    // 4. Attach to req — routes use req.businessId, never req.body/query
    req.user = user
    req.businessId = business.id

    // 5. Structured audit log
    console.log(JSON.stringify({
      event: 'data_access',
      userId: user.id,
      businessId: business.id,
      method: req.method,
      path: req.path,
      ip: req.ip,
      ts: new Date().toISOString(),
    }))

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { requireAuth }
