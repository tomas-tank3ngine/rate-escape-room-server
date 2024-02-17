const router = require("express").Router();
const favoriteController = require("../controllers/favoriteController");
const authorize = require("../middleware/authorize");


router.route("/")
    .post(authorize, favoriteController.addRoomToFavorites)

router.route("/:id")
    .delete(authorize, favoriteController.removeRoomFromFavorites)

module.exports = router;
