/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects

const ownersData = require('../seed_data/owners')
const roomsData = require('../seed_data/rooms')
const playersData = require('../seed_data/players')
const reviewsData = require('../seed_data/reviews')

exports.seed = async function(knex) {
  // Deletes ALL existing entries and replace with seed data
  await knex('owners').del()
  await knex('owners').insert(ownersData);
  await knex('rooms').del()
  await knex('rooms').insert(roomsData);
  await knex('players').del()
  await knex('players').insert(playersData);
  await knex('reviews').del()
  await knex('reviews').insert(reviewsData);
};
