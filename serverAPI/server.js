/* Функция получения данных с сервера index_fear */
export const getServerIndexFear = async () => {
   const url = "https://66a6998323b29e17a1a31269.mockapi.io/index_fear";

   return fetch(url, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   })
      .then((response) => response.json())
      .catch((error) => {
         console.error("Ошибка:", error);
      });
};

/* Функция добавления данных на сервер index_fear */
export const addServerIndexFear = ({ photo, caption }) => {

   // console.log(photo)
   // console.log(caption)

   const checkCaption = (photo, caption) => {
      if (photo === undefined) {
         return;
      }

      const object = {
         [`${caption}`]: `${photo[0].file_id}`,
      };
      return object;
   };

   const object = checkCaption(photo, caption);

   console.log(object)

   const url = "https://66a6998323b29e17a1a31269.mockapi.io/index_fear";

   fetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
   })
      .then((response) => response.json())
      .catch((error) => {
         console.error("Ошибка:", error);
      });
};
