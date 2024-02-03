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
0
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
//Make sure that the owner_id exists in the req body in the frontend
const addRoom = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.user_id ||
    !req.body.description ||
    !req.body.theme ||
    !req.body.group_size ||
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

    //if we have successfully written the room to the table, then return the room from the table as a response
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

// Update a room by ID
const updateRoom = async (req, res) => {
    const roomId = req.params.id;
  
    try {
      const roomsFound = await knex("rooms").where({ id: roomId });
  
      if (roomsFound.length === 0) {
        return res.status(404).json({
          message: `Room with ID ${roomId} not found`,
        });
      }
  
      const existingRoom = roomsFound[0];
  
      // Assuming req.body contains the fields to update
      const updatedRoomData = {
        ...existingRoom,
        ...req.body,
        updated_at: knex.fn.now(), // Update the timestamp
      };
  
      await knex("rooms").where({ id: roomId }).update(updatedRoomData);
  
      const updatedRoom = await knex("rooms").where({ id: roomId }).first();
  
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({
        message: `Unable to update room with ID ${roomId}: ${error}`,
      });
    }
  };

  // Delete a room by ID
const deleteRoom = async (req, res) => {
    const roomId = req.params.id;
  
    try {
      const roomsFound = await knex("rooms").where({ id: roomId });
  
      if (roomsFound.length === 0) {
        return res.status(404).json({
          message: `Room with ID ${roomId} not found`,
        });
      }
  
      await knex("rooms").where({ id: roomId }).del();
  
      res.status(204).json(); // No content needed in the json response since it is a successful delete
    } catch (error) {
      res.status(500).json({
        message: `Unable to delete room with ID ${roomId}: ${error}`,
      });
    }
  };

//note that module.exports is an object with functions inside it
module.exports = {
  allRooms,
  findOneRoom,
  //   posts,
  addRoom,
  updateRoom,
    deleteRoom,
};
