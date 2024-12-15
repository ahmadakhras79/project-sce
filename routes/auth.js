const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // מודל המשתמש

const router = express.Router();

// מסלול הרשמה
router.post('/signup', async (req, res) => {
    console.log('Request body:', req.body); // לוג לעקוב אחרי גוף הבקשה
    const { username, email, password, gender } = req.body;

    if (!email || !password || !username || !gender) {
        console.log('Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        console.log('Checking if user exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);

        console.log('Creating new user...');
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender
        });

        console.log('Saving user...');
        await newUser.save();

        console.log('User created successfully');
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// מסלול התחברות
router.post('/login', async (req, res) => {
    console.log('Request body:', req.body); // לוג לעקוב אחרי גוף הבקשה
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        console.log('Searching for user...');
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Comparing passwords...');
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Generating JWT token...');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful');
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // בדוק אם המשתמש קיים
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // צור טוקן לאיפוס סיסמה
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // שליחת המייל עם Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // המייל שלך
                pass: process.env.EMAIL_PASS  // הסיסמה שלך או אפליקיישן פאס
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click the link below to reset your password:</p>
                   <a href="http://localhost:3000/reset-password.html?token=${resetToken}">Reset Password</a>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// מסלול לאיפוס סיסמה
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});


module.exports = router;