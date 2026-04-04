const { Router } = require('express');
const auth = require('../middleware/auth');
const userService = require('../services/userService');
const { getMe, updateMyRole } = require('../controllers/userController');

const router = Router();

// Attach the DB user to req.user after Clerk verification
async function attachDbUser(req, res, next) {
  try {
    req.user = await userService.getOrCreateUser(req.clerkUser);
    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve user', message: err.message });
  }
}

router.use(auth, attachDbUser);

router.get('/me', getMe);
router.put('/me/role', updateMyRole);

module.exports = router;
