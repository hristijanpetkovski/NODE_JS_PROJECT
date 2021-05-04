const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const v1 = require("./routers/v1");

mongoose.connect("mongodb://localhost/ws-gen-11-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/v1/auth", v1);

app.listen("3003", (error) => {
  if (error) {
    return console.log(
      "Error happened while starting the app on port 3003: ",
      error
    );
  }
  console.log("Auth service successfully started on port 3003");
});
