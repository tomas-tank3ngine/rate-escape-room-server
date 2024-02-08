const knexConfig = require("../knexfile.js").development;
const knex = require("knex")(knexConfig);
const { v4: uuidv4 } = require("uuid");

const allRooms = async (_req, res) => {
    try {
        const data = await knex("rooms");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving Users: ${err}`);
    }
};

//expected body:
//response: object with room data {...}
const findOneRoom = async (req, res) => {
    try {
        const roomsFound = await knex("rooms").where({ id: req.params.id });
        0;
        if (roomsFound.length === 0) {
            return res.status(404).json({
                message: `Room with ID ${req.params.id} not found`,
            });
        }

        const roomData = roomsFound[0];
        res.json(roomData);
    } catch (error) {
        res.status(500).json({
            message: `Unable to retrieve user data for room with ID ${req.params.id}`,
        });
    }
};

//Create a room
//expected body: name, user_id, description, theme, group_size, duration, difficulty, cost
//response: {createdRoom}
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
            const createdRoom = await knex("rooms")
                .where({ id: roomId })
                .first();

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

// Retrieve all reviews for a room
//expected response: Array of reviews for a given room & each of the calculated ratings for the room
// [{...},{...}], {overall_rating, tech_rating, etc}

const roomReviews = async (req, res) => {
    const room_id = req.params.id;
    console.log(room_id);

    try {
        // Check if the room exists
        const roomsFound = await knex("rooms").where({ id: room_id });

        if (roomsFound.length === 0) {
            return res.status(404).json({
                message: `Room with ID ${room_id} not found`,
            });
        }

        // Retrieve reviews for the room
        const reviews = await knex("reviews").where({ room_id: room_id });

        //Calculate averate for all ratings
        const averageRatings = await calculateReviews(room_id);

        const response = {
            reviews: reviews,
            averageRatings: averageRatings,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: `Unable to retrieve reviews for room with ID ${room_id}: ${error}`,
        });
    }
};

const convertRating = (rating) => {
    let result = 0;
    switch (rating) {
        case "strongly disagree":
            result = 1;
            console.log(result);
            break;

        case "disagree":
            result = 2;
            console.log(result);
            break;

        case "neutral":
            result = 3;
            console.log(result);
            break;

        case "agree":
            result = 4;
            console.log(result);
            break;

        case "strongly agree":
            result = 5;
            console.log(result);
            break;

        default:
            console.log(rating);
            break;
    }
    return result;
};

const addRoomReview = async (req, res) => {
    const {
        user_id,
        room_id,
        atmosphere_rating,
        puzzle_fairness_rating,
        tech_rating,
        storyline_rating,
        staff_rating,
        comment,
    } = req.body;
    if (
        !user_id ||
        !room_id ||
        !comment ||
        !atmosphere_rating ||
        !puzzle_fairness_rating ||
        !tech_rating ||
        !storyline_rating ||
        !staff_rating
    ) {
        return res.status(400).json({
            message: "You are missing information for the room in the request",
        });
    }

    try {
        const reviewId = uuidv4();
        console.log(reviewId);
        const convertedReview = {
            id: reviewId,
            user_id,
            room_id,
            comment,
            atmosphere_rating: convertRating(atmosphere_rating),
            puzzle_fairness_rating: convertRating(puzzle_fairness_rating),
            tech_rating: convertRating(tech_rating),
            storyline_rating: convertRating(storyline_rating),
            staff_rating: convertRating(staff_rating),
        };

        console.log("after object");
        console.log("converted review: " + convertedReview);
        const result = await knex("reviews").insert(convertedReview);
        console.log("result: " + result);

        //if we have successfully written the review to the table, then return the review from the table as a response
        if (result && result.length > 0) {
            const createdReview = await knex("reviews")
                .where({ id: reviewId })
                .first();

            res.status(201).json(createdReview);
        } else {
            res.status(500).json({
                message: "Unable to create new room.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new review: ${error.message}`,
        });
    }
};

async function calculateReviews(roomId) {
    try {
        const reviews = await knex("reviews")
            .where("room_id", roomId)
            .select(
                "atmosphere_rating",
                "puzzle_fairness_rating",
                "tech_rating",
                "storyline_rating",
                "staff_rating"
            );

        const totalReviews = reviews.length;

        // Check if there are any reviews
        if (totalReviews === 0) {
            return {
                overall_rating: 0,
                atmosphere: 0,
                puzzleFairness: 0,
                tech: 0,
                storyline: 0,
                staff: 0,
            };
        }

        // Calculate the sum of all ratings
        const sum = reviews.reduce(
            (acc, review) => {
                acc.atmosphere += review.atmosphere_rating;
                acc.puzzleFairness += review.puzzle_fairness_rating;
                acc.tech += review.tech_rating;
                acc.storyline += review.storyline_rating;
                acc.staff += review.staff_rating;
                return acc;
            },
            {
                atmosphere: 0,
                puzzleFairness: 0,
                tech: 0,
                storyline: 0,
                staff: 0,
            }
        );

        // Calculate the average rating
        const average = {
            overall_rating:
                (sum.atmosphere +
                    sum.puzzleFairness +
                    sum.tech +
                    sum.storyline +
                    sum.staff) /
                (5 * totalReviews),
            atmosphere_rating: sum.atmosphere / totalReviews,
            puzzle_fairness_rating: sum.puzzleFairness / totalReviews,
            tech_rating: sum.tech / totalReviews,
            storyline_rating: sum.storyline / totalReviews,
            staff_rating: sum.staff / totalReviews,
        };

        return average;
    } catch (error) {
        console.log(error);
    }
}

//note that module.exports is an object with functions inside it
module.exports = {
    allRooms,
    findOneRoom,
    addRoom,
    updateRoom,
    deleteRoom,
    roomReviews,
    addRoomReview,
};
