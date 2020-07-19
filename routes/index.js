const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Project = require('../models/Project');

router.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).lean();

    res.render('dashboard', {
      name: req.user.firstName ? req.user.firstName : req.user.displayName,
      projects,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
