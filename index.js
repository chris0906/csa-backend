const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const account = require("./routers/userRoute");
const topic = require("./routers/topicRoute");
const post = require("./routers/postRoute");
const redis = require("redis");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/account", account);
app.use("/topic", topic);
app.use("/post", post);
app.use((err, req, res, next) => {
  if (err) res.send({ msg: err });
});

app.get("/health-check", (req, res) => {
  return res.status(200).send("healthy...");
});

app.get("/api-auth", (req, res) => {
  res.status(200).send("<h1>test</h1>");
});

const redis_host = process.env.REDIS_HOST || "localhost";
const redis_port = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
  host: redis_host,
  port: redis_port
});

redisClient.set("string key", "string value", redis.print);

const mongo_host = process.env.MONGO_HOST || "localhost";
const mongo_port = process.env.MONGO_PORT || 27017;
const mongo_database = process.env.MONGO_DB || "Chris";

mongoose
  .connect(`mongodb://${mongo_host}:${mongo_port}/${mongo_database}`, {
    useNewUrlParser: true, //removing warning
    useCreateIndex: true //removing warning
  })
  .then(() => console.log("connect to db..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port:${port}...`));
