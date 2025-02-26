const express = require('express');
const router = express.Router();
const User = require('../model/user-Schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            username,
            email,
            password:hashedPassword
        });
        
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Registration failed',
            error: error.message
        });
    }
})

router.post('/login', async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'User not Found'})
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({ message:"Invalid password"});
        }

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
        res.json({ 
            token, 
            userId: user._id,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
})
//here
module.exports = router