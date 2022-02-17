const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const Order = require("../models/order");
const Product = require("../models/product");

//Get all orders from DB
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find().select("_id product quantity");

    const response = {
      count: orders.length,
      orders: orders.map((order) => {
        return {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${order._id}`,
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

//Add new order to DB
router.post("/", async (req, res, next) => {
  console.log(req.body.productId);
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    } else {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      });

      const newOrder = await order.save();
      logger.info("New order stored: " + newOrder);
      res.status(201).json({
        message: "Order Stored",
        createdOrder: {
          _id: newOrder._id,
          product: newOrder.product,
          quantity: newOrder.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${newOrder._id}`,
        },
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

//Get a single order from DB
router.get("/:orderId", async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId).select("_id product quantity");

  res.status(200).json({
    order: order,
    request: {
      type: "GET",
      url: `http://localhost:3000/orders`,
    },
  });
});

//delete a single order from DB
router.delete("/:orderId", async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const result = await Order.remove({ _id: orderId });
    if (result.n > 0) {
      res.status(200).json({
        message: "Order Deleted",
      });
    } else {
      res.status(404).json({
        message: "Order Not Found",
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
