import express from "express";
import { Category } from "../models/category.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      res.status(400).json({ message: "categortList not found", data: {} });
    }
    res.send(categoryList);
  } catch (error) {
    res
      .status(400)
      .json({ Error: error, message: "error occured while finding category" });
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const category = await Category.findById(req.params._id);

    if (!category) {
      res.status(404).json({
        message: "The category with given ID does not find",
        data: {},
      });
    }
    res.send(200).json({ message: "catogory find", data: category });
  } catch (error) {
    res.status(400).json({
      Error: error,
      message: "error occured while finding categort by Id",
    });
  }
});

router.post("/", async (req, res) => {
  console.log("hello");
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();

    if (!category) {
      return res
        .status(406)
        .json({ message: "the category cannot be created", data: {} });
    }

    res.status(200).json({ message: "category created", data: category });
  } catch (error) {
    res
      .status(400)
      .json({ Error: error, message: "error occured while creating category" });
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const categoryUpdate = await Category.findByIdAndUpdate(req.params._id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    if (!categoryUpdate)
      return res
        .status(406)
        .json({ message: "the category can not be created!", data: {} });

    res
      .status(200)
      .json({ message: "updated successfully", data: categoryUpdate });
  } catch (error) {
    res
      .status(400)
      .json({ Error: error, message: "error occured while updating" });
  }
});

router.delete("/:_id", async (req, res) => {
  console.log("Received delete request for ID:", req.params._id);

  try {
    const category = await Category.findByIdAndDelete(req.params._id);
    if (category) {
      return res
        .status(200)
        .json({ data: category, message: "The category is deleted!" });
    } else {
      return res
        .status(404)
        .json({ data: {}, message: "The category is not found" });
    }
  } catch (err) {
    // console.error("Error during deletion:", err);
    return res
      .status(400)
      .json({ Error: err, message: "error occured while deleted category" });
  }
});

export default router;
