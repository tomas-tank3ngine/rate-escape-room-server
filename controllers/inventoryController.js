const knex = require("knex")(require("../knexfile"));

exports.index = async (_req, res) => {
  try {
    const data = await knex("inventory");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Inventories: ${err}`);
  }
};
