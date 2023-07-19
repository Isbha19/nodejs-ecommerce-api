import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

//@desc Create new category
//@route POST/api/v1/categories
//@access Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //check if category exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exist");
  }
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });
  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

//@desc Get all categories
//@route GET/api/v1/categories
//@access Public

export const getAllCategoryCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: "success",
    message: "All categories",
    categories,
  });
});

//@desc Get single category
//@route GET/api/v1/categories/:id
//@access Private/Admin

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({
    status: "success",
    message: "Category fetched successfully",
    category,
  });
});

//@desc Update category
//@route PUT/api/v1/categories
//@access Private/Admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Category updated successfully",
    category,
  });
});

//@desc Delete category
//@route DELETE/api/v1/categories
//@access Private/Admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category deleted successfully",
  });
});
