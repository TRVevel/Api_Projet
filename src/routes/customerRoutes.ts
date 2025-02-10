import { Router } from "express";
import { getAllCustomers, createCustomer, updateCustomer, getActiveCustomer,addOrderInHistory, delOrderInHistory } from "../controllers/customerControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

   const router = Router();

   router.get('/customers', verifyTokenMiddleware, getAllCustomers);
   router.post('/customers',verifyTokenMiddleware, createCustomer);
   router.put('/customers/:id',verifyTokenMiddleware, updateCustomer);
   router.get('/customers/active', verifyTokenMiddleware, getActiveCustomer);
   router.put('/customers/:id/order',verifyTokenMiddleware, addOrderInHistory);
   router.put('/customers/:id/order/:idOrder',verifyTokenMiddleware, delOrderInHistory);
   export default router;
