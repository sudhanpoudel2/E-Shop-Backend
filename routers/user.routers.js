import express from 'express';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/',async(req,res)=>{
    const userList = await User.find().select('-passwordHash');//password na dekhauna 

    if(!userList){
         res.status(500).json({success:false})
    }
     res.send(userList);
});

router.get('/:_id',async (req,res)=>{
    const user = await User.findById(req.params._id).select('-passwordHash');
    try {
        res.send(user);
    } catch (error) {
        return res.status(500).send({success:false,error:'user is not created'})
    }
})

router.post('/',async(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        color:req.body.color,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    })
    try {
        const userSave = await user.save();
        return res.status(201).json({ success: true, user: userSave });
    } catch (error) {
        console.error('Error saving the product:', error);
        return res.status(500).json({ success: false, error: 'User cannot be created' });
    }  
    
})

export default router;