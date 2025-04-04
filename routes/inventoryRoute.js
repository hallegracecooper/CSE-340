// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities"); // Import the utilities module

// Route to build inventory by classification view (with error handling)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view (with error handling)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail));

// Intentional error route for Task 3
router.get("/error-test", utilities.handleErrors((req, res, next) => {
    throw new Error("Intentional test error for Task 3");
}));

// Route for the management view
router.get("/", utilities.handleErrors(invController.managementView));

// Route to render add-classification view (GET)
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process new classification addition (POST)
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route to render add-inventory view (GET)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process new inventory addition (POST)
// Ensure you have implemented invModel.addInventory in your model
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

module.exports = router;