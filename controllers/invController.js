const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 *************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build vehicle detail view
 *************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    // Retrieve the inventory id from the URL parameters
    const inv_id = req.params.inv_id;
    
    // Call the model function to get the vehicle details by id
    const data = await invModel.getVehicleById(inv_id);
    
    // If no vehicle is found, render an error view with a 404 status
    if (!data.rowCount) {
      return res.status(404).render("error", { 
        title: "404 Not Found", 
        nav: await utilities.getNav(), 
        errorMessage: "Vehicle not found" 
      });
    }
    
    // Extract the vehicle object from the result rows
    const vehicle = data.rows[0];
    
    // Build the HTML snippet for the vehicle detail using a utility function
    const detailHTML = await utilities.buildVehicleDetailHTML(vehicle);
    
    // Retrieve the navigation HTML
    const nav = await utilities.getNav();
    
    // Render the detail view, passing the vehicle's make and model as the title
    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build management view for inventory
 *************************** */
invCont.managementView = async function (req, res, next) {
  try {
    // Retrieve navigation and set page title
    const nav = await utilities.getNav();
    
    // -------------------------------------------------------
    // Build the classification select list to be used in the view
    const classificationSelect = await utilities.buildClassificationList();
    // -------------------------------------------------------
    
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect
      // Flash messages will be displayed in the view using <%- messages() %>
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 *************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process new classification addition
 *************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    // Extract the classification name from the request body
    const { classification_name } = req.body;
    
    // Call the model function to insert the new classification
    const result = await invModel.addClassification(classification_name);
    
    if (result.rowCount) {
      // If insertion was successful, set a success flash message
      req.flash("notice", `New classification "${classification_name}" added successfully.`);
      
      // Rebuild navigation (to include the new classification) and render the management view
      const nav = await utilities.getNav();
      res.render("inventory/management", {
        title: "Inventory Management",
        nav
      });
    } else {
      // If insertion failed, set a failure flash message and re-render the add-classification view with sticky data
      req.flash("notice", "Failed to add new classification. Please try again.");
      const nav = await utilities.getNav();
      res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classification_name, // sticky form value
        errors: [{ msg: "Failed to add new classification." }]
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add inventory view
 *************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    // Get the navigation bar and classification list (pre-built)
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process new inventory addition
 *************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    // Extract form data from the request body
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_mileage,
      inv_color
    } = req.body;
    
    // Call the model function to insert the new vehicle into the inventory
    const result = await invModel.addInventory(req.body);
    
    if (result.rowCount) {
      // On success, set a flash message and render the management view with updated nav
      req.flash("notice", "New vehicle added successfully.");
      const nav = await utilities.getNav();
      res.render("inventory/management", {
        title: "Inventory Management",
        nav
      });
    } else {
      // On failure, set a flash message and re-render the add inventory view with sticky form data
      req.flash("notice", "Failed to add new vehicle. Please try again.");
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(classification_id);
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_mile,
        inv_color,
        errors: [{ msg: "Failed to add new vehicle." }]
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 *************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 *************************** */
invCont.editInventoryView = async function (req, res, next) {
  // Collect and convert inventory id from the URL
  const inv_id = parseInt(req.params.inv_id);
  // Build the navigation
  let nav = await utilities.getNav();
  // Retrieve the data for the specific inventory item using getVehicleById
const data = await invModel.getVehicleById(inv_id);
if (!data.rowCount) {
  return next(new Error("Vehicle not found"));
}
const itemData = data.rows[0];

  // Build the classification select list with the item's classification pre-selected
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  // Create a variable holding the vehicle's full name (Make and Model)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  
  // Render the edit inventory view with the retrieved data
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Update Inventory Data
 *************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_mileage,  // Changed from inv_miles to inv_mileage to match the form field name
    inv_color,
    classification_id,
  } = req.body;

  // Call the model function to update the inventory item,
  // passing inv_mileage as the mileage parameter
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_mileage,  // Pass the correct mileage value here
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    // On failure, rebuild the classification select list and re-render the edit view with sticky data.
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_mileage,  // Pass the correct mileage value for sticky data
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;