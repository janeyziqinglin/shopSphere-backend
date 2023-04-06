const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { connect } = require("http2");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
// const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
// const path = require("path");

const app = express();



//middleware
//parse incoming request bodies in different formats
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//routes middleware
// mount the userRoute router as middleware at the /api/users endpoint
app.use("/api/users", userRoute);
//productRoute router
app.use("/api/products", productRoute);
//routes
app.get("/", (req,res) => {
    res.send("home page");
});


// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));