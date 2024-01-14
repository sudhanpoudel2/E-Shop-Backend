import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';   
import { dbConnection } from './DB/database.js'; 


const app = express();
const api = process.env.API_URL;

import productRouter from './routers/product.routers.js';
import categoryRouter from './routers/category.routers.js';
import userRouter from './routers/user.routers.js'
import awthJwt from './helper/jwt.js';


//middleware
app.use(bodyParser.json()); 
app.use(morgan('tiny')); 
app.use(awthJwt); 

app.use('/api/v1/product',productRouter);
app.use('/api/v1/category',categoryRouter);
app.use('/api/v1/user',userRouter);

// import { Product } from './models/product.model.js'; 

// console.log('Received a request to the root endpoint.');


app.listen(3000 ,()=>{
    // console.log(process.env);
    console.log(`server is running at 3000`);
});