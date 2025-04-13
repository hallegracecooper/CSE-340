// controllers/accountController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const utilities = require("../utilities");
const accountModel = require('../models/account-model');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,  // Ensure errors is defined
    account_email: ""  // Optionally initialize account_email
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,  // This ensures the view always has an errors variable
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/");
    } else {
      req.flash("message notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Build Account Management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null
  });
}

/* ****************************************
 *  Deliver Account Update view (Task 4)
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null
  });
}

/* ****************************************
 *  Process account information update (Task 4)
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  // TODO: Update the account info in the database using your account model.
  // e.g., const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
  
  req.flash("notice", "Account information updated successfully.");
  res.redirect("/account/");
}

/* ****************************************
 *  Process password change update (Task 4)
 * *************************************** */
async function updateAccountPassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password, confirm_password } = req.body;
  
  if (account_password !== confirm_password) {
    req.flash("notice", "Passwords do not match.");
    return res.redirect(`/account/update/${account_id}`);
  }
  
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Error updating password.");
    return res.redirect(`/account/update/${account_id}`);
  }
  
  // TODO: Update the password in the database using your account model.
  // e.g., const updatePasswordResult = await accountModel.updateAccountPassword(account_id, hashedPassword);
  
  req.flash("notice", "Password updated successfully.");
  res.redirect("/account/");
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,
  buildUpdateAccount,        // New for displaying the update view
  updateAccount,             // New for processing account info update
  updateAccountPassword      // New for processing password change
};