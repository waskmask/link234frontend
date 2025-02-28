const express = require("express");
const axios = require("axios");
const router = express.Router();

function checkAuth(req, res, next) {
  const token = req.cookies.token;
  req.loggedIn = !!token; // Convert truthy or falsy value to boolean
  next();
}
// Routes

router.get("/", checkAuth, (req, res) => {
  res.render("index", {
    loggedIn: req.loggedIn,
    path: "/",
  });
});
router.get("/privacy", checkAuth, (req, res) => {
  const language = req.cookies.i18n;
  let showPrivacyLangNotice = false;
  if (language && language !== "en") {
    showPrivacyLangNotice = true;
  }
  res.render("privacy", {
    loggedIn: req.loggedIn,
    path: "/privacy",
    showPrivacyLangNotice,
  });
});
router.get("/terms", checkAuth, (req, res) => {
  const language = req.cookies.i18n;
  let showPrivacyLangNotice = false;
  if (language && language !== "en") {
    showPrivacyLangNotice = true;
  }
  res.render("terms", {
    loggedIn: req.loggedIn,
    path: "/terms",
    showPrivacyLangNotice,
  });
});
router.get("/contact", checkAuth, (req, res) => {
  res.render("contact", {
    loggedIn: req.loggedIn,
    path: "/contact",
  });
});
router.get("/company", checkAuth, (req, res) => {
  const language = req.cookies.i18n;
  let showPrivacyLangNotice = false;
  if (language && language !== "en") {
    showPrivacyLangNotice = true;
  }
  res.render("company", {
    loggedIn: req.loggedIn,
    path: "/company",
    showPrivacyLangNotice,
  });
});
module.exports = router;
