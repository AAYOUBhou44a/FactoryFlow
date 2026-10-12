const express = require("express");
const authController = require("../controllers/auth.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", protect, authorize("ADMIN", "OPERATOR"), authController.getProfile);

module.exports = router;
