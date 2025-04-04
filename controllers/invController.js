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
    res.render("inventory/management", {
      title: "Inventory Management",
      nav
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
        inv_mileage,
        inv_color,
        errors: [{ msg: "Failed to add new vehicle." }]
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;