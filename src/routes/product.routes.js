const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/schemas/product.schema");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits et de leur composition
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get("/", authenticate, controller.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Products]
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
 *         description: Produit trouvé
 *       404:
 *         description: Produit introuvable
 */
router.get("/:id", authenticate, controller.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un produit avec sa composition
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, name, composition]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: PROD-001
 *               name:
 *                 type: string
 *                 example: Chaise
 *               description:
 *                 type: string
 *                 example: Chaise en acier
 *               composition:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [material, quantityPerUnit]
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *                       example: 2.5
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès réservé à l'administrateur
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createProductSchema),
  controller.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Modifier un produit
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               composition:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [material, quantityPerUnit]
 *                   properties:
 *                     material:
 *                       type: string
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *     responses:
 *       200:
 *         description: Produit modifié
 *       404:
 *         description: Produit introuvable
 */
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateProductSchema),
  controller.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
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
 *         description: Produit supprimé
 *       404:
 *         description: Produit introuvable
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete
);

module.exports = router;const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/schemas/product.schema");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits et de leur composition
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get("/", authenticate, controller.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Products]
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
 *         description: Produit trouvé
 *       404:
 *         description: Produit introuvable
 */
router.get("/:id", authenticate, controller.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un produit avec sa composition
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, name, composition]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: PROD-001
 *               name:
 *                 type: string
 *                 example: Chaise
 *               description:
 *                 type: string
 *                 example: Chaise en acier
 *               composition:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [material, quantityPerUnit]
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *                       example: 2.5
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès réservé à l'administrateur
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createProductSchema),
  controller.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Modifier un produit
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               composition:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [material, quantityPerUnit]
 *                   properties:
 *                     material:
 *                       type: string
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *     responses:
 *       200:
 *         description: Produit modifié
 *       404:
 *         description: Produit introuvable
 */
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateProductSchema),
  controller.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
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
 *         description: Produit supprimé
 *       404:
 *         description: Produit introuvable
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete
);

module.exports = router;