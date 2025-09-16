import { Router } from "express";
import userController from "../controllers/user-controller.ts";

const router = Router();

// router.get('/auth/login');

// router.get('/users/:id');
router.get('/users', userController.getAll);
router.post('/users', userController.create);
// router.put('/users/:id');
// router.delete('/users/:id');

// Регистрация пользователя
// Авторизация пользователя - любой механизм
// 3 Получение пользователя по ID (Может получить либо админ либо пользователь сам
// себя)
// 4 Получение списка пользователей - только для админа
// 5 Блокировка пользователя

export default router;