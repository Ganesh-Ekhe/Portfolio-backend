import express from "express";
import Contact from "../models/ContactModel.js";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Handle Contact Form Submission
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save message to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send email to yourself
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Message Sent Successfully & Email Sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

export default router;
