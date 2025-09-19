## Подготовка

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Загрузка

```
git clone git@github.com:terra456/user-server.git
```

Установить зависимости

```
npm install
```

Переименовать .env.example

```
cp .env.example .env
```

Сгенерировать prisma

```
npx prisma generate
```

## Запуск

Старт dev сервера prisma

```
npx prisma dev
```

Запуск самого сервера

```
npm run dev
```

Сервер доступен по адресу http://localhost:3000
Номер порта можно изменить в .env файле.

## Сторонняя база данных

Данные о сервере БД хранятся в .env файле. Следует внести туда адрес, включающий информацию о пользователе и пароле по схеме:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Произвести миграцию базы

```
prisma migrate dev
```

## Данные о пользователе в базе имеют следующую структуру:

```typescript
interface User {
  id: number; // генерируется автоматически
  name: string;
  birthDay: Date;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
}
```

## Endpoints

- `Регистрация пользователя`

  ```typescript
  interface CreateUserDto {
    name: string;
    birthday: Date | string;
    email: string; //уникальное значение
    password: string;
    role: "USER" | "ADMIN"; // если не указано то 'USER'
    isActive: boolean; // по умолчанию true
  }
  ```

  - `POST users/registrate` - отправьте заппрос и в теле укажите данные по указанной выше схеме в формате json
    - Ответ сервера `status code` **201** и созданная запись, если данные верные
    - Ответ сервера `status code` **400** и соответвующее сообщение, если данные не соответвуют параметрам, или пользователь с таким `email` существует

- `Авторизация пользователя`
  - `POST /users/login` - отправьте `email` и `password` чтобы получить Access token
    - Ответ сервера `status code` **200** и токен, если данные верные
    - Ответ сервера `status code` **400** если данные не валидные
    - Ответ сервера `status code` **404** и сообщение, если пользователь не найден
    - Ответ сервера `status code` **403** если аутентификация провалилась
- `Получение списка пользователей` (только для админа)
  - `GET /users` - получение списка всех пользователей
    - Ответ сервера `status code` **200** и весь список
    - Ответ сервера `status code` **403** если запрос сделан не администратором
- `Получение пользователя по ID`
  - `GET /users/:id` - получение отдельного пользователя
    - Ответ сервера `status code` **200** и запись данных пользователя
    - Ответ сервера `status code` **400** если id некорректный (не число)
    - Ответ сервера `status code` **404** и сообщение, если пользователь не найден
    - Ответ сервера `status code` **403** если запрос сделан не администратором или id не совпадает
- `Блокировка пользователя`
  - `POST /users/block/:id`
    - Ответ сервера `status code` **200** и запись данных пользователя
    - Ответ сервера `status code` **400** если id невалиден (не число)
    - Ответ сервера `status code` **404** и сообщение, если пользователь не найден
    - Ответ сервера `status code` **403** если запрос сделан не администратором или id не совпадает
