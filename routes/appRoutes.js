const express = require("express");
const { ensureAuthenticated } = require("../middlewares/authMiddleware"); // Destructure the import
const router = express.Router();

const axios = require("axios");
const staticBaseUrl = process.env.STATIC_API_URL;
const checkProfileName = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.token;

    // Handle missing token
    if (!token) {
      console.error("No token found in cookies.");
      return res.redirect("/login");
    }

    // Fetch user data using the token
    const response = await axios.get(
      `${process.env.BASE_API_URL}/user/get-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = response.data.user;

    // Attach user data to the request for reuse
    req.user = user;

    // Redirect if `profileName` is missing and NOT already on `/edit-profile`
    if (!user.profileName && req.path !== "/edit-profile") {
      return res.redirect("/edit-profile");
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in checkProfileName middleware:", error.message);
    return res.redirect("/login"); // Redirect to login if there's an issue
  }
};

router.get(
  "/dashboard",
  ensureAuthenticated,
  checkProfileName,
  async (req, res) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.token;

      // Make a request to the user data endpoint with Authorization header
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
          },
        }
      );

      // Pass the retrieved user data to the dashboard view
      const user = response.data.user;
      res.render("dashboard", {
        user: req.user,
        path: "/dashboard",
        staticBaseUrl,
      });
      console.log(user);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || error.message });
    }
  }
);

router.get(
  "/edit-profile",
  ensureAuthenticated,
  checkProfileName,
  async (req, res) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.token;
      console.log(token);

      // Make a request to the user data endpoint with Authorization header
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
          },
        }
      );

      // Pass the retrieved user data to the dashboard view
      const user = response.data.user;
      res.render("edit-profile", { user: req.user, path: "/profile" });
      console.log(user);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || error.message });
    }
  }
);

router.get(
  "/links",
  ensureAuthenticated,
  checkProfileName,
  async (req, res) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.token;
      console.log(token);

      // Make a request to the user data endpoint with Authorization header
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
          },
        }
      );

      // Pass the retrieved user data to the dashboard view
      const user = response.data.user;
      res.render("links", { user: req.user, path: "/links", staticBaseUrl });
      console.log(user);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || error.message });
    }
  }
);

router.get(
  "/catalogue",
  ensureAuthenticated,
  checkProfileName,
  async (req, res) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.token;

      // Make a request to the user data endpoint with Authorization header
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
          },
        }
      );

      // Pass the retrieved user data to the dashboard view
      const user = response.data.user;
      res.render("catalogue", {
        user: req.user,
        path: "/catalogue",
        staticBaseUrl,
      });
      console.log(user);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || error.message });
    }
  }
);

router.get(
  "/account",
  ensureAuthenticated,
  checkProfileName,
  async (req, res) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.token;

      // Make a request to the user data endpoint with Authorization header
      const response = await axios.get(
        `${process.env.BASE_API_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
          },
        }
      );

      // Pass the retrieved user data to the dashboard view
      const user = response.data.user;
      res.render("account", {
        user: req.user,
        path: "/account",
        staticBaseUrl,
      });
      console.log(user);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || error.message });
    }
  }
);

router.get("/:username", async (req, res) => {
  const { username } = req.params; // Extract the username from the route

  try {
    // Construct the API URL with the username
    const apiUrl = `${process.env.BASE_API_URL}/user/get-user/${username}`;

    // Make a request to the user data endpoint
    const response = await axios.get(apiUrl);

    // Pass the retrieved user data to the profile view
    const user = response.data.user;
    console.log(user);
    // If the user's profileName is missing or empty, send to 404
    if (!user.profileName || user.profileName.trim() === "") {
      const loggedIn = req.cookies.token ? true : false;
      return res.status(404).render("error", {
        message: "page_not_found",
        status: 404,
        loggedIn,
      });
    }

    res.render("profile", {
      user,
      path: "/profile",
      staticBaseUrl,
    }); // Render the profile page with user data
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    // Ensure `loggedIn` is set based on token existence
    const loggedIn = req.cookies.token ? true : false;
    // Render a 404 or error page if the user is not found or an error occurs
    res.status(error.response?.status || 500).render("error", {
      message: error.response?.data?.message || "something_went_wrong",
      loggedIn,
    });
  }
});

module.exports = router;
