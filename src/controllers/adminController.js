const analyticsModel = require('../models/analyticsModel');

const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getAnalytics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAnalytics };