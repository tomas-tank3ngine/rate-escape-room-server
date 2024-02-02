const knex = require("knex")(require("../knexfile"));

const allRooms = async (_req, res) => {
  try {
    const data = await knex("rooms");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
};

//Below is the same as: SELECT * FROM user WHERE id=#,
//where # is our parameter at req.params.id
const findOneRoom = async (req, res) => {
  try {
    const roomsFound = await knex("user")
      .where({ id: req.params.id });

    if (roomsFound.length === 0) {
      return res.status(404).json({
        message: `User with ID ${req.params.id} not found` 
      });
    }

    const roomData = roomsFound[0];
    res.json(roomData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve user data for user with ID ${req.params.id}`,
    });
  }
};

//note that module.exports is an object with functions inside it
module.exports = {
  allRooms,
  findOneRoom,
  posts,
  add,
  update,
  remove,
};
