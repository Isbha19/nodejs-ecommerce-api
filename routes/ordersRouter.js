import express from "express";
import {
  createOrderCtrl,
  getAllOrdersCtrl,
  getOrderStatisticsCtrl,
  getSingleOrdersCtrl,
  updateOrderCtrl,
} from "../controllers/orderCtrl.js";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
const orderRouter = express.Router();
orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllOrdersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrdersCtrl);
orderRouter.put("/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatisticsCtrl);

export default orderRouter;
