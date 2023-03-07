const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('runValidators', true);
mongoose
  .connect("mongodb://localhost:27017/mestodb")
  .then(console.log("Connected to the server"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64062c6370b57a8878da3de7",
  };

  next();
});

app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));
app.listen(PORT, function () {
  console.log("now listening  on http://localhost:3000/");
});
