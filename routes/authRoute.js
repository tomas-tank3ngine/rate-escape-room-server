const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to initiate Google authentication
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

// Route to handle Google callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;