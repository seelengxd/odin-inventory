const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

const itemValidation = [
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
];

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
      action: "/items",
    });
  });
};

exports.create = [
  itemValidation,
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
          action: "/items",
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

exports.edit = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      categories(callback) {
        Category.find({}, callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        ...results,
        title: "Edit Item",
        errors: [],
        action: `/items/${req.params.id}`,
      });
    }
  );
};

exports.update = [
  itemValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({ ...req.body, _id: req.params.id });

    if (!errors.isEmpty()) {
      Category.find({}, (err, categories) => {
        if (err) {
          return next(err);
        }
        res.render("item_form", {
          title: "Edit Item",
          item: item,
          errors: errors.array(),
          action: `/items/${req.params.id}`,
          categories,
        });
        return;
      });
    }

    Item.findOne(
      { category: item.category, name: req.body.name },
      (err, found_item) => {
        if (err) {
          return next(err);
        }
        if (found_item && found_item._id != req.params.id) {
          res.redirect(found_item.url);
          return;
        }

        Item.findByIdAndUpdate(req.params.id, req.body, (err, item) => {
          if (err) {
            return next(err);
          }
          res.redirect(item.url);
        });
      }
    );
  },
];

exports.destroy = (req, res, next) => {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/items");
  });
};
