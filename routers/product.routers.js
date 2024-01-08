import express from 'express';
import { Product } from "../models/product.model.js";
import { Category } from '../models/category.model.js';

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

//Get request for only one product ID use garera
router.get('/:_id',async (req,res)=>{

    console.log('hello am i working?');
    const productFind = await Product.findById(req.params._id);

    if(!productFind){
        res.status(404).json({success:false})
    }
    
    res.send(productFind);
})


router.post('/', async (req, res) => {
    console.log("Post is working");

    //catetory ID bata (category aanushar product add garne) product add garne
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(404).send('Invalid Category');

    const product = new Product({
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
    })
    const productSave = await product.save();

    if (!productSave) {
      console.error('Error saving the product:', productSave);
      return res.status(500).send('The product cannot be created');
    }
    
    return res.send(productSave);
    
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

