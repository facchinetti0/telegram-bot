require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint finto per tenere sveglio Render
app.get('/ping', (req, res) => {
  res.send('Bot attivo ✅');
});

app.listen(port, () => {
  console.log(`Web server attivo su http://localhost:${port}`);
});

// Avvio del bot Telegram
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
`);
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text && (msg.text.startsWith('/start') || 
                   msg.text.startsWith('/help') || 
                   msg.text.startsWith('/info'))) {
    return;
  }

  bot.sendMessage(chatId, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

console.log('Bot avviato con successo!');
