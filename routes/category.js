const express = require("express");
const CategoryController = require("../controllers/CategoryController");

const router = express.Router();

router.get("/", CategoryController.index);

router.get("/new", CategoryController.new);

router.get("/:id/edit", CategoryController.edit);

router.get("/:id", CategoryController.show);

router.post("/", CategoryController.create);

router.post("/:id", CategoryController.update);

router.delete("/:id", CategoryController.destroy);

module.exports = router;
