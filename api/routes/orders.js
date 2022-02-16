const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "this is Get in Order",
  });
});

router.post("/", (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
    }
  res.status(200).json({
    message: "This is Post in Order",
    order: order,
  });
});

router.get("/:orderId", (req, res, next) => {
    const orderId = req.params.orderId;
    res.status(200).json({
        message: 'This is Order with ID',
        id: orderId
    })
});

router.delete('/:orderId', (req, res, next)=>{
    const orderId = req.params.orderId;
    res.status(200).json({
        message: 'This is Delete Order',
        id: orderId
    })
})

module.exports = router;
