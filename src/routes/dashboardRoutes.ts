import { Router } from "express";
import { createCustomer, getActiveCustomers, updateCustomer, updateStatusCustomer } from "../controllers/customersController";
import { monthlyRevenue, stockByProduct } from "../controllers/dashBoardController";
  
const router = Router();

router.get('/', stockByProduct);
router.get('/MR', monthlyRevenue)
         
export default router;