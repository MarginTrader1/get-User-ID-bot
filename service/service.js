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
