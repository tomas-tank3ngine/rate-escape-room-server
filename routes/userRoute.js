const router = require("express").Router();
const userController = require("../controllers/userController");
const authorize = require("../middleware/authorize");


router.route("/")
    .get(userController.allUsers)

router.route("/:id")
    .get(userController.findOneUser)
    .patch(authorize, userController.updateUser)
    .delete(authorize, userController.deleteUser)

router.route("/account/current")
    .get(userController.currentUser)

router.route("/account/register")
    .post(userController.registerUser)

router.route("/account/login")
    .post(userController.loginUser)

module.exports = router;
