const router = require("express").Router();
const userController = require("../controllers/userController");


router.route("/")
    .get(userController.allUsers)
    // .post(userController.addUser)

router.route("/:id")
    .get(userController.findOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
router.route("/current")
    .get(userController.currentUser)

router.route("/register")
    .post(userController.registerUser)

router.route("/login")
    .post(userController.loginUser)

module.exports = router;
