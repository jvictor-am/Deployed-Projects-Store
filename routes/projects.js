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
    return res.render('error/500');
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
    return res.render('error/500');
  }
});

router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id }).lean();

    if (!project) {
      return res.render('error/404');
    }

    if (project.user != req.user.id) {
      res.redirect('/projects');
    } else {
      res.render('projects/edit', { project });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/404');
  }
});

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.render('error/404');
    }

    if (project.user != req.user.id) {
      res.redirect('/projects');
    } else {
      project = await Project.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Project.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

module.exports = router;
