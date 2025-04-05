// server.js

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");
const session = require("express-session");
const pool = require('./database/');
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");

// *** NEW: Require the cookie-parser package ***
const cookieParser = require("cookie-parser");

// Set the port
const port = process.env.PORT || 3000;

/* ***********************
 * Middleware
 ************************/
// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// *** NEW: Use cookie-parser middleware ***
app.use(cookieParser());

// Apply JWT checking middleware BEFORE mounting the account route
app.use(utilities.checkJWTToken);

// Set the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');  // This tells express-ejs-layouts to use views/layout.ejs

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account Route
app.use("/account", accountRoute);

// File Not Found Route - must be the last route in the list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status === 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});