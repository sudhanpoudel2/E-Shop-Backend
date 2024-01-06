import mongoose,{Schema} from "mongoose";

const productSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    richDescription : {
        type : String,
        default : ''
    },
    image : {
        type : String,
        default : ''
    },
    images : [{
        type : String
    }],
    brand : {
        type : String,
        default : ''
    },
    price : {
        type : Number,
        default : 0
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    countInStock : {
        type : Number,
        required : true,
        min : 0,
        max : 100
    },
    rating : {
        type : Number,
        default : 0
    },
    isFeatured : {
        type : Boolean,
        default : false    
    },
    numReviews : {
        type :Number,
        default : 0
    },
    dateCreated : {
        type : Date,
        default : Date.now
    }
},
    {timestamps:true});

    export const Product = mongoose.model("Product",productSchema);