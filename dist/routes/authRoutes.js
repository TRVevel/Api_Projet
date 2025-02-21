"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const isAdminMiddleware_1 = require("../middlewares/isAdminMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Création d'un utilisateur
 *     description: Enregistre un nouvel utilisateur avec un nom et un mot de passe.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Avarice Sarfez"
 *               password:
 *                 type: string
 *                 example: "Password123@"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *       400:
 *         description: Erreur de validation ou utilisateur existant.
 *       500:
 *         description: Erreur interne.
 */
router.post('/register', authControllers_1.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Permet à un utilisateur de se connecter avec un nom et un mot de passe.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Avarice Sarfez"
 *               password:
 *                 type: string
 *                 example: "Password123@"
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *       401:
 *         description: Mot de passe incorrect.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne.
 */
router.post('/login', authControllers_1.login);
/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (réservé aux administrateurs).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/users', verifyTokenMiddleware_1.verifyTokenMiddleware, isAdminMiddleware_1.isAdminMiddleware, authControllers_1.getAllUsers);
/**
 * @swagger
 * /api/auth/update-role/{id}:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur
 *     description: Permet de modifier le rôle d'un utilisateur (réservé aux administrateurs).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/update-role/:id', verifyTokenMiddleware_1.verifyTokenMiddleware, isAdminMiddleware_1.isAdminMiddleware, authControllers_1.updateUserRole);
exports.default = router;
