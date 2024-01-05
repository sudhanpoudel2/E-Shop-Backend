import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';   
import { dbConnection } from './DB/database.js'; 
import { Product } from './Model/product.model.js'; 

   

const app = express();
const api = process.env.API_URL;

app.use(bodyParser.json()); // Add this line to enable JSON parsing for request bodies
app.use(morgan('tiny'));

// console.log('Received a request to the root endpoint.');
app.get('/api/v1/product*', (req, res) => {
    // Your logic here
    const product = {
        id: 1,
        name: 'Phone',
        image: 'some_URL'
    };
    res.send(product);
});


app.post('/api/v1/product*', (req, res) => {
    const newProduct = new Product({
        name : req.body.name,
        image : req.body.image,
        countInStock : req.body.countInStock
    })

    newProduct.save().then((createProduct =>{
        res.status(201).json(createProduct)
    })).catch((e)=>{
        res.status(500).json(
            {error : e,
            success : false}
        )
    })
});

app.listen(4000 ,()=>{
    // console.log(process.env);
    console.log(`server is running at 4000`);
});