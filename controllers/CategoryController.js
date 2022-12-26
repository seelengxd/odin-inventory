const Category = require("../models/category");
const Item = require("../models/item");

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
  res.send("Not implemented - New");
};

exports.create = (req, res) => {
  res.send("Not implemented - Create");
};

exports.edit = (req, res) => {
  res.send(`Not implemented - Edit ${req.params.id}`);
};

exports.update = (req, res) => {
  res.send(`Not implemented - Update ${req.params.id}`);
};

exports.destroy = (req, res) => {
  res.send(`Not implemented - Destroy ${req.params.id}`);
};
