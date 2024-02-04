require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;



const roomRoutes = require("./routes/roomRoute")
const userRoutes = require("./routes/userRoute")
const favoriteRoutes = require("./routes/favoriteRoute")

app.use(cors())
app.use(express.json());

//Basic Home Route
app.get("/api/", (_req, res) => {
  res.send("Welcome to my API");
});

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});