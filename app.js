import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';   
import { dbConnection } from './DB/database.js'; 


const app = express();
const api = process.env.API_URL;

import productRouter from './routers/product.routers.js';
import categoryRouter from './routers/category.routers.js';


//middleware
app.use(bodyParser.json()); 
app.use(morgan('tiny'));  

app.use('/api/v1/product*',productRouter);
app.use('/api/v1/category*',categoryRouter);

// import { Product } from './models/product.model.js'; 

// console.log('Received a request to the root endpoint.');


app.listen(4000 ,()=>{
    // console.log(process.env);
    console.log(`server is running at 4000`);
});