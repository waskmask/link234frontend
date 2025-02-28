require("dotenv").config();
const express = require("express");
const path = require("path");
const i18n = require("i18n");
const PORT = process.env.PORT || 5000;
const webRoutes = require("./routes/webRoutes");
const routes = require("./routes/authRoutes");
const appRoutes = require("./routes/appRoutes");
const acceptedLanguages = i18n.getLocales(); // Get the list of locales you support

const cookieParser = require("cookie-parser");
const app = express();
// i18n configuration
i18n.configure({
  locales: ["en", "de", "tr", "fr", "es", "it", "pl", "pt"],
  directory: path.join(__dirname, "locales"), // Path to store translation files
  defaultLocale: "en",
  cookie: "i18n", // Use cookies to remember user preference
  queryParameter: "lang", // Allow ?lang= parameter to change language
  fallbackLocale: "en", // Default locale if none is found in the acceptedLanguages array
  header: "accept-language",
  objectNotation: true, // Enable JSON notation for i18n.t() function
});

// Set EJS as the templating engine
app.set("view engine", "ejs");

// middleware
app.use(cookieParser());

app.use((req, res, next) => {
  const browserLang =
    req.acceptsLanguages(acceptedLanguages) || i18n.getDefaultLocale();
  i18n.setLocale(req, browserLang);
  next();
});
// Init i18n middleware
app.use(i18n.init);
// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);
app.use("/", webRoutes);
app.use("/", appRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Ensure `loggedIn` is set based on token existence
  const loggedIn = req.cookies.token ? true : false;

  res.status(err.status || 500).render("error", {
    message: err.message || "something_went_wrong.",
    status: err.status || 500,
    loggedIn: loggedIn, // ✅ Pass `loggedIn` variable to `error.ejs`
  });
});

// 404 error handling middleware
app.use((req, res, next) => {
  const loggedIn = req.cookies.token ? true : false; // Check login status

  res.status(404).render("error", {
    message: "page_not_found",
    status: 404,
    loggedIn: loggedIn,
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
