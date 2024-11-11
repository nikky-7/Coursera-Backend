const mongoose=require("mongoose");
const schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;

const userSchema=new schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
});

const adminSchema=new schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
});

const courseSchema=new schema({
    title:String,
    description:String,
    price:Number,
    imgUrl:String,
    creatorId:ObjectId
});


const purchaseSchema=new schema({
    userId:ObjectId,
    courseId:ObjectId
});

const userModel=mongoose.model("user",userSchema);
const courseModel=mongoose.model("course",courseSchema);
const adminModel=mongoose.model("admin",adminSchema);
const purchaseModel=mongoose.model("purchase",purchaseSchema);

module.exports={

    userModel,
    adminModel,
    courseModel,
    purchaseModel
}
