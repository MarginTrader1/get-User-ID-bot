/* Кнопка - для добавления в чаты */
export const moreInfoButton = JSON.stringify({
   inline_keyboard: [
      [
         {
            text: "Get more info",
            callback_data: "/more_info",
         },
      ],
   ],
});
