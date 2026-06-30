const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const config = require('./config');

const app = express();
const port = process.env.PORT || 8000;

// Linux Server එකේ Web Service එක ක්‍රියාත්මකව තැබීමට
app.get('/', (req, res) => {
    res.send('CHANITHU MD is Running 24/7 ✅');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// WhatsApp Client එක Setup කිරීම
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Linux Server වලට මේක අනිවාර්යයි
    }
});

client.on('qr', qr => {
    console.log("Scan QR From WhatsApp Linked Devices:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(`${config.botName} is online successfully! ✅`);
});

client.on('message', msg => {
    const messageBody = msg.body.trim();

    // hi reply
    if (messageBody.toLowerCase() === "hi") {
        msg.reply("Hello 👋 I am " + config.botName + "\nHow can I help you today?");
    }

    // .menu හෝ !menu (Config එකේ තියෙන Prefix එක අනුව)
    if (messageBody === config.prefix + "menu") {
        msg.reply(
            `🤖 *${config.botName} Menu*\n\n` +
            `🧑 *Owner:* ${config.ownerName}\n` +
            `📞 *Number:* ${config.ownerNumber}\n\n` +
            `📌 *Available Commands:*\n` +
            `👉 *hi* - Auto reply\n` +
            `👉 *${config.prefix}menu* - Show this menu\n\n` +
            `💻 _Powered by Linux Server_`
        );
    }
});

client.initialize();
