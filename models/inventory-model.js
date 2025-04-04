const pool = require("../database/")

/* ***************************
 *  Get all classification data
 *************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Get a specific vehicle by ID
 *************************** */
async function getVehicleById(inv_id) {
  const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
  return await pool.query(sql, [inv_id]);
}

/* ***************************
 *  Insert a new classification into the database
 *************************** */
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id`;
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("addClassification error: " + error);
    throw error;
  }
}

/* ***************************
 *  Insert a new vehicle into the inventory table
 *************************** */
async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO public.inventory 
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING inv_id
    `;
    return await pool.query(sql, [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_year,
      data.inv_mileage, // form field "inv_mileage" will insert into the "inv_miles" column
      data.inv_color
    ]);
  } catch (error) {
    console.error("addInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Export all functions
 *************************** */
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
};