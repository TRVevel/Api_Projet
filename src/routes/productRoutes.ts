import { Router } from "express";
import { createProduct, DeleteAProduct, getAllProducts, getAProduct } from "../controllers/productsController";

const router = Router();

router.post('/CProduct', createProduct);
router.get('/GProduct/:name', getAProduct);
router.post('/AllProducts', getAllProducts);
router.delete('/DProduct/:name', DeleteAProduct);
      
export default router;

