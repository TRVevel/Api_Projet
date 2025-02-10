import { Router } from "express";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";
import { login, register, updateUserRole } from "../controllers/authControllers";

   const router = Router();

   router.post('/register', register);
   router.post('/login', login);
   // Route protégée pour modifier le rôle d'un utilisateur (réservée aux admins)
   router.put('/update-role', isAdminMiddleware, updateUserRole);
   
   export default router;
