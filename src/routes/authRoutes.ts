import { Router } from "express";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";
import { login, register, updateUserRole } from "../controllers/authControllers";

const router = Router();

/**
 * @swagger
 * /a/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur avec un nom et un mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Champs manquants ou utilisateur existant
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/register', register);

/**
 * @swagger
 * /a/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Permet à un utilisateur de se connecter en vérifiant ses identifiants.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/login', login);

/**
 * @swagger
 * /a/update-role:
 *   put:
 *     summary: Mise à jour du rôle d'un utilisateur (uniquement avec le rôle admin)
 *     description: Permet aux administrateurs de modifier le rôle d'un utilisateur.
 *     tags:
 *       - Administration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - newRole
 *             properties:
 *               name:
 *                 type: string
 *               newRole:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *       400:
 *         description: Champs manquants
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/update-role', isAdminMiddleware, updateUserRole);

   
   export default router;
