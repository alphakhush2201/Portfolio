const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rate limiting middleware - 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact form submissions from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting for GET requests
        return req.method === 'GET';
    },
    keyGenerator: (req, res) => {
        // Get client IP, handling proxies like Vercel
        return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
               req.headers['x-real-ip'] ||
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               req.ip || 
               'unknown';
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = async (req, res) => {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
        contactLimiter(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    }).catch((err) => {
        return res.status(429).json({ 
            success: false, 
            message: 'Too many contact form submissions from this IP. Please try again in 15 minutes.' 
        });
    });

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    try {
        const mailOptions = {
            from: {
                name: 'Portfolio Contact Form',
                address: process.env.EMAIL_USER
            },
            to: process.env.EMAIL_USER,
            subject: `New Contact from Portfolio: ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Contact Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};