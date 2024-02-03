require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;

app.use(cors())
app.use(express.json());

const roomRoutes = require("./routes/roomRoute")
const userRoutes = require("./routes/userRoute")

//Basic Home Route
app.get("/", (_req, res) => {
  res.send("Welcome to my API");
});

app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});