const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./db");

// Import Models
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");

app.use(cors());
app.use(express.json());

// RELATIONSHIPS
// This setup creates the Many-to-Many link
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// ROUTES
app.get("/", (req, res) => res.send("API is running"));

// GET ALL PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE CART
app.post("/cart", async (req, res) => {
  try {
    const cart = await Cart.create();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SPECIFIC CART (The one that was failing)
app.get("/cart/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.cartId, {
      include: {
        model: Product,
        through: { attributes: [] } // Hides the join table data from response
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found. Did you create it first?" });
    }

    res.json(cart);
  } catch (err) {
    console.error("DEBUG ERROR:", err); // Look at your terminal for this!
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
const PORT = 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to sync database:", err);
});