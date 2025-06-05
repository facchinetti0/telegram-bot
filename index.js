require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;
const webhookUrl = //telegram-bot-guvs.onrender.com;

if (!token) {
  console.error('❌ BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

if (!webhookUrl) {
  console.error('❌ WEBHOOK_URL non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

// Middleware per leggere JSON nel body
app.use(bodyParser.json());

// Inizializza il bot senza polling
const bot = new TelegramBot(token);
bot.setWebHook(`${webhookUrl}/bot${token}`);

// Route ping per UptimeRobot
app.get('/ping', (req, res) => {
  res.send('Bot attivo ✅');
});

// Route webhook per ricevere aggiornamenti da Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Avvia il server Express
app.listen(port, () => {
  console.log(`✅ Server attivo su porta ${port}`);
});

// Comandi Telegram
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
`);
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, `
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

console.log('🤖 Bot avviato con webhook!');
