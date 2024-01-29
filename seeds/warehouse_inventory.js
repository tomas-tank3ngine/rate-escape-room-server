// import seed data files, arrays of objects
const inventoryData = require("../seed_data/inventory");
const warehouseData = require("../seed_data/warehouse");

exports.seed = async function (knex) {
  await knex("warehouse").del();
  await knex("warehouse").insert(warehouseData);
  await knex("inventory").del();
  await knex("inventory").insert(inventoryData);
};
