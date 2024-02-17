const knexConfig = require("../knexfile.js").development;
const knex = require("knex")(knexConfig);
const { v4: uuidv4 } = require("uuid");

const getAllFavoriteRooms = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Assuming there's a table named "favorites" to store user-room relationships
    const favoriteRooms = await knex("favorites")
      .select("rooms.*") // Replace "rooms.*" with the actual columns you want
      .innerJoin("rooms", "favorites.room_id", "rooms.id")
      .where("favorites.user_id", userId);

    res.status(200).json(favoriteRooms);
  } catch (error) {
    res.status(500).json({
      message: `Unable to get favorite rooms for user with ID ${userId}: ${error}`,
    });
  }
};

//expected body: {user_id, room_id}
const addRoomToFavorites = async (req, res) => {
    try {
        const { user_id, room_id } = req.body;

        // Check if the room is already in favorites table
        const existingFavorite = await knex("favorites")
            .where({ user_id, room_id })
            .first();

        if (existingFavorite) {
            return res.status(400).json({
                message: "Room is already in favorites",
            });
        }

        // Add the room-to-user relationship to favorites table
        await knex("favorites").insert({
            id: uuidv4(),
            user_id,
            room_id,
        });

        res.status(201).json({
            message: "Room added to favorites",
        });
    } catch (error) {
        res.status(500).json({
            message: `Unable to add room to favorites: ${error}`,
        });
    }
};

//expected body: {user_id, room_id}
const removeRoomFromFavorites = async (req, res) => {
    try {
        const { user_id, room_id } = req.body;

        // Check if the room is in favorites
        const existingFavorite = await knex("favorites")
            .where({ user_id, room_id })
            .first();

        if (!existingFavorite) {
            return res.status(400).json({
                message: "Room is not in favorites",
            });
        }

        // Remove the room from favorites
        await knex("favorites").where({ user_id, room_id }).del();

        res.status(200).json({
            message: "Room removed from favorites",
        });
    } catch (error) {
        res.status(500).json({
            message: `Unable to remove room from favorites: ${error}`,
        });
    }
};

// Export the functions
module.exports = {
    getAllFavoriteRooms,
    addRoomToFavorites,
    removeRoomFromFavorites,
};
