import express from 'express';
import { Order } from '../models/order.model.js';

const router = express.Router();

router.get('/',async (req,res)=>{
    const orderList =await Order.find();

    if(!orderList){
        return res.status(500).json({success:false})
    }
    res.send(orderList);

})

router.post('/',async (req,res)=>{
    console.log("hello");
    let order = new Order({
        orderItem:req.body.orderItem,
        shippingAdderss:req.body.shippingAdderss,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:req.body.totalPrice,
        user:req.body.user,
    });
     order = await order.save();

    if(!order){
        return res.status(400).send('the order cannot be created');
    }

    res.send(category);
});

export default router;