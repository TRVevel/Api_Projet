"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/home/:
 *   get:
 *     summary: Récupérer le stock des produits
 *     description: Retourne la liste des produits avec leur stock actuel.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Liste des produits et de leur stock récupérée avec succès.
 *       404:
 *         description: Aucun produit trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.get('/', verifyTokenMiddleware_1.verifyTokenMiddleware, dashboardController_1.stockByProduct);
/**
 * @swagger
 * /api/home/MR:
 *   get:
 *     summary: Récupérer le chiffre d'affaires du mois
 *     description: Calcule le chiffre d'affaires total pour les commandes du mois en cours (hors commandes annulées).
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Chiffre d'affaires calculé avec succès.
 *       500:
 *         description: Erreur interne.
 */ router.get('/MR', verifyTokenMiddleware_1.verifyTokenMiddleware, dashboardController_1.monthlyRevenue);
exports.default = router;
