// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities"); // ✅ Import the utilities module

// Route to build inventory by classification view (with error handling)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view (with error handling)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail));

// Intentional error route for Task 3
router.get("/error-test", utilities.handleErrors((req, res, next) => {
    throw new Error("Intentional test error for Task 3");
  }));  

module.exports = router;