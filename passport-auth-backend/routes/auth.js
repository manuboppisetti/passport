const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'All fields are required.' });

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user.', error: err.message });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Error logging in.' });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: 'Error logging in.' });
            res.status(200).json({ message: 'Login successful.', user: { username: user.username } });
        });
    })(req, res, next);
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard.', user: req.user });
});

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logout successful.' });
    });
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Unauthorized' });
}

module.exports = router;
