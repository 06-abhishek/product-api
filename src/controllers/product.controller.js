const Product = require("../models/product.model");
const redis = require("../config/redis");

const CATEGORY_ENUM = Product.validCategories;

const sendResponse = (res, statusCode, success, data, message = "") => {
  res.status(statusCode).json({ success, data, message });
};

// POST /products
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Name, price, description and category are required"
      );
    }

    if (!CATEGORY_ENUM.includes(category)) {
      return sendResponse(
        res,
        400,
        false,
        null,
        `Invalid category. Valid categories: ${CATEGORY_ENUM.join(", ")}`
      );
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
    });

    await Promise.all([
      redis.del("products:all"),
      redis.del(`products:category:${category.toLowerCase()}`),
    ]);

    sendResponse(res, 201, true, product, "Product created successfully");
  } catch (err) {
    console.error("Error creating product:", err);
    sendResponse(res, 500, false, null, "Internal server error");
  }
};

// GET /products or /products?category=Apparel
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    if (category && !CATEGORY_ENUM.includes(category)) {
      return sendResponse(
        res,
        400,
        false,
        [],
        `Invalid category. Valid categories: ${CATEGORY_ENUM.join(", ")}`
      );
    }

    const cacheKey = category
      ? `products:category:${category.toLowerCase()}`
      : "products:all";

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return sendResponse(
        res,
        200,
        true,
        JSON.parse(cachedData),
        "Fetched from cache"
      );
    }

    const filter = category ? { category } : {};
    const products = await Product.find(filter);

    if (!products.length) {
      return sendResponse(res, 404, false, [], "No products found");
    }

    await redis.set(cacheKey, JSON.stringify(products), { EX: 60 });
    sendResponse(res, 200, true, products, "Fetched from DB");
  } catch (err) {
    console.error("Error getting products:", err);
    sendResponse(res, 500, false, null, "Internal server error");
  }
};

// GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendResponse(res, 400, false, null, "Invalid product ID");
    }

    const cacheKey = `product:${id}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return sendResponse(
        res,
        200,
        true,
        JSON.parse(cachedData),
        "Fetched from cache"
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, false, null, "Product not found");
    }

    await redis.set(cacheKey, JSON.stringify(product), { EX: 60 });
    sendResponse(res, 200, true, product, "Fetched from DB");
  } catch (err) {
    console.error("Error getting product by ID:", err);
    sendResponse(res, 500, false, null, "Internal server error");
  }
};

// GET /products?category=Apparel
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required in query" });
    }

    const cacheKey = `products:category:${category.toLowerCase()}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await Product.find({ category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    await redis.set(cacheKey, JSON.stringify(products), { EX: 60 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
