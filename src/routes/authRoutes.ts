import { Router } from "express";
import { getAllUsers, login, register, updateUserRole } from "../controllers/authControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

const router = Router();

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
router.post('/register', register);

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
router.post('/login', login);

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
router.get('/users', verifyTokenMiddleware, isAdminMiddleware, getAllUsers);

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
router.put('/update-role/:id', verifyTokenMiddleware, isAdminMiddleware, updateUserRole);

export default router;
