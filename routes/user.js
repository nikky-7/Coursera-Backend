const { Router } = require("express");
const { userModel, courseModel, adminModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");
const { userAuthMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt");


const userRouter = Router();
const saltRounds = 5;


userRouter.post("/signup", async function (req, res) {

    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });

    res.json({
        message: "Signup success"
    });

});


userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    });
    if (user) {

        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (isPasswordMatching) {
            const token = jwt.sign({
                id: user._id.toString()
            }, JWT_USER_SECRET);
            res.json({
                message: "Token: " + token
            });
        }
        else {
            res.status(403).json({
                message: "Incorrect credentials"
            })
        }
    }
    else {
        res.status(403).json({
            message: "No user exists"
        })
    }
});


userRouter.get("/purchases",userAuthMiddleware,async function(req,res){
    const userId=req.userId;
  
    const purchases= await purchaseModel.find({
        userId:userId
    });
    console.log("purchases is :"+purchases)
    if(purchases){
    const userCourses=await courseModel.find({
        _id:{ $in: purchases.map(x=>x.courseId) }  
    })
    res.json({
        purchases:purchases,
        userCourses:userCourses
    });
}
else{
    res.json({
       message:"No purchases for the user"
    });
}

})
module.exports = {
    userRouter
}



