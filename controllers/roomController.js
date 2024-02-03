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
    const roomsFound = await knex("rooms")
      .where({ id: req.params.id });

    if (roomsFound.length === 0) {
      return res.status(404).json({
        message: `Room with ID ${req.params.id} not found`
      });
    }

    const roomData = roomsFound[0];
    console.log(roomData)
    res.json(roomData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve user data for room with ID ${req.params.id}`,
    });
  }
};

//Create a room
const addRoom = async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.theme || !groupSize || !duration) {
      return res.status(400).json({
        message: "You are missing information for the room in the request",
      });
    }
  
    try {
      const result = await knex("rooms").insert(req.body);
  
      const newRoomId = result[0];
      const createdUser = await knex("user").where({ id: newRoomId });
  
      res.status(201).json(createdUser);
    } catch (error) {
      res.status(500).json({
        message: `Unable to create new user: ${error}`,
      });
    }
  };

//note that module.exports is an object with functions inside it
module.exports = {  
  allRooms,
  findOneRoom,
//   posts,
    addRoom,
//   update,
//   remove,
};
