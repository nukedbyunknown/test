// server.js
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route: Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route: Table booking form (POST)
app.post("/book", async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Send email to owner (optional)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // send to yourself
      subject: `New Booking from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message || ""}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: "Booking received!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending booking." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ KOMO Lounge backend running on http://localhost:${PORT}`);
});
