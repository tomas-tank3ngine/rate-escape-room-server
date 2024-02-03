const router = require("express").Router();
const roomController = require("../controllers/roomController");

router.route("/")
    .get(roomController.allRooms)
    .post(roomController.addRoom)

router.route("/:id")
    .get(roomController.findOneRoom)
    .patch(roomController.updateRoom)
    .delete(roomController.deleteRoom)

router.route("/:id/reviews")
    .get(roomController.roomReviews)
    .post(roomController.addRoomReview);

module.exports = router;
