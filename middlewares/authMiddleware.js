const axios = require("axios");
const jwt = require("jsonwebtoken");

function redirectIfAuthenticated(req, res, next) {
  if (req.cookies && req.cookies.token) {
    return res.redirect("/dashboard");
  }
  next();
}

async function ensureAuthenticated(req, res, next) {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;

    // First, check if the token is valid (i.e. not expired)
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // If token is expired or invalid, clear the cookie and redirect to login
      res.clearCookie("token");
      return res.redirect("/login");
    }

    // Next, call the API to ensure the user exists in the database
    try {
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = response.data.user;
      if (!user) {
        res.clearCookie("token");
        return res.redirect("/login");
      }
      // If user exists, proceed to the next middleware/route handler
      next();
    } catch (error) {
      res.clearCookie("token");
      return res.redirect("/login");
    }
  } else {
    return res.redirect("/login");
  }
}

module.exports = {
  redirectIfAuthenticated,
  ensureAuthenticated,
};
