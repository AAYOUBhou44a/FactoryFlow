const express = require("express");

const productController = require("../controllers/product.controller");
const {
  validateCreate,
  validateUpdate,
} = require("../validators/product.validator");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Produits
 *     summary: Lister les produits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits.
 *   post:
 *     tags:
 *       - Produits
 *     summary: Créer un produit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *               - name
 *               - composition
 *             properties:
 *               reference:
 *                 type: string
 *                 example: PROD-001
 *               name:
 *                 type: string
 *                 example: Table en acier
 *               description:
 *                 type: string
 *                 example: Table industrielle
 *               composition:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - material
 *                     - quantityPerUnit
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *                       example: 2
 *     responses:
 *       201:
 *         description: Produit créé.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Matière première introuvable.
 *       409:
 *         description: Référence déjà utilisée.
 *
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Produits
 *     summary: Consulter un produit
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
 *         description: Produit trouvé.
 *       404:
 *         description: Produit introuvable.
 *   patch:
 *     tags:
 *       - Produits
 *     summary: Modifier un produit
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
 *                   required:
 *                     - material
 *                     - quantityPerUnit
 *                   properties:
 *                     material:
 *                       type: string
 *                     quantityPerUnit:
 *                       type: number
 *                       exclusiveMinimum: 0
 *     responses:
 *       200:
 *         description: Produit modifié.
 *       400:
 *         description: Données invalides.
 *       404:
 *         description: Produit ou matière introuvable.
 *       409:
 *         description: Référence déjà utilisée.
 *   delete:
 *     tags:
 *       - Produits
 *     summary: Supprimer un produit non utilisé
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
 *         description: Produit supprimé.
 *       404:
 *         description: Produit introuvable.
 *       409:
 *         description: Produit utilisé par un ordre de fabrication.
 */

router.get(
  "/",
  authorizeRoles("ADMIN", "OPERATOR"),
  productController.getAll
);

router.post(
  "/",
  authorizeRoles("ADMIN"),
  validateCreate,
  productController.create
);

router.get(
  "/:id",
  authorizeRoles("ADMIN", "OPERATOR"),
  productController.getById
);

router.patch(
  "/:id",
  authorizeRoles("ADMIN"),
  validateUpdate,
  productController.update
);

router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  productController.remove
);

module.exports = router;