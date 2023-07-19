import express from "express";
import {
  createCouponCtrl,
  deleteCouponCtrl,
  getAllCoupons,
  getSingleCouponCtrl,
  updateCouponCtrl,
} from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);

couponsRouter.get("/", getAllCoupons);

couponsRouter.get("/single", getSingleCouponCtrl);

couponsRouter.put("/:id", isLoggedIn, isAdmin, updateCouponCtrl);

couponsRouter.delete("/:id", isLoggedIn, isAdmin, deleteCouponCtrl);
export default couponsRouter;
