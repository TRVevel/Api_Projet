"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerControllers_1 = require("../controllers/customerControllers");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const isAdminMiddleware_1 = require("../middlewares/isAdminMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Récupérer tous les customers
 *     description: Retourne la liste de tous les customers.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des customers récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/customers', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.getAllCustomers);
/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Création d'un customer
 *     description: Enregistre un nouveau customer avec les informations requises.
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Aiden Sarfez"
 *               adress:
 *                 type: string
 *                 example: "1 rue de Paris"
 *               email:
 *                 type: string
 *                 example: "aiden.sarfez@email.com"
 *               phone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       201:
 *         description: Customer créé avec succès.
 *       400:
 *         description: Erreur de validation ou champs manquants.
 *       500:
 *         description: Erreur interne.
 */
router.post('/customers', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.createCustomer);
/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Modifier un customer
 *     description: Permet de modifier les informations d'un customer.
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean Dupont"
 *               adress:
 *                 type: string
 *                 example: "1 rue de Paris"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@email.com"
 *               phone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       200:
 *         description: Customer modifié avec succès.
 *       400:
 *         description: ID invalide ou champs manquants.
 *       404:
 *         description: Customer non trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.put('/customers/:id', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.updateCustomer);
/**
 * @swagger
 * /api/customers/active:
 *   get:
 *     summary: Récupérer tous les customers actifs
 *     description: Retourne la liste de tous les customers qui sont actifs.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des customers actifs récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/customers/active', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.getActiveCustomer);
/**
 * @swagger
 * /api/customers/active/{id}:
 *   put:
 *     summary: Modifier l'état actif d'un customer
 *     description: Permet de modifier l'état actif d'un customer (réservé aux administrateurs).
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: État actif du customer modifié avec succès.
 *       400:
 *         description: ID invalide ou état manquant.
 *       404:
 *         description: Customer non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/customers/active/:id', verifyTokenMiddleware_1.verifyTokenMiddleware, isAdminMiddleware_1.isAdminMiddleware, customerControllers_1.updateCustomerActivity);
/**
 * @swagger
 * /api/customers/{id}/order:
 *   put:
 *     summary: Ajouter une commande dans l'historique d'un customer
 *     description: Permet d'ajouter une commande dans l'historique du customer.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: string
 *                 example: "order1234"
 *     responses:
 *       200:
 *         description: Commande ajoutée avec succès dans l'historique.
 *       400:
 *         description: ID invalide ou commande manquante.
 *       404:
 *         description: Customer non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/customers/:id/order', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.addOrderInHistory);
/**
 * @swagger
 * /api/customers/{id}/order/{idOrder}:
 *   put:
 *     summary: Supprimer une commande de l'historique d'un customer
 *     description: Permet de supprimer une commande spécifique de l'historique du customer.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du customer
 *       - in: path
 *         name: idOrder
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée de l'historique avec succès.
 *       400:
 *         description: ID invalide ou commande introuvable.
 *       404:
 *         description: Customer ou commande non trouvés.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/customers/:id/order/:idOrder', verifyTokenMiddleware_1.verifyTokenMiddleware, customerControllers_1.delOrderInHistory);
exports.default = router;
