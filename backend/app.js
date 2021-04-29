"use strict";

// Load node modules for server creation

let express = require("express");
let bodyParser = require("body-parser");

// Express execution (http)
let app = express();

// Load files/routes
let article_routes = require('./routes/article')

// Load Middlewares (before load routes)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Load CORS


// Add route prefixes
app.use('/api', article_routes);
// Test routes


// Export modules
module.exports = app;
