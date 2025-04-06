(function() {
    'use strict';
  
    // Get a reference to the classification select element by its ID
    let classificationList = document.querySelector("#classificationList");
  
    // Attach an event listener that triggers when the select element changes
    classificationList.addEventListener("change", function () {
      // Capture the selected classification ID
      let classification_id = classificationList.value;
      console.log(`classification_id is: ${classification_id}`);
      
      // Construct the URL for fetching inventory data based on the selected classification
      let classIdURL = "/inv/getInventory/" + classification_id;
      
      // Initiate a fetch request using the constructed URL
      fetch(classIdURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw Error("Network response was not OK");
        })
        .then(function (data) {
          // Log the returned data for testing purposes
          console.log(data);
          // Call a function to build the inventory table using the returned data
          buildInventoryList(data);
        })
        .catch(function (error) {
          console.log('There was a problem: ', error.message);
        });
    
      // Build inventory items into HTML table components and inject into DOM 
      function buildInventoryList(data) { 
        let inventoryDisplay = document.getElementById("inventoryDisplay"); 
        // Set up the table labels 
        let dataTable = '<thead>'; 
        dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
        dataTable += '</thead>'; 
        // Set up the table body 
        dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
        data.forEach(function (element) { 
          console.log(element.inv_id + ", " + element.inv_model); 
          dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
          dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
          dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
        }); 
        dataTable += '</tbody>'; 
        // Display the contents in the Inventory Management view 
        inventoryDisplay.innerHTML = dataTable; 
      }
      
    });
  })();  