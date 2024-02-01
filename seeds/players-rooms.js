/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects
// const inventoryData = require("../seed_data/inventory");
// const warehouseData = require("../seed_data/warehouse");

const playersData = require('../seed_data/players')
const roomsData = require('../seed_data/rooms')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('player').del()
  await knex('player').insert(playersData);
  await knex('room').del()
  await knex('room').insert(roomsData);
};
