const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
    let data = await invModel.getClassifications();
    let list = '<ul class="main-nav">';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += `<li>
                 <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
                   ${row.classification_name}
                 </a>
               </li>`;
    });
    list += "</ul>";
    return list;
  }  


/* **************************************
 * Build the classification view HTML
 ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid;
    if(data.length > 0){
      grid = '<ul id="inv-display">';
      data.forEach(vehicle => { 
        grid += '<li>';
        grid += '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += '<hr />';
        grid += '<h2>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
        grid += '</h2>';
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
        grid += '</div>';
        grid += '</li>';
      });
      grid += '</ul>';
    } else { 
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  }
  
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next);
  
// In utilities/index.js, add:
Util.buildVehicleDetailHTML = async function(vehicle) {
  // Format price and mileage using toLocaleString
  const priceFormatted = Number(vehicle.inv_price)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const mileageFormatted = Number(vehicle.inv_mileage)
    .toLocaleString('en-US');

  // Return the HTML string (adjust keys as needed)
  return `
    <div class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <div class="vehicle-detail-container">
        <div class="vehicle-image">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
        </div>
        <div class="vehicle-info">
          <p><strong>Year:</strong> ${vehicle.inv_year}</p>
          <p><strong>Price:</strong> ${priceFormatted}</p>
          <p><strong>Mileage:</strong> ${mileageFormatted} miles</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </div>
    </div>
  `;
};


  module.exports = Util