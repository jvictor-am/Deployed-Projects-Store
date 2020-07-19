const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Project = require('../models/Project');

router.get('/add', ensureAuth, (req, res) => {
  res.render('projects/add');
});

module.exports = router;
