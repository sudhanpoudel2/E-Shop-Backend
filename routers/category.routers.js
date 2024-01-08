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

router.get('/:_id',async (req,res)=>{
    const category = await Category.findById(req.params._id);

    if(!category){
        res.status(500).json({message:'The category with given ID does not find'})
    }
    res.send(200).send(category);

})

router.post('/',async (req,res)=>{
    console.log("hello");
    let category = new Category({
        name : req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
     category = await category.save();

    if(!category){
        return res.status(400).send('the category cannot be created');
    }

    res.send(category);
});

router.put('/:_id',async (req,res)=>{
    const categoryUpdate = await Category.findByIdAndUpdate(req.params._id,{
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    });

    if(!categoryUpdate)
    return res.status(400).send('the category can not be created!');

    res.send(categoryUpdate);
})

router.delete('/:_id', async (req, res) => {
    console.log("Received delete request for ID:", req.params._id);

    try {
        const category = await Category.findByIdAndDelete(req.params._id);
        if (category) {
            return res.status(200).json({ success: true, message: 'The category is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'The category is not found' });
        }
    } catch (err) {
        console.error("Error during deletion:", err);
        return res.status(400).json({ success: false, error: err.message });
    }
});


export default router;

