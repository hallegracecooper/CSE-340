// routes/accountRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// GET route for the login view
// This route responds to "/account/login" since "account" is prefixed in server.js
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for registration process
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt (already updated previously)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// routes/accountRoute.js

// Route to display account update view
router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Route to process account update (update names and email)
router.post("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateAccount));

// Route to process password change
router.post("/update-password", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountPassword));

module.exports = router;