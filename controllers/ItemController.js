const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
  Item.find({}).then((items) => {
    res.render("item_index", { items });
  });
};

exports.show = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec()
    .then((item) => {
      res.render("item_show", { item });
      console.log(item);
    })
    .catch((err) => next(err));
};

exports.new = (req, res, next) => {
  Category.find((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("item_form", {
      title: "Create Item",
      item: null,
      categories,
      errors: [],
    });
  });
};

exports.create = [
  body("name", "Name cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("category")
    .isMongoId()
    .custom((id) =>
      Category.findById(id)
        .exec()
        .then((category) => {
          if (category == null) {
            return Promise.reject("Category not found");
          }
        })
    ),
  body("price", "Price must be at least 0").isFloat({ min: 0 }),
  body("numberInStock", "Number in stock must be at least 0").isInt({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item(req.body);
    if (!errors.isEmpty()) {
      Category.find((err, categories) => {
        if (err) {
          return next(err);
        }
        res.render("item_form", {
          title: "Create Item",
          item: item,
          categories,
          errors: errors.array(),
        });
      });
      return;
    }
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.edit = (req, res) => {
  res.send(`Not implemented - Edit ${req.params.id}`);
};

exports.update = (req, res) => {
  res.send(`Not implemented - Update ${req.params.id}`);
};

exports.destroy = (req, res, next) => {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/items");
  });
};
