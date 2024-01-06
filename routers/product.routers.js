import express from 'express';
import { Product } from "../models/product.model.js";

const router = express.Router();

router.get('/', async (req, res) => {
    // Your logic here
    const productList = await Product.find() 
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
});


router.post('/', (req, res) => {
    console.log("Post is working");
    const product = new Product({
        name : req.body.name,
        image : req.body.image,
        countInStock : req.body.countInStock
    })

    product.save().then((createProduct =>{
        res.status(201).json(createProduct)
    })).catch((e) => {
        res.status(500).json({
            error: e,
            success: false
        });
        return; // Add this line to stop further execution
    });
    
});

export default router;

