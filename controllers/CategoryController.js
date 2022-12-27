const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
  Category.find({}).then((categories) => {
    res.render("category_index", { categories });
  });
};

exports.show = (req, res, next) => {
  Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ])
    .then((results) => {
      console.log(results);
      res.render("category_show", { category: results[0], items: results[1] });
    })
    .catch((err) => next(err));
};

exports.new = (req, res) => {
  res.render("category_form", {
    title: "Create Category",
    category: null,
    errors: [],
  });
};

exports.create = [
  body("name", "Name cannot be empty").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category(req.body);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    }
    Category.findOne({ name: req.body.name }).exec((err, found_category) => {
      if (err) {
        return next(err);
      }
      if (found_category) {
        res.redirect(found_category.url);
        return;
      }
      category.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(category.url);
      });
    });
  },
];

exports.edit = (req, res) => {
  res.send(`Not implemented - Edit ${req.params.id}`);
};

exports.update = (req, res) => {
  res.send(`Not implemented - Update ${req.params.id}`);
};

exports.destroy = (req, res) => {
  res.send(`Not implemented - Destroy ${req.params.id}`);
};
