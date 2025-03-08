const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Set the port
const port = process.env.PORT || 3000;

// Set the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');  // This tells express-ejs-layouts to use views/layout.ejs

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define a route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});