/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects
// const inventoryData = require("../seed_data/inventory");
// const warehouseData = require("../seed_data/warehouse");

const ownersData = require('../seed_data/owners')
const roomsData = require('../seed_data/rooms')
const playersData = require('../seed_data/players')
const reviewsData = require('../seed_data/reviews')

exports.seed = async function(knex) {
  // Deletes ALL existing entries and replace with seed data
  await knex('owner').del()
  await knex('owner').insert(ownersData);
  await knex('room').del()
  await knex('room').insert(roomsData);
  await knex('player').del()
  await knex('player').insert(playersData);
  await knex('review').del()
  await knex('review').insert(reviewsData);
};
