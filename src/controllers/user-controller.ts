import { type Request, type Response } from 'express';
import userService from '../service/user-service.ts';

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, birthday, role } = req.body;
      const birthDay = new Date(birthday);
      if ( typeof name === 'string' && typeof email === 'string' && typeof password === 'string' ) {
        const user = await userService.create({ name, email, password, birthDay, role: 'USER', isActive: true });
        return res.json(user);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAll();
      if (users) {
        console.log('getAll', users);
        return res.json(users);
      }
    } catch (e) {
      res.status(500).json(e);
    }

  }
}

export default new UserController();