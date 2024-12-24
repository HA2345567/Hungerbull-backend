import express, { RequestHandler } from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();
router.get('/', jwtCheck, jwtParse as RequestHandler, MyUserController.getCurrentUser);
router.post('/', jwtCheck, MyUserController.createCurrentUser);
router.put('/', jwtCheck, jwtParse as RequestHandler, validateMyUserRequest as unknown as RequestHandler, MyUserController.updateCurrentUser);

export default router;