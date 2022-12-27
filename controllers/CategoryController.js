const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

const categoryValidation = [
  body("name", "Name cannot be empty").trim().isLength({ min: 1 }).escape(),
];

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
    action: "/categories",
  });
};

exports.create = [
  categoryValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category(req.body);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
        action: "/categories",
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
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      return next(err);
    }
    res.render("category_form", {
      title: "Edit Category",
      category: category,
      errors: [],
      action: `/categories/${category.id}`,
    });
  });
};

exports.update = [
  categoryValidation,
  (req, res) => {
    const errors = validationResult(req);
    const category = new Category({ ...req.body, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Edit Category",
        category: category,
        errors: errors.array(),
        action: `/categories/${category._id}`,
      });
      return;
    }

    Category.findOne({ name: req.body.name }, (err, found_category) => {
      if (err) {
        return next(err);
      }
      if (found_category && found_category._id !== req.params.id) {
        res.redirect(found_category.url);
        return;
      }

      Category.findByIdAndUpdate(req.params.id, req.body, (err, category) => {
        if (err) {
          return next(err);
        }
        res.redirect(category.url);
      });
    });
  },
];

exports.destroy = (req, res) => {
  async.parallel(
    [
      (callback) => Item.deleteMany({ category: req.params.id }, callback),
      (callback) => Category.findByIdAndRemove(req.params.id, callback),
    ],
    (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/categories");
    }
  );
};
