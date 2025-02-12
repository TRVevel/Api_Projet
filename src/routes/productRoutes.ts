import { Router } from "express";
import { createProduct, DeleteAProduct, getAllProducts, getAProduct } from "../controllers/productsController";

const router = Router();

/**
 * @swagger
 * /p/CProduct:
 *   post:
 *     summary: Crée un nouveau produit
 *     description: Enregistre un nouveau produit avec son nom, description, prix unitaire et stock.
 *     tags:
 *       - Produits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - prixUnitaire
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               prixUnitaire:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Champs manquants ou produit existant
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/CProduct', createProduct);

/**
 * @swagger
 * /p/GProduct/{name}:
 *   get:
 *     summary: Consulter le détail d'un produit par son nom
 *     description: Retourne les détails d'un produit spécifique.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit trouvé avec succès
 *       400:
 *         description: Nom du produit manquant
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/GProduct/:name', getAProduct);

/**
 * @swagger
 * /p/AllProducts:
 *   post:
 *     summary: Récupère la liste de tous les produits
 *     description: Retourne tous les produits enregistrés dans la base de données.
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/AllProducts', getAllProducts);

/**
 * @swagger
 * /p/DProduct/{name}:
 *   delete:
 *     summary: Supprime un produit par son nom
 *     description: Permet de supprimer un produit spécifique en fonction de son nom.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       400:
 *         description: Nom du produit manquant
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/DProduct/:name', DeleteAProduct);

      
export default router;

