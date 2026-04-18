const { createClerkClient, verifyToken } = require('@clerk/backend');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add timeout to Clerk API call
    const clerkUser = await Promise.race([
      clerk.users.getUser(userId),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Clerk API timeout')), 5000))
    ]);
    req.clerkUser = clerkUser;
    req.authId = userId;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Unauthorized', message: err.message });
  }
}

module.exports = auth;
