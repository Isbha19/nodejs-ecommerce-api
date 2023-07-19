import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

//@desc Create new order
//@route POST/api/v1/orders
//@access Private
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get the coupon
  // const { coupon } = req?.query;

  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });
  // if (couponFound?.isExpired) {
  //   throw new Error("coupon has expired");
  // }
  // if (!couponFound) {
  //   throw new Error("Coupon doesn't exist");
  // }
  //get the discount
  // const discount = couponFound?.discount / 100;
  // Get the payload (customer(user), orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // Find the user
  const user = await User.findById(req.userAuthId);
  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  // Check if order is not empty
  if (!orderItems || orderItems.length === 0) {
    throw new Error("No order items");
  }

  // Place/create order & save into DB
  const order = await Order.create({
    user: user.id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });
  console.log(order);

  // Update the product qty and qty sold
  const products = await Product.find({
    _id: {
      $in: orderItems,
    },
  });

  orderItems.map(async (item) => {
    const product = products.find((prod) => {
      return prod._id.toString() === item._id.toString();
    });

    if (product) {
      product.totalSold += item.qty;
      await product.save();
    }
  });

  // Push order into user
  user.orders.push(order._id);
  await user.save();

  // Make payment (stripe)
  //convert order items to have the same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
});

//@desc get all orders
//@route POST/api/v1/orders
//@access Private

export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single orders
//@route POST/api/v1/orders/:id
//@access Private

export const getSingleOrdersCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //find single order
  const order = await Order.findById(id);
  res.json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT/api/v1/orders/:id
//@access Private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route POST/api/v1/orders/sales/sum
//@access Private/admin

export const getOrderStatisticsCtrl = asyncHandler(async (req, res) => {
  //get order statistics
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSales: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSalesToday: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send the response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
