const router = require("express").Router();
const favoriteController = require("../controllers/favoriteController");

router.route("/")
    .get(favoriteController.getAllFavoriteRooms)
    .post(favoriteController.addRoomToFavorites)
    .delete(favoriteController.removeRoomFromFavorites)

module.exports = router;
