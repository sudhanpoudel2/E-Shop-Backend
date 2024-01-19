import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { dbConnection } from './DB/database.js';
import productRouter from './routers/product.routers.js';
import categoryRouter from './routers/category.routers.js';
import userRouter from './routers/user.routers.js';
import awthJwt from './helper/jwt.js';
import errorHandler from './helper/error.handler.js';
import orderRouter from './routers/order.routers.js';

const app = express();
const api = process.env.API_URL;

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/api/v1/product', productRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/order', orderRouter);

app.use(awthJwt());
app.use(errorHandler);

app.listen(3000, () => {
    console.log(`Server is running at 3000`);
});
