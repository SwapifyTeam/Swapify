const userService = require('../services/userService');

async function getMe(req, res) {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateMyRole(req, res) {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }
    const user = await userService.updateUserRole(req.user.id, role);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getMe, updateMyRole };
