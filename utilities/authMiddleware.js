// utilities/authMiddleware.js
const jwt = require("jsonwebtoken");

function restrictInventoryAdmin(req, res, next) {
  // Assume the token is stored in a cookie named 'jwt'
  const token = req.cookies.jwt;
  if (token) {
    // Use the same secret as in the general checkJWTToken middleware
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        req.flash("notice", "Please log in to access that page.");
        return res.redirect("/account/login");
      } else {
        // Check if account_type is Employee or Admin
        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
          return next();
        } else {
          req.flash("notice", "You do not have sufficient permissions to access that page.");
          return res.redirect("/account/login");
        }
      }
    });
  } else {
    req.flash("notice", "Please log in to access that page.");
    return res.redirect("/account/login");
  }
}

module.exports = { restrictInventoryAdmin };