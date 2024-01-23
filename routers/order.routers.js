import express from 'express';
import { Order } from '../models/order.model.js';
import { OrderItem } from '../models/orderItem.model.js';

const router = express.Router();

router.get('/',async (req,res)=>{
    const orderList =await Order.find().populate('user','name').sort('dateOrder');//when i do populate name only i get user name only

    if(!orderList){
        return res.status(500).json({success:false})
    }
    res.send(orderList);

})

router.post('/', async (req, res) => {
    // console.log("hello");
    const orderItemIds = await Promise.all(req.body.orderItem.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            product: orderItem.product,
            quantity: orderItem.quantity
        });
        newOrderItem = await newOrderItem.save();
    
        return newOrderItem._id;
    }));
    

    const order = new Order({
        orderItem: orderItemIds,
        shippingAdderss: req.body.shippingAdderss,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    });

    const orderSave = await order.save();

    if (!orderSave) {
        return res.status(400).send('The order cannot be created');
    }

    res.send(orderSave);
});

router.put('/:_id',async (req,res)=>{
    const order = await Order.findByIdAndUpdate(req.params._id,{
        status:req.body.status
    });

    if(!order)
    return res.status(400).send('the order can not be created!');

    res.send(order);
})

router.delete('/:_id', async (req, res) => {
    Order.findByIdAndDelete(req.params._id).then(async order =>{
        if(order){
            await order.orderItem.map(async orderItem =>{
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({success:true,message:"the orderItem was deleted!"});
        }else{
            return res.status(404).json({success:false,message:"order is not deleted"})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })

})
    // console.log("Received delete request for ID:", req.params._id);

 


export default router;