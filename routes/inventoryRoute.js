// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities"); // Import the utilities module
const inventoryValidate = require("../utilities/inventory-validation"); // Import validation middleware
// Import the restrictInventoryAdmin middleware for admin-only routes
const { restrictInventoryAdmin } = require("../utilities/authMiddleware");

// Route to build inventory by classification view (with error handling)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view (with error handling)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail));

// Intentional error route for Task 3
router.get("/error-test", utilities.handleErrors((req, res, next) => {
    throw new Error("Intentional test error for Task 3");
}));

// Route for the management view (admin only)
router.get("/", restrictInventoryAdmin, utilities.handleErrors(invController.managementView));

// Route to render add-classification view (GET) - admin only
router.get("/add-classification", restrictInventoryAdmin, utilities.handleErrors(invController.buildAddClassification));

// Route to process new classification addition (POST) - admin only
router.post("/add-classification", restrictInventoryAdmin, utilities.handleErrors(invController.addClassification));

// Route to render add-inventory view (GET) - admin only
router.get("/add-inventory", restrictInventoryAdmin, utilities.handleErrors(invController.buildAddInventory));

// Route to process new inventory addition (POST) - admin only
router.post("/add-inventory", restrictInventoryAdmin, utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build the edit inventory view (admin only)
router.get("/edit/:inv_id", restrictInventoryAdmin, utilities.handleErrors(invController.editInventoryView));

// Route to process inventory updates (admin only)
router.post("/update/", 
  restrictInventoryAdmin,
  inventoryValidate.newInventoryRules(), 
  inventoryValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
);

// Route to render delete confirmation view (admin only)
router.get('/delete/:inv_id', restrictInventoryAdmin, utilities.handleErrors(invController.deleteInventoryView));

// Route to process the delete inventory action (admin only)
router.post('/delete', restrictInventoryAdmin, utilities.handleErrors(invController.deleteInventory));

module.exports = router;