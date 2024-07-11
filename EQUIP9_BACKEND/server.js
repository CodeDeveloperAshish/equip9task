const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const db = require("./config/db");

app.use(bodyParser.json());
app.use(express.json());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  return res.send("Welcome To EQUIP9 API");
});

app.listen(process.env.PORT, () => {
  console.log(
    `server running successfully on port http://localhost:${process.env.PORT}`
  );
});
