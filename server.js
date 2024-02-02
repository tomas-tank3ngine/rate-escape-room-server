require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5050;

app.use(cors())
app.use(express.json());

// const warehouseRoutes = require("./routes/warehouseRoute");
// const inventoryRoutes = require("./routes/inventoryRoute");



//Basic Home Route
app.get("/", (_req, res) => {
  res.send("Welcome to my API");
});

app.use("/rooms, roomRoute");
// app.use("/warehouses", warehouseRoutes);
// app.use("/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});