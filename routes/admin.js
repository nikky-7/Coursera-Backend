const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken")
const { JWT_ADMIN_SECRET } = require("../config");
const { adminAuthMiddleware } = require("../middleware/admin");
const bcrypt = require("bcrypt");
adminRouter.post("/signup", async function (req, res) {

    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    })
    res.json({
        message: "Signup succeeded"
    })
});

adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    });
    if (admin) {
        const isPasswordMatching = await bcrypt.compare(password, admin.password);
        if (isPasswordMatching) {
            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_SECRET);
            res.json({
                token: token
            })
        }
        else {
            res.status(403).json({
                message: "Invalid credentials"
            })
        }
    }

    else {
        res.json({
            message: "Admin user doesnt exist"
        })
    }

})

adminRouter.post("/course",adminAuthMiddleware,async function(req,res){
const adminId=req.userId;
const{title,description,imageUrl,price}=req.body;

const course=await courseModel.create({
    title:title,
    description:description,
    imgUrl:imageUrl,
    price:price,
    creatorId:adminId
})

res.json({
    message:"course created successfully.",
    courseId:course._id
})
})


adminRouter.put("/course",adminAuthMiddleware,async function(req,res){
    const adminId=req.userId;
    const{title,description,imageUrl,price,courseId}=req.body;
    const course=courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },
{
   title:title,
   description:description,
   imgUrl:imageUrl,
   price:price
});

res.json({
    message:"course updated successfully",
    courseId:course._id
})

});

adminRouter.get("/course/bulk",adminAuthMiddleware,async function(req,res){
    const adminId=req.userId;
    console.log("adminid is "+adminId);
    const courses=await courseModel.find({
        creatorId:adminId
    });
console.log("course is"+courses)
    res.json({
        courses:courses
    })
});


module.exports={
    adminRouter
}
