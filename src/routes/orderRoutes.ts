import { Router } from "express";
import { cancelOrder, createOrder, listOrdersByCustomer, updateOrderStatus } from "../controllers/ordersController";


const router = Router();

/**
 * @swagger
 * /o/COrder:
 *   post:
 *     summary: Créer une commande
 *     description: Crée une nouvelle commande pour un client avec une liste de produits.
 *     tags:
 *       - Commandes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numOrder
 *               - customerId
 *               - products
 *             properties:
 *               numOrder:
 *                 type: string
 *                 description: Numéro de commande unique.
 *               customerId:
 *                 type: string
 *                 description: Identifiant du client.
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Identifiant du produit.
 *                     quantity:
 *                       type: integer
 *                       description: Quantité commandée.
 *                     discount:
 *                       type: number
 *                       description: Remise appliquée au produit (optionnel).
 *     responses:
 *       201:
 *         description: Commande créée avec succès.
 *       400:
 *         description: Erreur de validation des données.
 *       404:
 *         description: Client ou produit non trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.post('/COrder', createOrder);

/**
 * @swagger
 * /o/LOrder/{customerId}:
 *   get:
 *     summary: Récupérer l'historique des commandes d'un client
 *     description: Retourne la liste des commandes passées par un client donné.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du client.
 *     responses:
 *       200:
 *         description: Historique des commandes récupéré avec succès.
 *       404:
 *         description: Client non trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.get('/LOrder/:customerId', listOrdersByCustomer);

/**
 * @swagger
 * /o/LOrder/{customerId}:
 *   get:
 *     summary: Récupérer l'historique des commandes d'un client
 *     description: Retourne la liste des commandes passées par un client donné.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du client.
 *     responses:
 *       200:
 *         description: Historique des commandes récupéré avec succès.
 *       404:
 *         description: Client non trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.post('/UOrder', updateOrderStatus);

/**
 * @swagger
 * /o/CLOrder/{orderId}:
 *   post:
 *     summary: Annuler une commande
 *     description: Annule une commande et rétablit le stock des produits.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la commande.
 *     responses:
 *       200:
 *         description: Commande annulée avec succès.
 *       400:
 *         description: Erreur de validation des données.
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur interne.
 */
router.post('/CLOrder/:orderId', cancelOrder);

export default router;