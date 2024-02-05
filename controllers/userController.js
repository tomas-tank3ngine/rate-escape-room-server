const knexConfig = require("../knexfile.js").development;
const knex = require("knex")(knexConfig);
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

//expected body: { username, password, email, isOwner}
//response: token, id
const registerUser = async (req, res) => {
    const { username, password, email, isOwner } = req.body;

    if (!username || !password || !email || isOwner === undefined) {
        return res.status(400).json({
            message: "You are missing information for the user in the request",
        });
    }

    try {
        // Check if the user with the given email or username already exists
        const existingUser = await knex("users")
            .where({ email: email })
            .orWhere({ username: username })
            .first();

        if (existingUser) {
            return res.status(400).json({
                message: "User with the same email or username already exists",
            });
        }

        const hashedPassword = bcrypt.hashSync(password);
        const userId = uuidv4();

        const newUser = {
            id: userId,
            username,
            email,
            is_owner: isOwner,
            password: hashedPassword,
        };

        await knex("users").insert(newUser);
        
        // After successful registration, generate a JWT token
        const token = jwt.sign(
            { id: userId, email: email },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
        );

        res.status(201).json({ token, id: userId });
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed registration");
    }
};

//post login user
//expected body: {identifier, password}
const loginUser = async (req, res) => {
    const {identifier, password } = req.body;
    //check to make sure both fields were filled in
    if (!identifier || !password){
        return res.status(400).json({
            message: "You are missing information for the user in the request",
        })
    }

    //find user using email or username
    const user = await knex("users")
        .where({ email: identifier })
        .orWhere({ username: identifier })
        .first();
    
        if (!user){
            return res.status(400).json({
                message: "Invalid identifier",
            })
        }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Invalid password",
        })
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
    );
    res.status(200).json({ token:token, id:user.id });
}

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

// Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
//response: {user}
const currentUser = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send("Please login");
    }

    //store auth token
    const authHeader = req.headers.authorization;
    //remove the 'bearer' part of the string, keeping the second string (the token)
    const authToken = authHeader.split(" ")[1];

    //verify token
    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
        
        const user = await knex("users").where({ id: decodedToken.id }).first();

        if (!user) {
            return res.status(404).json({
                message: `User with ID ${decodedToken.id} not found`,
            });
        }

        delete user.password;
        console.log("User Data:", user);
        res.json(user);
    } catch (err) {
        console.error("Token Verification Error:"+ err);
        return res.status(401).send(`Invalid auth token: ${err.message}`);
    }
};

//note that module.exports is an object with functions inside it
module.exports = {
    allUsers,
    findOneUser,
    updateUser,
    deleteUser,
    currentUser,
    registerUser,
    loginUser,
};
