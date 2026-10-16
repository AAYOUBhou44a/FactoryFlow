const express = require("express");
const authController = require("../controllers/auth.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authenticate, authorize("ADMIN", "OPERATOR"), authController.getProfile);

module.exports = router;
