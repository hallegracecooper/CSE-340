const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const validate = {};

/* ***************************
 *  Validation Rules for New/Update Inventory Data
 *************************** */
validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters long."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters long."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isNumeric()
      .withMessage("Price must be a number."),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isNumeric()
      .withMessage("Year must be a number."),
    body("inv_mileage")
      .trim()
      .notEmpty()
      .withMessage("Mileage is required.")
      .isNumeric()
      .withMessage("Mileage must be a number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
  ];
};

/* ***************************
 *  Check update inventory data and return errors or continue to update
 *************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, 
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

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      inv_id,          // Include inventory id for sticky data
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
    });
  }
  next();
};

module.exports = validate;