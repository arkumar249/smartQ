// routes/dashboardRoutes.js
const express = require('express');
const requireAuth = require('../middlewares/reqauth'); // protects the route
const authorizeRoles=require("../middlewares/authorizeRoles");

const store = require('../models/store');
const token = require('../models/token');
const router = express.Router();



router.get('/admin', requireAuth , authorizeRoles("admin"), (req, res) => {
  res.render('adminDashboard', {
    title: 'Admin Dashboard',
    user: req.user,
  });
});

router.get('/superadmin', requireAuth, authorizeRoles("superadmin"),  (req, res) => {
  res.render('superadminDashboard', {
    title: 'Super Admin Dashboard',
    user: req.user,
  });
});

module.exports = router;
