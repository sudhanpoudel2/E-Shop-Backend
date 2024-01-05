import mongoose,{Schema} from "mongoose";

const productSchema = new Schema ({
    name : {
        type : String
    },
    image : {
        type : String
    },
    countInStock : {
        type : Number
    }
},
    {timestamps:true});

    export const Product = mongoose.model("Product",productSchema);