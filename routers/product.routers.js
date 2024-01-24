import express from 'express';
import { Product } from "../models/product.model.js";
import { Category } from '../models/category.model.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('_') 
      cb(null,fileName + '-' + Date.now())
    }
  })
  
  const uploadOption = multer({ storage: storage })


const router = express.Router();
import mongoose from 'mongoose';

router.get('/', async (req, res) => {
    // yesto garda product ma product name ra image matra show hunchha and id remove hunchha
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
});

router.get(':_id',(req,res)=>{
    const productID = Product.findById(req.params._id)
    if(!productID){
        res.status(500).json({success:false})
    }

    res.send(productID);
})

//Get request for only one product ID use garera
router.get('/get/count',async (req,res)=>{

    console.log('hello am i working?');
    try {
        const productCount = await Product.countDocuments();
        res.send({ productCount });
    } catch (error) {
        console.error('Error getting product count:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    
});

router.get('/get/featured/:count',async (req,res)=>{

    console.log('hello am i working?');
    const count =req.params.count ? req.params.count : 0
    try {
        const product = await Product.find({isFeatured : true}).limit(+count) // count value url ma jati deko chha teti matra product dekhaunchha
        res.send({ product });
    } catch (error) {
        console.error('Error getting product count:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    
});


router.post('/',uploadOption.single('image'), async (req, res) => {
    console.log("Post is working");

    //catetory ID bata (category aanushar product add garne) product add garne
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(404).send('Invalid Category');
    const fileName = req.body.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    const product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${fileName}`,
        brand : req.body.brand,
        price : req.body.price,
        category : category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,
    })
    try {
        const productSave = await product.save();
        return res.status(201).json({ success: true, product: productSave });
    } catch (error) {
        console.error('Error saving the product:', error);
        return res.status(500).json({ success: false, error: 'The product cannot be created' });
    }    
    
});

router.put('/:_id',async (req,res)=>{

    if(!mongoose.isValidObjectId(req.params._id)){
         return res.status(500).send('Invalid Product Id');
    }
    const productUpdate = await Product.findByIdAndUpdate(req.params._id,{
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,
    });

    if(!productUpdate)
    return res.status(400).send('the product can not be created!');

    res.send(productUpdate);
});

router.delete('/:_id', async (req, res) => {
    console.log("Received delete request for ID:", req.params._id);

    try {
        const product = await Product.findByIdAndDelete(req.params._id);
        if (product) {
            return res.status(200).json({ success: true, message: 'The product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'The product is not found' });
        }
    } catch (err) {
        console.error("Error during deletion:", err);
        return res.status(400).json({ success: false, error: err.message });
    }
});


export default router;

