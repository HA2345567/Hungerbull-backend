import express, { RequestHandler } from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
router.put("/", jwtCheck,
    jwtParse as RequestHandler,
    upload.single("imageFile"),
    validateMyRestaurantRequest as unknown as RequestHandler,MyRestaurantController.updateMyRestaurant as RequestHandler)
router.get("/", jwtCheck, jwtParse as RequestHandler, MyRestaurantController.getMyRestaurant as RequestHandler)

router.post(
    '/',
    jwtCheck,
    jwtParse as RequestHandler,
    upload.single("imageFile"),
    validateMyRestaurantRequest as unknown as RequestHandler,
    MyRestaurantController.createMyRestaurant
);

export default router;