/* Функция получения числа из UNIX времени  */
export const getDateFromUnix = (unixDate) => {
   const date = new Date(unixDate * 1000);
   const year = date.getFullYear(); // Получить год
   const month = date.getMonth() + 1; // Получить месяц (0 - 11, добавляем 1 для нормальных чисел)
   const day = date.getDate(); // Получить день
   return { day, month, year };
};

/* Функция конвертации времени до Update  */
export const convertMs = (ms) => {
   const hours = Math.floor(ms / 3600); // 3600 секунд в часе
   const remainingSeconds = ms % 3600;
   const minutes = Math.floor(remainingSeconds / 60); // 60 секунд в минуте
   const seconds = remainingSeconds % 60;

   return { hours, minutes };
};

// функция для получения ID фото файла
export const getPhotoFileId = (index, array) => {
   const object = array[0];
   const fileId = object[index];
   return fileId;
};

// функция makeMessage для проверки ключей с ответа с сервера Telegram
// и формирования ответа по пользователю

export const makeMessage = (userInfo, getDateFromUnix, checkDate) => {
   let messageArray = [];
   const {
      fullUser: {
         id,
         about,
         birthday,
         profilePhoto,
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
      day: channelDay,
      month: channelMonth,
      year: channelYear,
   } = getDateFromUnix(channelDate);

   // блок проверок
   if (id) {
      messageArray.push(`<b>ID:</b> <code>${id}</code>`);
   }
   if (firstName) {
      messageArray.push(`<b>Имя:</b> ${firstName}`);
   }
   if (lastName) {
      messageArray.push(`<b>Фамилия:</b> ${lastName}`);
   }
   if (username) {
      messageArray.push(`<b>Username:</b> @${username}`);
   }
   if (about) {
      messageArray.push(`<b>Описание:</b> ${about}`);
   }
   if (phone) {
      messageArray.push(`<b>Телефон:</b> +${phone}`);
   }
   if (birthday) {
      const {
         day: birthdayDay,
         month: birthdayMonth,
         year: birthdayYear,
      } = birthday;

      messageArray.push(
         `<b>Дата рождения:</b> ${checkDate(birthdayDay)}.${checkDate(
            birthdayMonth
         )}.${checkDate(birthdayYear)}`
      );
   }
   if (premium) {
      messageArray.push(`<b>Есть премиум:</b> ${premium}`);
   }
   if (langCode) {
      messageArray.push(`<b>Язык:</b> ${langCode}`);
   }
   if (profilePhoto) {
      const { date: photoDate } = profilePhoto;
      const {
         day: photoDay,
         month: photoMonth,
         year: photoYear,
      } = getDateFromUnix(photoDate);

      messageArray.push(
         `<b>Дата фото:</b> ${checkDate(photoDay)}.${checkDate(
            photoMonth
         )}.${photoYear}`
      );
   }
   if (title) {
      messageArray.push(`\n<b>Канал:</b> ${title}`);
   }
   if (channelName) {
      messageArray.push(`<b>Username:</b> @${channelName}`);
   }
   if (channelDate) {
      messageArray.push(
         `<b>Дата создания:</b> ${checkDate(channelDay)}.${checkDate(
            channelMonth
         )}.${channelYear}`
      );
   }
   if (scam) {
      messageArray.push(`<b>Метка scam:</b> @${scam}`);
   }

   return messageArray.join("\n");
};

// стандартное сообщение при получении сообщения
export const makeStandartMessage = (
   dataMessage,
   getDateFromUnix,
   checkDate
) => {
   let messageArray = [];

   const { from, chat, date, forward_origin, forward_from, forward_date } =
      dataMessage;

   // блок проверок from - кто прислал
   if (from.id) {
      messageArray.push(`👤 <b>You</b>\n├<b>id:</b> <code>${from.id}</code>`);
   }
   if (from.is_bot) {
      messageArray.push(`├<b>is bot:</b> ${from.is_bot}`);
   }
   if (from.first_name) {
      messageArray.push(`├<b>first name:</b> ${from.first_name}`);
   }
   if (from.last_name) {
      messageArray.push(`├<b>last name:</b> ${from.last_name}`);
   }
   if (from.username) {
      messageArray.push(`├<b>username:</b> @${from.username}`);
   }
   if (from.language_code) {
      messageArray.push(`├<b>language:</b> ${from.language_code}`);
   }
   if (from.is_premium) {
      messageArray.push(`└<b>is premium:</b> ${from.is_premium}\n`);
   }

   // блок проверок forward_from - от кого сообщение
   if (forward_from.id) {
      messageArray.push(
         `👤 <b>Forward message</b>\n├<b>id:</b> <code>${forward_from.id}</code>`
      );
   }
   if (forward_from.is_bot) {
      messageArray.push(`├<b>is bot:</b> ${forward_from.is_bot}`);
   }
   if (forward_from.first_name) {
      messageArray.push(`├<b>first name:</b> ${forward_from.first_name}`);
   }
   if (forward_from.last_name) {
      messageArray.push(`├<b>last name:</b> ${forward_from.last_name}`);
   }
   if (forward_from.username) {
      messageArray.push(`├<b>username:</b> @${forward_from.username}`);
   }
   if (forward_from.language_code) {
      messageArray.push(`├<b>language:</b> ${forward_from.language_code}`);
   }
   if (forward_from.is_premium) {
      messageArray.push(`└<b>is premium:</b> ${forward_from.is_premium}\n`);
   }

   // date
   if (forward_date) {
      const { day, month, year } = getDateFromUnix(forward_date);
      messageArray.push(
         `📃 <b>Message</b>\n└<b>message date:</b> ${checkDate(day)}.${checkDate(
            month
         )}.${checkDate(year)}\n`
      );
   }

   return messageArray.join("\n");
};
