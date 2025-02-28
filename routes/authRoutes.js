const express = require("express");
const { redirectIfAuthenticated } = require("../middlewares/authMiddleware"); // Destructure the import
const router = express.Router();

// Routes
router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/signup", redirectIfAuthenticated, (req, res) => {
  res.render("signup");
});

router.get("/forgot-password", redirectIfAuthenticated, (req, res) => {
  res.render("forgot-password");
});

router.get("/reset-password", redirectIfAuthenticated, (req, res) => {
  res.render("reset-password");
});

router.get("/email-verification", (req, res) => {
  res.render("email-verification");
});

module.exports = router;
