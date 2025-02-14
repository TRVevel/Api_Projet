import { Router } from "express";
import { createProduct, getAllProducts, updateProduct } from "../controllers/productControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     description: Retourne la liste de tous les produits.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/products', verifyTokenMiddleware, getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un nouveau produit
 *     description: Crée un nouveau produit avec un nom, une description, un prix et un stock.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produit A"
 *               description:
 *                 type: string
 *                 example: "Description du produit A"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *       400:
 *         description: Requête invalide (champ manquant ou incorrect).
 *       500:
 *         description: Erreur interne.
 */
router.post('/products', verifyTokenMiddleware, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Met à jour les détails d'un produit existant, incluant le nom, la description, le prix et le stock.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produit B"
 *               description:
 *                 type: string
 *                 example: "Description du produit B"
 *               price:
 *                 type: number
 *                 example: 29.99
 *               stock:
 *                 type: integer
 *                 example: 40
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *       400:
 *         description: Requête invalide (champ manquant ou incorrect).
 *       404:
 *         description: Produit introuvable.
 *       500:
 *         description: Erreur interne.
 */
router.put('/products/:id', verifyTokenMiddleware, updateProduct);

export default router;
