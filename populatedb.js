require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/category");
const Item = require("./models/item");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function createItem(name, category) {
  return {
    name,
    description: "This is an item description",
    category: category._id,
    price: Math.random() * 5,
    numberInStock: Math.round(Math.random() * 10),
  };
}

const categories = [
  { name: "Food", description: "Tastes good!" },
  { name: "Drink", description: "Also tastes good!" },
];

async function populateDb() {
  await Category.insertMany(categories);
  const categoriesModels = await Category.find({});
  await Promise.all(
    categoriesModels.map((categoryModel) =>
      Item.insertMany([
        createItem("Item 1", categoryModel),
        createItem("Item 2", categoryModel),
        createItem("Item 3", categoryModel),
      ])
    )
  );
}

populateDb().then(() => console.log("Atlas database populated."));
