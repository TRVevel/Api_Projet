import { Router } from "express";
import { createCustomer, getActiveCustomers, updateCustomer, updateStatusCustomer,  } from "../controllers/customersController";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

const router = Router();

/**
 * @swagger
 * /c/CCustomer:
 *   post:
 *     summary: Crée un nouveau client
 *     description: Enregistre un nouveau client avec email, nom, adresse et téléphone.
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *       400:
 *         description: Champs manquants ou client existant
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/CCustomer', createCustomer);

/**
 * @swagger
 * /c/UCustomer/{email}:
 *   post:
 *     summary: Met à jour les informations d'un client
 *     description: Modifie les informations d'un client sans changer son statut actif.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour avec succès
 *       400:
 *         description: Paramètre email manquant
 *       403:
 *         description: Modification du statut interdite
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/UCustomer/:email', updateCustomer);

/**
 * @swagger
 * /c/MRoleCustomer/{email}:
 *   post:
 *     summary: Modifie le statut d'un client
 *     description: Permet aux administrateurs de rendre un client inactif.
 *     tags:
 *       - Administration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut du client mis à jour avec succès
 *       400:
 *         description: Paramètre email ou statut actif manquant
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/MRoleCustomer/:email', isAdminMiddleware, updateStatusCustomer);

/**
 * @swagger
 * /c/ACustomers:
 *   get:
 *     summary: Récupère la liste des clients actifs
 *     description: Retourne tous les clients ayant le statut "active" à true.
 *     tags:
 *       - Clients
 *     responses:
 *       200:
 *         description: Liste des clients actifs récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/ACustomers', getActiveCustomers);

      
   export default router;