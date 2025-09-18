import { Router } from "express";
import userController from "../controllers/user-controller.ts";
import authMiddleware from "../middleware/auth-middleware.ts";

const router = Router();

router.get('/users', authMiddleware, userController.getAll);
router.get('/users/:id', authMiddleware, userController.getUser);
router.post('/users/registrate', userController.create);
router.post('/users/login', userController.authUser);
router.put('/users/block/:id', authMiddleware, userController.blockUser);

export default router;