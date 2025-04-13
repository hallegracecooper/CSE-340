// controllers/favoriteController.js

const favoritesModel = require('../models/favorites-model');
const utilities = require('../utilities'); // ensure we can call getNav()

/**
 * Retrieve and display all favorite items for the current user.
 */
async function viewFavorites(req, res, next) {
    try {
        const account_id = res.locals.accountData && res.locals.accountData.account_id;
        if (!account_id) {
            throw new Error("User is not logged in.");
        }

        // Retrieve favorites from the model (with inventory details joined)
        const favorites = await favoritesModel.getFavoritesByAccount(account_id);
        
        // Retrieve navigation HTML
        const nav = await utilities.getNav();
        
        // Render the favorites view and include nav
        res.render('account/favorites', {
            title: "My Favorites",
            favorites,
            nav
        });
    } catch (error) {
        console.error('Error in viewFavorites controller:', error);
        next(error);
    }
}

async function addFavorite(req, res, next) {
    try {
        // Use JWT account data from res.locals instead of req.session.account
        const account_id = res.locals.accountData && res.locals.accountData.account_id;
        const { inv_id } = req.body;

        if (!account_id) {
            throw new Error("User is not logged in.");
        }
        if (!inv_id) {
            throw new Error("Missing inventory id for favorite.");
        }

        // Add the favorite entry to the database
        await favoritesModel.addFavorite(account_id, inv_id);
        
        // Redirect to the favorites page
        res.redirect('/account/favorites');
    } catch (error) {
        console.error('Error in addFavorite controller:', error);
        next(error);
    }
}

async function removeFavorite(req, res, next) {
    try {
        const account_id = res.locals.accountData && res.locals.accountData.account_id;
        const { inv_id } = req.body;

        if (!account_id) {
            throw new Error("User is not logged in.");
        }
        if (!inv_id) {
            throw new Error("Missing inventory id to remove favorite.");
        }

        // Remove the favorite from the database
        await favoritesModel.removeFavorite(account_id, inv_id);
        
        // Redirect to the favorites view after removal
        res.redirect('/account/favorites');
    } catch (error) {
        console.error('Error in removeFavorite controller:', error);
        next(error);
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    viewFavorites,
};