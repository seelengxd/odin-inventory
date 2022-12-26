var express = require("express");
var router = express.Router();
const async = require("async");

const Category = require("../models/category");
const Item = require("../models/item");

/* GET home page. */
router.get("/", function (req, res, next) {
  async.parallel(
    {
      category_count(callback) {
        Category.countDocuments(callback);
      },
      item_count(callback) {
        Item.countDocuments(callback);
      },
    },
    (err, result) => {
      console.log("do u reach here??");
      if (err) {
        return next(err);
      }
      res.render("index", { title: "Express", data: result });
    }
  );
});

module.exports = router;
