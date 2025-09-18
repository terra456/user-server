import { type Response } from 'express';
import userService from '../service/user-service.ts';
import ErrorResponse, { AccessDenied } from '../utils/error-response.ts';
import jwt from 'jsonwebtoken';
import type { RequestCustom } from '../types/request.js';

const generateAcessToken = (id: number, role: 'ADMIN' | 'USER') => {
  const payload = { id, role };
  return jwt.sign(payload, 'secret', {expiresIn: '24h'})
}

class UserController {
  async create(req: RequestCustom, res: Response) {
    try {
      const { name, email, password, birthday, role } = req.body;
      const birthDay = new Date(birthday);
      const adminRole = typeof role === 'string' && role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
      if (typeof name === 'string' && typeof email === 'string' && typeof password === 'string') {
        const user = await userService.create({ name, email, password, birthDay, role: adminRole, isActive: true });
        res.status(201).json(user);
      } else {
        throw new ErrorResponse(400, 'Данные некорректны');
      }
    } catch (e) {
      if (e instanceof ErrorResponse) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  }

  async getAll(req: RequestCustom, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        throw new AccessDenied();
      }
      const users = await userService.getAll();
      if (users) {
        return res.status(200).json(users);
      }
    } catch (e) {
      if (e instanceof ErrorResponse) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  }

  async getUser(req: RequestCustom, res: Response) {
    try {
      if (!req.user?.id) {
        throw new AccessDenied();
      }
      const id = Number(req.params?.id);
      if (!!id) {
        if (req.user?.role === 'ADMIN' || req.user?.id === id) {
          const user = await userService.getOneById(id);
          return res.status(200).json(user);
        } else {
          throw new AccessDenied();
        }
      } else {
        throw new ErrorResponse(400, 'Id пользователя не верный');
      }
    } catch (e) {
      if (e instanceof ErrorResponse) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  }

  async blockUser(req: RequestCustom, res: Response) {
    try {
      if (!req.user?.id) {
        throw new AccessDenied();
      }
      const id = Number(req.params?.id);
      if (!!id) {
        if (req.user?.role === 'ADMIN' || req.user?.id === id) {
          const user = await userService.getOneById(id);
          if (user) {
            const blockedUser = await userService.blockUser(id);
            return res.status(200).json(blockedUser);
          }
        } else {
          throw new AccessDenied();
        }
      } else {
        throw new ErrorResponse(400, 'Id пользователя не верный');
      }
    } catch (e) {
      if (e instanceof ErrorResponse) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  }

  async authUser(req: RequestCustom, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.auth({ email, password });
      const token = generateAcessToken(user.id, user.role)
      return res.status(200).json({ token });
    } catch (e) {
      if (e instanceof ErrorResponse) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  }
}

export default new UserController();