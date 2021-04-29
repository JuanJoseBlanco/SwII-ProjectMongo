"use strict";

let mongoose = require("mongoose");
let app = require("./app");
let port = 3900;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", { useNewUrlParser: true })
  .then(() => {
    console.log("Conexion existosa a la base de datos 🥬");

    //Create server and listen to HTTP requests
    
    app.listen(port, () => {
      console.log("🤖 Server running on port ", port);
    });
  });
