
/* Кнопки Биткоин аналитики */
export const analyticsOptions = {
   reply_markup: JSON.stringify({
      inline_keyboard: [
         [{ text: "Мой анализ", callback_data: "/my_analytics" }],
         [{ text: "Elliott Wave International", callback_data: "/ewi" }],
         [{ text: "Waves89", callback_data: "/waves89" }],
         [{ text: "Decodejar", callback_data: "/decodejar" }],
         [{ text: "Bluntz", callback_data: "/bluntz" }],
      ],
   }),
   parse_mode: "HTML", // для форматирования текста
};

/* Кнопка - для "Другиe публикации" */
export const ewaBackOther = JSON.stringify({
   inline_keyboard: [[{ text: "Другие публикации", callback_data: "/ewa_other" }], [{ text: "Вернуться назад", callback_data: "/ewa_back_other" }]],
});


// web_app: {url:"https://margintrader1.github.io/Test-Burger-Bot/" - вместо колбэка в кнопку для открытия старнички
// inline_keyboard: - кнопки в чате
// keyboard - кнопки под чатом
