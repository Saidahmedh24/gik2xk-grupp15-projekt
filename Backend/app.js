const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./db");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");
const Rating = require("./models/Rating");

app.use(cors());
app.use(express.json());

// RELATIONER
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Product.hasMany(Rating);
Rating.belongsTo(Product);

// =======================
// PRODUCTS
// =======================

app.get("/products", async (req, res) => {
  const products = await Product.findAll({
    include: [{ model: Rating }]
  });
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Rating }]
  });
  res.json(product);
});

app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

app.put("/products/:id", async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Product updated" });
});

app.delete("/products/:id", async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: "Product deleted" });
});

// =======================
// RATING
// =======================

app.post("/products/:id/ratings", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const rating = await Rating.create({
    rating: req.body.rating,
    ProductId: req.params.id
  });
  res.json(rating);
});

// =======================
// CART
// =======================

app.post("/cart", async (req, res) => {
  try {
    const cart = await Cart.create();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/cart/:cartId/products/:productId", async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.cartId);
    const product = await Product.findByPk(req.params.productId);
    if (!cart || !product) return res.status(404).json({ message: "Not found" });
    await cart.addProduct(product);
    res.json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/cart/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.cartId, {
      include: {
        model: Product,
        through: { attributes: ["quantity"] }
      }
    });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// STARTA SERVER
// =======================
sequelize.sync({ force: true }).then(() => {
  console.log("All models synced");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
