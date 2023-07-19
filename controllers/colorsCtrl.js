import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

//@desc Create new color
//@route POST/api/v1/colors
//@access Private/Admin

export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //check if color exist
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("color already exist");
  }
  //create
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "color created successfully",
    color,
  });
});

//@desc Get all colors
//@route GET/api/v1/colors
//@access Public

export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.json({
    status: "success",
    message: "All colors",
    colors,
  });
});

//@desc Get single color
//@route GET/api/v1/colors/:id
//@access Private/Admin

export const getSingleColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  res.json({
    status: "success",
    message: "color fetched successfully",
    color,
  });
});

//@desc Update color
//@route PUT/api/v1/colors/:id
//@access Private/Admin

export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(
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
    message: "color updated successfully",
    color,
  });
});

//@desc delete color
//@route DELETE/api/v1/colors/:id
//@access Private/Admin

export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "color deleted successfully",
  });
});
