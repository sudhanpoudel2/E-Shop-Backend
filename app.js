import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import { dbConnection } from "./DB/database.js";
import productRouter from "./routers/product.routers.js";
import categoryRouter from "./routers/category.routers.js";
import adminRouter from "./routers/admin.routers.js";
import cartRouter from "./routers/cart.routers.js";
import customerRouter from "./routers/customer.router.js";
import awthJwt from "./helper/jwt.js";

// import cors from "cors";
// import errorHandler from "./helper/error.handler.js";
import orderRouter from "./routers/cart.routers.js";

dotenv.config({
  path: "",
});

const app = express();
// const api = process.env.API_URL;

// app.use(cors());
// app.options("*", cors());
// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
// app.use(awthJwt());

//routes
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/order", orderRouter);

// app.use(awthJwt());

app.listen(3000, () => {
  console.log(`Server is running at 3000`);
});
