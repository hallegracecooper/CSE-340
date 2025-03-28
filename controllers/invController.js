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

module.exports = invCont;