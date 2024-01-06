import express from 'express';
import { Category } from '../models/category.model.js';

const router = express.Router();

router.get('/', async (req, res) => {

    const categoryList = await Category.find() 
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.send(categoryList);
});

export default router;

