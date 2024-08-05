/* Функция для проверки даты на 1 символ */
export const checkDate = (number) => {
   if (number === undefined) {
      return `00`;
   }

   if (number.toString().length === 1) {
      return `0${number}`;
   }

   return number;
};
