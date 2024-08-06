/* Функция получения данных с сервера index_fear */
export const getServerUser = async () => {
   const url = "https://66a6998323b29e17a1a31269.mockapi.io/users/:1";

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

/* Функция добавления данных на сервер user */
export const addServerUser = (entity) => {
   const createObject = (entity) => {
      const {
         id: { value },
         firstName,
         lastName,
         username,
      } = entity;
      if (value === undefined) {
         return;
      }

      const object = {
         [`${value}`]: [
            {
               firstName: firstName,
               lastName: lastName,
               username: username,
            },
         ],
      };
      return object;
   };

   const object = createObject(entity);

   const url = "https://66a6998323b29e17a1a31269.mockapi.io/users/:1";

   fetch(url, {
      method: "PUT",
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
