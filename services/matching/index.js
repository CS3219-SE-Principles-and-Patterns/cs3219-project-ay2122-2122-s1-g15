const express = require("express");
const morgan = require("morgan");
const routes = require("./api/routes");
const port = 4000;
const app = express();
app.use(morgan("combined"));
routes(app);
app.listen(port, function () {
  console.log("Server started on port: " + port);
});
