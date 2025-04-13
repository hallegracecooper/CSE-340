// models/favorites-model.js

const pool = require('../database/');  // Adjust the path based on your project structure

/**
 * Add a new favorite entry for a given account and inventory item.
 * @param {number} account_id - The ID of the user's account.
 * @param {number} inv_id - The ID of the inventory item.
 * @returns {Promise<Object>} - Returns the newly created favorite record.
 */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = `
          INSERT INTO favorites (account_id, inv_id)
          VALUES ($1, $2)
          RETURNING favorite_id, account_id, inv_id, date_added;
        `;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}

/**
 * Remove an existing favorite entry for a given account and inventory item.
 * @param {number} account_id - The ID of the user's account.
 * @param {number} inv_id - The ID of the inventory item.
 * @returns {Promise<Object>} - Returns the deleted favorite record.
 */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = `
          DELETE FROM favorites
          WHERE account_id = $1 AND inv_id = $2
          RETURNING favorite_id, account_id, inv_id, date_added;
        `;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

/**
 * Retrieve all favorite inventory items for a given account.
 * @param {number} account_id - The ID of the user's account.
 * @returns {Promise<Array>} - Returns an array of favorite items including inventory details.
 */
async function getFavoritesByAccount(account_id) {
    try {
        // Joining the favorites table with the inventory table to get full details of the vehicle
        const sql = `
          SELECT f.favorite_id, f.account_id, f.inv_id, f.date_added,
                 i.*
          FROM favorites AS f
          JOIN inventory AS i ON f.inv_id = i.inv_id
          WHERE f.account_id = $1;
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving favorites:', error);
        throw error;
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByAccount,
};