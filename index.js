const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const account = require("./routers/userRoute");
const test = require("./routers/testRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/account", account);
app.use("/test", test);

app.get("/aaa/", (req, res) => {
  res.status(200).send("<h1>test</h1>");
});

app.get("/api-auth", (req, res) => {
  res.status(200).send("<h1>test</h1>");
});

mongoose
  .connect("mongodb://localhost/CASDash", {
    useNewUrlParser: true, //removing warning
    useCreateIndex: true //removing warning
  })
  .then(() => console.log("connect to db..."))
  .catch(err => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port:${port}...`));
