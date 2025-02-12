import { Router } from "express";
import { createCustomer, getActiveCustomers, updateCustomer, updateStatusCustomer } from "../controllers/customersController";
import { monthlyRevenue, stockByProduct } from "../controllers/dashBoardController";
  
const router = Router();

/**
 * @swagger
 * /d/:
 *   get:
 *     summary: Récupérer le stock des produits
 *     description: Retourne la liste des produits avec leur stock actuel.
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Liste des produits et de leur stock récupérée avec succès.
 *       404:
 *         description: Aucun produit trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.get('/', stockByProduct);

/**
 * @swagger
 * /d/MR:
 *   get:
 *     summary: Récupérer le chiffre d'affaires du mois
 *     description: Calcule le chiffre d'affaires total pour les commandes du mois en cours (hors commandes annulées).
 *     tags:
 *       - Commandes
 *     responses:
 *       200:
 *         description: Chiffre d'affaires calculé avec succès.
 *       500:
 *         description: Erreur interne.
 */router.get('/MR', monthlyRevenue);
         
export default router;