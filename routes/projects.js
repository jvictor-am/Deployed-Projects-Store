const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Project = require('../models/Project');

router.get('/add', ensureAuth, (req, res) => {
  res.render('projects/add');
});

router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Project.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.get('/', ensureAuth, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('projects/index', { projects });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
  // res.render('projects/add');
});

module.exports = router;
