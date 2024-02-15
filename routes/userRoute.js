const router = require("express").Router();
const userController = require("../controllers/userController");
const authorize = require("../middleware/authorize");

router.route("/").get(userController.allUsers);

router
    .route("/:id")
    .get(userController.findOneUser)
    .patch(authorize, userController.updateUser)
    .delete(authorize, userController.deleteUser);

// router
//     .route("/:id/")

router
    .route("/account/current")
    // Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
    //response: {user}
    .get(userController.currentUser);

router
    .route("/account/register")
    //expected body: { username, password, email, isOwner}
    //response: token, id
    .post(userController.registerUser);

router
    .route("/account/login")
    //expected body: {identifier, password}
    //response: {token, id}
    .post(userController.loginUser);

module.exports = router;
