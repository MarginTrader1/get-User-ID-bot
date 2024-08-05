import TelegramApi from "node-telegram-bot-api";

/* блок импортов для GramJS */
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";

const stringSession = new StringSession("");
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

import { Api } from "telegram/tl/index.js";

/* Токены для доступа к ботам */
import { token, apiHash, apiId, phoneNumber } from "./config/secret.js";

/* Импорт вспомогательных функций */
import { makeMessage, getDateFromUnix } from "./service/service.js";
import { checkDate } from "./checkers/checkers.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Инициализируем бот */
const bot = new TelegramApi(token, { polling: true });

/* Функция удаления сообщений */
const deleteMessage = async (chatId, messageId) => {
   await bot
      .deleteMessage(chatId, messageId)
      .then(() => {
         console.log("Сообщение успешно удалено");
      })
      .catch((error) => {
         console.error("Ошибка при удалении сообщения:", error);
      });
};

/* ------------------------------ ЗАПУСКАЕМ БОТА ------------------------------------------------------------------ */

(async () => {
   /* Список команд для бота */
   bot.setMyCommands([{ command: "/start", description: "Старт" }]);

   /* Чтение сообщений */
   bot.on("message", async (msg) => {
      try {
         console.log(msg);

         const message = msg.text;
         const chatType = msg.chat.type;
         const chatId = msg.chat.id;
         const name = msg.from.first_name;

         /* Проверка на команду /start */
         if (message === "/start" && chatType === "private") {
            await bot.sendMessage(
               chatId,
               `Привет, <b>${name}!</b> Перешли мне сообщение, а я постараюсь найти в Telegram всю возможную информацию о пользователе или группе`,
               {
                  parse_mode: "HTML", // для форматирования текста
               }
            );
            return;
         }

         /* Проверка на пересылку */
         if (msg.forward_origin.type === "hidden_user") {
            await bot.sendMessage(
               chatId,
               `Этот пользователь <b>${username}</b> скрыл информацию о своем аккаунте в настройках конфиденциальности Telegram, поэтому я не могу ничего рассказать о нем.`,
               {
                  parse_mode: "HTML", // для форматирования текста
               }
            );
            return;
         }

         /* Проверка на пересылку */
         if (msg.forward_origin) {
            try {
               // запускам Telegram c задержкой между запросами 5 секунд
               await delay(4000); // 4 секунды
               const client = new TelegramClient(
                  stringSession,
                  apiId,
                  apiHash,
                  {
                     connectionRetries: 5,
                  }
               );
               await client.start({
                  botAuthToken: token,
               });
               console.log(client.session.save());

               // получение информации
               const entity = await client.getEntity(
                  msg.forward_origin.sender_user.username
               );

               // Задержка между запросами
               await delay(2000); // 2 секунды

               const userData = await client.invoke(
                  new Api.users.GetFullUser({
                     id: entity,
                  })
               );

               // проверка ответа с сервера TG и создание сообщения
               const message = makeMessage(
                  userData,
                  getDateFromUnix,
                  checkDate
               );

               // console.log(`Сообщение о юзере ${message}`);

               await bot.sendMessage(chatId, message, {
                  parse_mode: "HTML", // для форматирования текста
                  disable_web_page_preview: true, // чтобы отключить предварительный просмотр ссылок
               });
            } catch (error) {
               console.log(error.response);
            }
            return;
         }
      } catch (error) {
         console.log(error.response?.body);
      }
   });
})();
