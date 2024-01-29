const router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");

router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.addWarehouse);

router
  .route("/:id")
  .get(warehouseController.singleWarehouse)
  .patch(warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);

router.route("/:id/inventories").get(warehouseController.warehouseInventories);

module.exports = router;
