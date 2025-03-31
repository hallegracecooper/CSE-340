// routes/accountRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController"); // build this later

// GET route for the login view
// This route responds to "/account/login" since "account" is prefixed in server.js
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for handling account registration
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;
