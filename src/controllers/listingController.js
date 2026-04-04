const listingService = require('../services/listingService');

async function getListings(req, res) {
  try {
    const { category, type, condition } = req.query;
    const listings = await listingService.getListings({ category, type, condition });
    res.json(listings);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getListing(req, res) {
  try {
    const listing = await listingService.getListing(req.params.id);
    res.json(listing);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function createListing(req, res) {
  try {
    const listing = await listingService.createListing(req.user.id, req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateListing(req, res) {
  try {
    const listing = await listingService.updateListing(req.params.id, req.user.id, req.body);
    res.json(listing);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function deleteListing(req, res) {
  try {
    await listingService.deleteListing(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getListings, getListing, createListing, updateListing, deleteListing };
