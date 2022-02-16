const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handle GET requests to /products",
  });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };

  console.log(product);
  res.status(200).json({
    message: "Handle POST requests to /products",
    createdProduct: product,
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "You discovered the special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
      id: id,
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Handle PATCH requests to /products",
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Handle DELETE requests to /products",
  });
});

module.exports = router;
