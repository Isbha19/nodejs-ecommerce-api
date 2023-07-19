import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";

//@desc Create new coupon
//@route POST/api/v1/coupons
//@access Private/Admin
export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  console.log(req.body);

  //check if admin
  //check if coupon already exists
  const couponExist = await Coupon.findOne({
    code,
  });
  if (couponExist) {
    throw new Error("Coupon already exists");
  }
  //check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount Value must be a number");
  }
  //create a coupon
  const coupon = await Coupon.create({
    code: code,
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  console.log(coupon);
  //send the response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

//@desc Get all coupons
//@route POST/api/v1/coupons
//@access Private/Admin

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  //send the response
  res.status(201).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

//@desc Get single coupon
//@route POST/api/v1/coupons/:id
//@access Private/Admin

export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });
  //check if is not found
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  //check if expired
  if (coupon.isExpired) {
    throw new Error("Coupon expired");
  }

  res.json({
    status: "success",
    message: "coupon fetched",
    coupon,
  });
});

export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
  });
});
