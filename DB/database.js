import mongoose from "mongoose";

const dbConnection = mongoose.connect('mongodb://127.0.0.1:27017/e_shop')
.then(()=>{
    console.log("Database connection is ready.....");
})
.catch((error)=>{
    console.log(`Error : ${error}`);
})

export {dbConnection}