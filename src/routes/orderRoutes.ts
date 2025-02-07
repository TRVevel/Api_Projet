import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { createOrder, getAllOrders, cancelOrder, modifyOrderStatus } from "../controllers/orderControllers";

const router = Router();
   router.get('/orders', verifyTokenMiddleware, getAllOrders);
   router.post('/orders',verifyTokenMiddleware, createOrder);
   router.put('/orders/:id',verifyTokenMiddleware, modifyOrderStatus);
   router.put('/orders/cancel/:id',verifyTokenMiddleware, cancelOrder);
export default router;