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
    include: [{ model: Rating }],
  });
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Rating }],
  });
  res.json(product);
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const existing = await Product.findOne({ where: { name: req.body.name } });
      return res.json(existing);
    }
    res.status(500).json({ error: err.message });
  }
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
    ProductId: req.params.id,
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
    let cart = await Cart.findByPk(req.params.cartId);
    if (!cart) {
      cart = await Cart.create({ id: req.params.cartId });
    }
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: product.id }
    });

    if (cartItem) {
      await CartItem.update(
        { quantity: cartItem.quantity + 1 },
        { where: { CartId: cart.id, ProductId: product.id } }
      );
    } else {
      try {
        await cart.addProduct(product, { through: { quantity: 1 } });
      } catch (e) {
        // SQLite doesn't drop old unique constraints during alter:true.
        // If it blocks adding multiple items, we force recreate the junction table to fix the schema permanently.
        await CartItem.sync({ force: true });
        await cart.addProduct(product, { through: { quantity: 1 } });
      }
    }
    
    res.json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/cart/:cartId/products/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOne({
      where: { CartId: req.params.cartId, ProductId: req.params.productId }
    });
    if (cartItem) {
      await CartItem.update(
        { quantity: quantity },
        { where: { CartId: req.params.cartId, ProductId: req.params.productId } }
      );
      res.json({ message: "Quantity updated" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/cart/:cartId/products/:productId", async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { CartId: req.params.cartId, ProductId: req.params.productId }
    });
    if (cartItem) {
      await cartItem.destroy();
      res.json({ message: "Product removed from cart" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/cart/:cartId/empty", async (req, res) => {
  try {
    await CartItem.destroy({ where: { CartId: req.params.cartId } });
    res.json({ message: "Cart emptied" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/cart/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.cartId, {
      include: {
        model: Product,
        through: { attributes: ["quantity"] },
      },
    });
    if (!cart) {
      await Cart.create({ id: req.params.cartId });
      return res.json({ id: parseInt(req.params.cartId), Products: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// STARTA SERVER
// =======================
const startServer = async () => {
  await sequelize.query('PRAGMA foreign_keys = OFF');
  
  // Clean up any broken backup tables left behind by previous crashes
  try {
    await sequelize.query('DROP TABLE IF EXISTS `Products_backup`;');
    await sequelize.query('DROP TABLE IF EXISTS `Carts_backup`;');
    await sequelize.query('DROP TABLE IF EXISTS `CartItems_backup`;');
    await sequelize.query('DROP TABLE IF EXISTS `Ratings_backup`;');
  } catch (err) {
    // Ignore if tables don't exist
  }

  await sequelize.sync({ alter: true });
  await sequelize.query('PRAGMA foreign_keys = ON');
  
  console.log("All models synced");
  
  const defaultCart = await Cart.findByPk(1);
  if (!defaultCart) {
    await Cart.create({ id: 1 });
  }

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
