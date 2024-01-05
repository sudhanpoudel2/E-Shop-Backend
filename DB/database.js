import mongoose from "mongoose";

const dbConnection = mongoose.connect('mongodb://localhost:27017/e_shop')
.then(()=>{
    console.log("Database connection is ready.....");
})
.catch((error)=>{
    console.log(`Error : ${error}`);
})

export {dbConnection}