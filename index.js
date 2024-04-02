const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "7002272799:AAEZTz3wCJo3RVyCtYbKcHJCvJbkk1WlLzA";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Try to guess the number from 1 to 5 I wished`);
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "I guessed!", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Start Command"},
        {command: "/info", description: "Information"},
        {command: "/game", description: "Try to find guessed number"}
    ]);
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendMessage(chatId, "This is a test bot for development purposes, please, write something");
            return  bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/3.webp");
        }

        if (text === "/info") {
            return bot.sendMessage(chatId, `Your name is ${msg.from.username}`);
        }

        if (text === "/game") {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "I'm just a bot, not understanding you -_-)")
    });

    bot.on("callback_query", msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
      
        if (data === "/again") {
            return startGame(chatId);
        }
        console.log("data === chats[chatId]", data, chats[chatId]);
        if (+data === chats[chatId]) {
            return bot.sendMessage(chatId, "Congratulations! You won!", againOptions);
        }

        return bot.sendMessage(chatId, `My number was ${chats[chatId]}`, againOptions);
    });
}

start();