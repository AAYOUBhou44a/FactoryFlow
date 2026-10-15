const express = require("express");
const router = express.Router();

const controller = require("../controllers/rawMaterial.controller");
const validate = require("../middlewares/validate");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
  createRawMaterialSchema,
  updateRawMaterialSchema,
  stockEntrySchema,
} = require("../validators/schemas/rawMaterial.schema");

/**
 * @swagger
 * tags:
 *   name: RawMaterials
 *   description: Gestion des matières premières et du stock
 */

/**
 * @swagger
 * /api/raw-materials:
 *   get:
 *     summary: Récupérer toutes les matières premières
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matières premières
 *       401:
 *         description: Non authentifié
 */
router.get("/", authenticate, controller.getAll);

/**
 * @swagger
 * /api/raw-materials/alerts/low-stock:
 *   get:
 *     summary: Consulter les alertes de stock faible
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matières premières dont le stock est inférieur ou égal au seuil d'alerte
 */
router.get(
  "/alerts/low-stock",
  authenticate,
  controller.getLowStock
);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   get:
 *     summary: Récupérer une matière première par son ID
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB
 *     responses:
 *       200:
 *         description: Matière première trouvée
 *       404:
 *         description: Matière première introuvable
 */
router.get("/:id", authenticate, controller.getById);

/**
 * @swagger
 * /api/raw-materials:
 *   post:
 *     summary: Créer une matière première
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, name, unit]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: MAT-001
 *               name:
 *                 type: string
 *                 example: Acier
 *               unit:
 *                 type: string
 *                 example: kg
 *               alertThreshold:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 example: 20
 *     responses:
 *       201:
 *         description: Matière première créée
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès réservé à l'administrateur
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createRawMaterialSchema),
  controller.create
);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   patch:
 *     summary: Modifier une matière première
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               reference:
 *                 type: string
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               alertThreshold:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Matière première modifiée
 *       404:
 *         description: Matière première introuvable
 */
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateRawMaterialSchema),
  controller.update
);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   delete:
 *     summary: Supprimer une matière première
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matière première supprimée
 *       404:
 *         description: Matière première introuvable
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete
);

/**
 * @swagger
 * /api/raw-materials/{id}/entries:
 *   post:
 *     summary: Enregistrer une entrée de stock
 *     tags: [RawMaterials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 100
 *     responses:
 *       200:
 *         description: Entrée de stock enregistrée
 *       400:
 *         description: Quantité invalide
 */
router.post(
  "/:id/entries",
  authenticate,
  authorize("ADMIN"),
  validate(stockEntrySchema),
  controller.addStock
);

module.exports = router;