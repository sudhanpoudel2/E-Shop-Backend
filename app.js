import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';   
import { dbConnection } from './DB/database.js'; 


const app = express();
const api = process.env.API_URL;

app.use(bodyParser.json()); // Add this line to enable JSON parsing for request bodies
app.use(morgan('tiny'));  

import { Product } from './models/product.model.js'; 

// console.log('Received a request to the root endpoint.');
app.get('/api/v1/product*', async (req, res) => {
    // Your logic here
    const productList = await Product.find() 
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
});


app.post('/api/v1/product*', (req, res) => {
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

app.listen(4000 ,()=>{
    // console.log(process.env);
    console.log(`server is running at 4000`);
});