const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
app.get("/", (req, res) => {
    res.send("Server is working")
})


app.post("/api/contact", async (req, res) => {
    console.log("Received contact form submission:", req.body);
    const { fullName, email, subject, contact_No } = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: `New Contact Form Submission from ${fullName}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contact Number:</strong> ${contact_No}</p>
                <p><strong>Subject:</strong> ${subject}</p>
            `
        });

        if (error) {
            console.error('❌ Resend error:', error);
            throw error;
        }

        console.log('✅ Email sent successfully', data);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

const PORT = process.env.PORT 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))