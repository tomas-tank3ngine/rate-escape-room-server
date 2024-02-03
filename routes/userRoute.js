const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/")
    .get(userController.allUsers)
    .post(userController.addUser)

router.route("/:id")
    .get(userController.findOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

// router.route("/:id/reviews").get(userController.userReviews);

module.exports = router;
