const knex = require("knex")(require("../knexfile"));

exports.index = async (_req, res) => {
  try {
    const data = await knex("warehouse").select("id", "name", "manager");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

exports.singleWarehouse = async (req, res) => {
  try {
    const data = await knex("warehouse").where({ id: req.params.id });

    // If record is not found, respond with 404
    if (!data.length) {
      return res
        .status(404)
        .send(`Record with id: ${req.params.id} is not found`);
    }

    // Knex returns an array of records, so we need to send response with a single object only
    res.json(data[0]);
  } catch (err) {
    res.status(400).send(`Error retrieving warehouse ${req.params.id}: ${err}`);
  }
};

exports.warehouseInventories = async (req, res) => {
  try {
    const data = await knex("inventory").where({ warehouse_id: req.params.id });
    res.json(data);
  } catch (err) {
    res
      .status(400)
      .send(
        `Error retrieving inventories for Warehouse ${req.params.id}: ${err}`
      );
  }
};

exports.addWarehouse = async (req, res) => {
  // Validate the request body for required data
  if (
    !req.body.name ||
    !req.body.manager ||
    !req.body.address ||
    !req.body.phone ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide name, manager, address, phone and email fields in request"
      );
  }

  try {
    const data = await knex("warehouse").insert(req.body);

    // For POST requests we can respond with 201 and the location of the newly created record
    const newWarehouseURL = `/warehouses/${data[0]}`;
    res.status(201).location(newWarehouseURL).end(newWarehouseURL);
  } catch (err) {
    res.status(400).send(`Error creating Warehouse: ${err}`);
  }
};

exports.updateWarehouse = async (req, res) => {
  try {
    await knex("warehouse").update(req.body).where({ id: req.params.id });
    res.send(`Warehouse with id: ${req.params.id} has been updated`);
  } catch (err) {
    res.status(400).send(`Error updating Warehouse ${req.params.id}: ${err}`);
  }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    await knex("warehouse").delete().where({ id: req.params.id });
    res.status(204).send(`Warehouse with id ${req.params.id} was deleted`);
  } catch (err) {
    res.status(400).send(`Error deleting Warehouse ${req.params.id}: ${err}`);
  }
};
