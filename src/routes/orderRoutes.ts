import { Router } from "express";
import { cancelOrder, createOrder, listOrdersByCustomer, updateOrderStatus } from "../controllers/ordersController";


const router = Router();

router.post('/COrder', createOrder);
router.get('/LOrder/:customerId', listOrdersByCustomer);
router.post('/UOrder', updateOrderStatus)
router.post('/CLOrder/:orderId', cancelOrder)


export default router;