import express from 'express';
import { Product } from "../models/product.model.js";
import { Category } from '../models/category.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    // yesto garda product ma product name ra image matra show hunchha and id remove hunchha
    const productList = await Product.find().select('name image -_id');
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
});

//Get request for only one product ID use garera
router.get('/:_id',async (req,res)=>{
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

    product = await product.save();

    if(!product)
    return res.status(500).send('The product cannot be created')

    return res.send(product);
    
});

export default router;

