import type { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { RequestCustom } from "../types/request.js";

export default function authMiddleware(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error();
    }
    const { id, role } = jwt.verify(token, 'secret') as jwt.JwtPayload;
    if (typeof id === 'number' && (role === 'USER' || role === 'ADMIN')) {
      req.user = { id, role };
      next();
    }
  } catch (e) {
    return res.status(403).json({ message: 'Пользователь не авторизован'});
  }
}