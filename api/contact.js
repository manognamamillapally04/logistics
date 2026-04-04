const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { firstName, lastName, email, phone, company, postcode, requirement, communicationPref, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
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

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Your request has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
}
