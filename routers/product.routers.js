import express from "express";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import multer from "multer";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError: null;
    }
    cb(uploadError, "public/upload");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("_");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOption = multer({ storage: storage });

const router = express.Router();
import mongoose from "mongoose";

router.get("/pag", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const search = req.query.search || "";
    // let sort = req.query.sort || "rating";
    // let genre = req.query.genre || "All";

    const productShow = await Product.find({
      $or: [
        // { category: { $regex: category, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.find({
      $or: [
        // { category: { $regex: category, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    }).countDocuments();

    res.send({
      product: productShow,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  // yesto garda product ma product name ra image matra show hunchha and id remove hunchha
  try {
    const productList = await Product.find();
    if (!productList) {
      res.status(400).json({ message: "productList can not found", data: {} });
    }
    res
      .status(200)
      .json({ message: "productList found successfully", data: productList });
  } catch (error) {
    res
      .status(400)
      .json({ message: "error occur while finding productList", Error: error });
  }
});

router.get(":_id", (req, res) => {
  const productID = Product.findById(req.params._id);
  if (!productID) {
    res.status(400).json({ message: "productId required", data: {} });
  }

  res.status(200).json({ message: "find sucessfully", data: productID });
});

//Get request for only one product ID use garera
router.get("/get/count", async (req, res) => {
  console.log("hello am i working?");
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ message: "product count", data: productCount });
  } catch (error) {
    // console.error("Error getting product count:", error);
    res
      .status(400)
      .json({ message: "error occured while product count", Error: error });
  }
});

router.get("/get/featured/:count", async (req, res) => {
  console.log("hello am i working?");
  const count = req.params.count ? req.params.count : 0;
  try {
    const product = await Product.find({ isFeatured: true }).limit(+count); // count value url ma jati deko chha teti matra product dekhaunchha
    res
      .status(200)
      .json({ message: "feature count successfully", data: product }); // res.send({ product });
  } catch (error) {
    // console.error("Error getting product count:", error);
    res
      .status(400)
      .json({ Error: error, message: "Error occured while feature counts" });
  }
});

router.post("/", uploadOption.single("image"), async (req, res) => {
  console.log("Post is working");

  //catetory ID bata (category aanushar product add garne) product add garne
  const category = await Category.findById(req.body.category);
  if (!category)
    return res.status(404).json({ message: "Invalid Category", data: {} });

  // const file = req.file;
  // if(!file) return res.status(404).send('No image in request');

  // const fileName = req.body.filename;
  // const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  try {
    const productSave = await product.save();
    return res
      .status(201)
      .json({ message: "product created successfully", data: productSave });
  } catch (error) {
    // console.error("Error saving the product:", error);
    return res
      .status(406)
      .json({ Error: error, message: "The product cannot be created" });
  }
});

router.put("/:_id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params._id)) {
    return res.status(405).json({ message: "Invalid Product Id" });
  }
  const productUpdate = await Product.findByIdAndUpdate(req.params._id, {
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  if (!productUpdate)
    return res
      .status(406)
      .json({ message: "the product can not be created!", data: {} });

  res
    .status(200)
    .json({ message: "product update successfully", data: productUpdate });
});

router.delete("/:_id", async (req, res) => {
  console.log("Received delete request for ID:", req.params._id);

  try {
    const product = await Product.findByIdAndDelete(req.params._id);
    if (product) {
      return res
        .status(200)
        .json({ data: product, message: "The product is deleted!" });
    } else {
      return res
        .status(404)
        .json({ data: {}, message: "The product is not found" });
    }
  } catch (err) {
    // console.error("Error during deletion:", err);
    return res
      .status(400)
      .json({ Error: err, message: "error occured while deleting product" });
  }
});

router.put(
  "/gallery-image/:_id",
  uploadOption.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params._id)) {
      return res.status(406).json({ message: "Invalid Product Id" });
    }

    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.fileName}`);
      });
    }
    const productUpdate = await Product.findByIdAndUpdate(req.params._id, {
      images: imagePaths,
    });
    if (!productUpdate)
      return res
        .status(400)
        .json({ message: "the product can not be created!", data: {} });

    res
      .status(200)
      .json({ message: "product update successfully", data: productUpdate });
  }
);

export default router;
