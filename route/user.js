const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
});

router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("token", token);
        
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(400).render('signin', {error:'Incorrect email or password'});
    }
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect('/signin');
    } catch (error) {
        console.error(error);
        return res.status(400).render('signup', { error: error.message });
    }
});
router.get('/logout',(req,res)=>{
res.clearCookie("token").redirect('/');
});

module.exports = router;
