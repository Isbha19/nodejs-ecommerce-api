import express from "express";
import {
  createProductCtrl,
  deleteProductCtrl,
  getProductsCtrl,
  getSingleProduct,
  updateProductCtrl,
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productsRoutes = express.Router();

productsRoutes.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProductCtrl
);
productsRoutes.get("/", getProductsCtrl);
productsRoutes.get("/:id", getSingleProduct);
productsRoutes.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRoutes.delete("/:id", isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRoutes;
