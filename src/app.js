const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimiter = require("./middlewares/rateLimiter");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());
app.use(rateLimiter);

app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
