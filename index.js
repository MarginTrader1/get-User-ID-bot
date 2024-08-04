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
import { getDateFromUnix } from "./service/service.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Пользователь в поиске */
let userInfo = {};

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
         const { message_id } = msg;
         const chatType = msg.chat.type;
         const chatId = msg.chat.id;
         const name = msg.from.first_name;
         const username = msg.from.username;
         const channel = msg.sender_chat;

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
            // запускам Telegram
            const client = new TelegramClient(stringSession, apiId, apiHash, {
               connectionRetries: 5,
            });
            await client.start({
               botAuthToken: token,
            });
            console.log(client.session.save());
            try {
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

               userInfo = userData;
               console.log(userData);

               const {
                  fullUser: {
                     id,
                     about,
                     birthday,
                     profilePhoto: { date: photoDate },
                     personalChannelId,
                     personalChannelMessage,
                  },
                  chats,
                  users,
               } = userInfo;

               // переменные для аккаунта позьзователя
               const {
                  deleted,
                  bot: userBot,
                  premium,
                  id: usersId,
                  firstName,
                  lastName,
                  username,
                  phone,
                  status,
                  langCode,
                  emojiStatus,
                  usernames,
               } = users[0];

               // переменные для каналов пользователя
               const {
                  scam,
                  id: channelId,
                  title,
                  username: channelName,
                  date: channelDate,
                  usernames: channelUsernames,
               } = chats?.[0] ?? {};

               // Оператор нулевого слияния (??): Если результат опциональной цепочки равен undefined или null,
               // оператор нулевого слияния заменяет его на пустой объект {}, чтобы избежать ошибки деструктуризации.

               const {
                  day: photoDay,
                  month: photoMonth,
                  year: photoYear,
               } = getDateFromUnix(photoDate);

               const {
                  day: channelDay,
                  month: channelMonth,
                  year: channelYear,
               } = getDateFromUnix(channelDate);

               await bot.sendMessage(
                  chatId,
                  `Я нашел такую информацию о пользователе:\n
<b>ID:</b> ${id}
<b>Имя:</b> ${firstName}
<b>Username:</b> @${username}
<b>Описание:</b> ${about}
<b>Телефон:</b> ${phone}
<b>Дата рождения:</b> ${birthday}
<b>Есть премиум:</b> ${premium}
<b>Дата создания:</b> ${photoDay}.${photoMonth}.${photoYear} 
                  
<b>Канал:</b> ${title}
<b>Username:</b> @${channelName}
<b>Дата создания:</b> ${channelDay}.${channelMonth}.${channelYear}`,
                  {
                     parse_mode: "HTML", // для форматирования текста
                  }
               );

               // Задержка между запросами
               await delay(2000); // 2 секунды
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
