import TelegramApi from "node-telegram-bot-api";

/* блок импортов для GramJS */
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

let stringSession = new StringSession("");

import { Api } from "telegram/tl/index.js";

/* Токены для доступа к ботам */
import { token, apiHash, apiId, phoneNumber } from "./config/secret.js";

/* Импорт вспомогательных функций */
import { makeMessage, getDateFromUnix } from "./service/service.js";
import { checkDate } from "./checkers/checkers.js";

/* Создание промиса для задержки запроса */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Инициализируем бот */
const bot = new TelegramApi(token, { polling: true });

/* ------------------------------ ЗАПУСКАЕМ БОТА ------------------------------------------------------------------ */

(async () => {
   // запускам Telegram
   const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
   });

   await client.start({
      botAuthToken: token,
   });
   console.log(client.session.save());

   /* Список команд для бота */
   bot.setMyCommands([{ command: "/start", description: "Старт" }]);

   /* Чтение сообщений */
   bot.on("message", async (msg) => {
      try {
         // console.log(msg);

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
               `Этот пользователь <b>${msg.forward_origin.sender_user_name}</b> скрыл информацию о своем аккаунте в настройках конфиденциальности Telegram, поэтому я не могу ничего рассказать о нем.`,
               {
                  parse_mode: "HTML", // для форматирования текста
               }
            );
            return;
         }

         /* Проверка на пересылку */
         if (msg.forward_origin) {
            try {
               console.log(`Ниже будет код для stringSession`);
               console.log(stringSession);

               // Задержка между запросами
               await delay(4000); // 4 секунды

               const entity = await client.getEntity(
                  msg.forward_origin.sender_user.id
               );

               // Задержка между запросами
               await delay(2000); // 2 секунды

               const userData = await client.invoke(
                  new Api.users.GetFullUser({
                     id: entity,
                  })
               );

               console.log(`Ниже будет код для объекта User`);
               console.log(userData);

               // проверка ответа с сервера TG и создание сообщения
               const message = makeMessage(
                  userData,
                  getDateFromUnix,
                  checkDate
               );
               

               await bot.sendMessage(chatId, message, {
                  parse_mode: "HTML", // для форматирования текста
                  disable_web_page_preview: true, // чтобы отключить предварительный просмотр ссылок
               });
            } catch (error) {
               console.log(error);
            }
            return;
         }
      } catch (error) {
         console.log(error.response?.body);
      }
   });
})();
