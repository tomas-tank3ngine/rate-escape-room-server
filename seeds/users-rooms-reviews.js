/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects

const usersData = require('../seed_data/users')
const roomsData = require('../seed_data/rooms')
const reviewsData = require('../seed_data/reviews')

exports.seed = async function(knex) {
  // Deletes ALL existing entries and replace with seed data
  await knex('users').del()
  await knex('users').insert(usersData);
  await knex('rooms').del()
  await knex('rooms').insert(roomsData);
  await knex('reviews').del()
  await knex('reviews').insert(reviewsData);
};
