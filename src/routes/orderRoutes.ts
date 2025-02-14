import { Router } from "express";
import { getAllOrders, createOrder, cancelOrder, modifyOrderStatus, listOrdersByCustomer } from "../controllers/orderControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     description: Retourne la liste de toutes les commandes.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/orders', verifyTokenMiddleware, getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     description: Crée une nouvelle commande avec la liste des produits et la quantité.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 example: "607c3f4d9c1e8a6b1f8b5d4f"
 *               productList:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *               quantityList:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   example: 3
 *     responses:
 *       201:
 *         description: Commande créée avec succès.
 *       400:
 *         description: Requête invalide (produit introuvable, stock insuffisant, etc.).
 *       500:
 *         description: Erreur interne.
 */
router.post('/orders', verifyTokenMiddleware, createOrder);

/**
 * @swagger
 * /api/orders/cancel/{id}:
 *   put:
 *     summary: Annuler une commande
 *     description: Permet d'annuler une commande (changement de statut en "cancelled").
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande.
 *     responses:
 *       200:
 *         description: Commande annulée avec succès.
 *       400:
 *         description: Commande déjà annulée ou problème avec la commande.
 *       404:
 *         description: Commande ou client introuvable.
 *       500:
 *         description: Erreur interne.
 */
router.put('/orders/cancel/:id', verifyTokenMiddleware, cancelOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Modifier le statut d'une commande
 *     description: Permet de changer le statut d'une commande (par exemple, "pending" à "shipped", ou "shipped" à "delivered").
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande.
 *     responses:
 *       200:
 *         description: Statut de la commande modifié avec succès.
 *       400:
 *         description: Statut de la commande déjà mis à jour (par exemple, "cancelled" ou "delivered").
 *       404:
 *         description: Commande introuvable.
 *       500:
 *         description: Erreur interne.
 */
router.put('/orders/:id', verifyTokenMiddleware, modifyOrderStatus);
/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     description: Retourne la liste de toutes les commandes.
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/orders/customer/:customerId', verifyTokenMiddleware, listOrdersByCustomer);

export default router;
