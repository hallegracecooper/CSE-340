// routes/accountRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// GET route for the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for registration process
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Account Management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to display account update view
router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Route to process account update (update names and email)
// NEW validation middleware added for updates:
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountPassword)
);

// Route for logout (Task 6)
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;