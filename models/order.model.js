import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    orderItem :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "orderItem",
        required : true
    }],
    shippingAdderss:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    totalPrice:{
        type:Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    dateOrder:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals:true,
});

export const Order = mongoose.model("Order",orderSchema);