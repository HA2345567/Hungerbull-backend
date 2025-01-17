
import { jwtCheck, jwtParse } from "../middleware/auth";
import express, { RequestHandler } from "express";
import OrderController from "../controllers/OrderController";



const router= express.Router();

router.get("/",jwtCheck, jwtParse as RequestHandler, OrderController.getMyOrders);


router.post(
    "/checkout/create-checkout-session",
    jwtCheck,
    jwtParse as RequestHandler,
    OrderController.createCheckoutSession as RequestHandler
);

router.post("/checkout/webhook", OrderController.stripeWebhookHandler as RequestHandler

);

export default router;