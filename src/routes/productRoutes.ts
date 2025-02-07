import { Router } from "express";
import { createProduct, getAllProducts, updateProduct } from "../controllers/productControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

   const router = Router();

   router.get('/products', verifyTokenMiddleware, getAllProducts);
   router.post('/products',verifyTokenMiddleware, createProduct);
   router.put('/products/:id',verifyTokenMiddleware, updateProduct);
   
   
   export default router;
