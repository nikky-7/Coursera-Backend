require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const{userRouter}=require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const app = express();

app.use(express.json());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

async function main() {
    console.log(process.env.MONGO_URL);
    await mongoose.connect("mongodb+srv://nikhilblissfulvibes:8wJNppOUSFMLe7l6@cluster-task.dnsur.mongodb.net/coursera-db");
    app.listen(3000);
    console.log("listening port 3000");
}

main();