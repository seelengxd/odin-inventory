const express = require("express");
const ItemController = require("../controllers/ItemController");

const router = express.Router();

router.get("/", ItemController.index);

router.get("/new", ItemController.new);

router.get("/:id", ItemController.show);

router.post("/", ItemController.create);

router.get("/:id/edit", ItemController.edit);

router.put("/:id", ItemController.update);

router.delete("/:id", ItemController.destroy);

module.exports = router;
