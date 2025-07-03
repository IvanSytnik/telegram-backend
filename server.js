const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/send-telegram', async (req, res) => {
  const { name, email, phone, message, interests, notifications } = req.body;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials are missing' });
  }

  const telegramMessage = `
    *New Contact Form Submission*
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}
    Interests: ${interests}
    Notifications: ${notifications}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: 'Markdown',
    });
    res.status(200).json({ success: true, message: 'Message sent to Telegram' });
  } catch (error) {
    console.error('Telegram API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send message to Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});