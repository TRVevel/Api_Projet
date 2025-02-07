import { Router } from "express";
import { createCustomer, getActiveCustomers, updateCustomer, updateStatusCustomer,  } from "../controllers/customersController";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

   const router = Router();

   router.post('/CCustomer', createCustomer);
   router.post('/UCustomer/:email', updateCustomer);
   router.post('/MRoleCustomer/:email', isAdminMiddleware, updateStatusCustomer);
   router.get('/ACustomers', getActiveCustomers);

      
   export default router;