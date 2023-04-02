const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { connect } = require("http2");
const userRoute = require("./routes/userRoute");
// const productRoute = require("./routes/productRoute");
// const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
// const cookieParser = require("cookie-parser");
// const path = require("path");

const app = express()

const PORT = process.env.PORT || 5000;

//middleware
//parse incoming request bodies in different formats
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())


//routes middleware
// mount the userRoute router as middleware at the /api/users endpoint
app.use("/api/users", userRoute)

//routes
app.get("/", (req,res) => {
    res.send("home page");
});


//error middleware
app.use(errorHandler);

//connect to mongoDB start server
mongoose
    .connect(process.env.MONGO_URI)
    .then( () => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`);
        })
    })
    .catch((error) => console.log(error));