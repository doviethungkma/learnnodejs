const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const logger = require("../utils/logger");

//Get all products from DB
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().select("_id name price");
    const response = {
      count: products.length,
      products: products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${product._id}`,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Add new product to DB
router.post("/", async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  try {
    const newProduct = await product.save();
    logger.info("New product created: " + newProduct);
    res.status(200).json({
      message: "Create New Product Successfully",
      createdProduct: {
        _id: newProduct._id,
        name: newProduct.name,
        price: newProduct.price,
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${newProduct._id}`,
        },
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

//Get a single product from DB
router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id).select("_id name price");
    if (product) {
      res.status(200).json({
        product: product,
        request: {
          type: "GET",
          url: `http://localhost:3000/products`,
        },
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
});

//update a single product from DB
router.patch("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Product.updateOne({ _id: id }, { $set: req.body });
    if (product.modifiedCount > 0) {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${id}`,
        },
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

//delete a single product from DB
router.delete("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Product.remove({ _id: id });
    if (product) {
      res.status(200).json({
        message: "Product deleted",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
