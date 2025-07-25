const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const { productValidation } = require("../validators/product.validator");

router.post("/", validate(productValidation), ctrl.createProduct);
router.get("/", ctrl.getAllProducts);
router.get("/:id", ctrl.getProductById);
router.get("/product_by_category", ctrl.getProductsByCategory);

module.exports = router;
