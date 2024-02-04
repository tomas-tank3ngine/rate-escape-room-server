const router = require("express").Router();
const userController = require("../controllers/userController");
const authenticateToken = require('../middleware/jwtMiddleware');

router.route("/")
    .get(authenticateToken, userController.allUsers)
    .post(authenticateToken, userController.addUser)

router.route("/:id")
    .get(authenticateToken, userController.findOneUser)
    .patch(authenticateToken, userController.updateUser)
    .delete(authenticateToken, userController.deleteUser)

module.exports = router;
