const knexConfig = require("../knexfile.js").development;
const knex = require("knex")(knexConfig);
const { v4: uuidv4 } = require("uuid");

const allUsers = async (_req, res) => {
  try {
    const data = await knex("users");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
};

//Below is the same as: SELECT * FROM user WHERE id=#,
//where # is our parameter at req.params.id
const findOneUser = async (req, res) => {
  try {
    const usersFound = await knex("users").where({ id: req.params.id });
    0;
    if (usersFound.length === 0) {
      return res.status(404).json({
        message: `User with ID ${req.params.id} not found`,
      });
    }

    const userData = usersFound[0];
    console.log(userData);
    res.json(userData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve user data for user with ID ${req.params.id}`,
    });
  }
};

//Create a user
//Make sure that the user_id exists in the req body in the frontend
const addUser = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.user_id ||
    !req.body.description ||
    !req.body.theme ||
    !req.body.group_size ||
    !req.body.duration
  ) {
    return res.status(400).json({
      message: "You are missing information for the user in the request",
    });
  }

  try {
    const userId = uuidv4();

    const result = await knex("users").insert({
      id: userId,
      ...req.body,
    });

    //if we have successfully written the user to the table, then return the user from the table as a response
    if (result && result.length > 0) {
      const createdUser = await knex("users").where({ id: userId }).first();

      res.status(201).json(createdUser);
    } else {
      res.status(500).json({
        message: "Unable to create new user.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new user: ${error}`,
    });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const usersFound = await knex("users").where({ id: userId });

    if (usersFound.length === 0) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    const existingUser = usersFound[0];

    // Assuming req.body contains the fields to update
    const updatedUserData = {
      ...existingUser,
      ...req.body,
      updated_at: knex.fn.now(), // Update the timestamp
    };

    await knex("users").where({ id: userId }).update(updatedUserData);

    const updatedUser = await knex("users").where({ id: userId }).first();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update user with ID ${userId}: ${error}`,
    });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const usersFound = await knex("users").where({ id: userId });

    if (usersFound.length === 0) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    await knex("users").where({ id: userId }).del();

    res.status(204).json(); // No content needed in the json response since it is a successful delete
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete user with ID ${userId}: ${error}`,
    });
  }
};

//note that module.exports is an object with functions inside it
module.exports = {
  allUsers,
  findOneUser,
  //   posts,
  addUser,
  updateUser,
  deleteUser,
};
