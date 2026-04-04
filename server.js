const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (the frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Email endpoint
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, phone, company, postcode, requirement, communicationPref, message } = req.body;

    // For production, configure SMTP settings here:
    // This is set to an ethereal email account for testing if no real credentials are provided
    // Register at https://ethereal.email to test it, or use Gmail SMTP
    
    // Using Gmail SMTP requires App Passwords enabled on the Google Account.
    // Replace 'USER_EMAIL' and 'USER_APP_PASSWORD' with real credentials.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        // Send email
        const mailOptions = {
            from: 'bacslogisticsltd@gmail.com',
            to: 'bacslogisticsltd@gmail.com',
            subject: `New Quote Request from ${firstName} ${lastName} - BACS Logistics`,
            html: `
                <h3>New Quote Request Details</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Postcode:</strong> ${postcode}</p>
                <p><strong>Requirements:</strong> ${requirement ? requirement.join(', ') : 'None selected'}</p>
                <p><strong>Communication Preference:</strong> ${communicationPref}</p>
                <p><strong>Message:</strong><br/> ${message}</p>
            `
        };

        // Note: Unless you provide valid credentials above, sendMail will fail here.
        await transporter.sendMail(mailOptions);
        
        console.log("Email sent successfully to bacslogisticsltd@gmail.com");
        
        res.status(200).json({ success: true, message: 'Your request has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
});

// Let all other non-API routes point to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`BACS Logistics Server is running on http://localhost:${PORT}`);
});
