const knexConfig = require("../knexfile.js").development;
const knex = require("knex")(knexConfig);
const { v4: uuidv4 } = require('uuid');

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
    const roomsFound = await knex("rooms").where({ id: req.params.id });

    if (roomsFound.length === 0) {
      return res.status(404).json({
        message: `Room with ID ${req.params.id} not found`,
      });
    }

    const roomData = roomsFound[0];
    console.log(roomData);
    res.json(roomData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve user data for room with ID ${req.params.id}`,
    });
  }
};

//Create a room
const addRoom = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.theme ||
    !req.body.groupSize ||
    !req.body.duration
  ) {
    return res.status(400).json({
      message: "You are missing information for the room in the request",
    });
  }

  try {
    const roomId = uuidv4();
    const result = await knex("rooms").insert({
      id: roomId,
      ...req.body,
    });

    if (result && result.length > 0) {
        const createdRoom = await knex("rooms").where({ id: roomId }).first();
  
        res.status(201).json(createdRoom);
      } else {
        res.status(500).json({
          message: "Unable to create new room.",
        });
      }
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
