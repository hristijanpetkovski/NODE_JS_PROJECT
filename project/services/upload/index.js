const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect("mongodb://localhost/ws-gen-11-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/upload', (req, res) => { 
  res.send('This is the upload service')
});

app.listen("3001", (error) => {
  if (error) {
    return console.log(
      "Error happened while starting the app on port 3001: ",
      error
    );
  }
  console.log("Upload service successfully started on port 3001");
});
