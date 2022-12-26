const Item = require("../models/item");

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
