// Register User
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");


// Generate Token with id
//use token in dotenv file
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }); //toekn last for 1day
  };

//register user
const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
      }
    //check pw length 
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
      }
      
    //check if email already exist
    const userExists = await User.findOne({ email });
    if (userExists){
        res.status(400);
        throw new Error("Email has already been registered.")
    }

    //remember to hash password before create new user 
    const user = await User.create({
        name,
        email,
        password,
     });

    //   Generate Token
    const token = generateToken(user._id);

    //send http-only cookie 
    res.cookie("token", token,{
        path:"/", //cookie will be accessible from any page on the website.
        httpOnly: true, //flags the cookie to be only used by the web server.
        expires:new Date(Date.now()+1000 * 86400), //1 day
        sameSite: "none", //enables cross-site cookie sharing. frontend and backend on dif URL
        secure: true,
    })

    if (user){
        const {_id,name,email,photo,phone,bio,} = user
        res.status(201).json({
            _id,name,email,photo,phone,bio,token,
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data.")
    }

});

//login user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    //validate request
    if (!email || !password){
        res.status(400);
        throw new Error("Please add email and password");
    }
    //check if user exists
    const user = await User.findOne({email})
    if (!user){
        res.status(400);
        throw new Error("User not found, please sign up!");
    }
    //user exists, check if pw is correct
    const passwordIsCorrect=await bcrypt.compare(password,user.password)


    //   Generate Token
    const token = generateToken(user._id);

    //send http-only cookie 
    if(passwordIsCorrect){
        res.cookie("token", token,{
            path:"/", //cookie will be accessible from any page on the website.
            httpOnly: true, //flags the cookie to be only used by the web server.
            expires:new Date(Date.now()+1000 * 86400), //1 day
            sameSite: "none", //enables cross-site cookie sharing. frontend and backend on dif URL
            secure: true,
        });
    }


    if (user && passwordIsCorrect){
        const {_id,name,email,photo,phone,bio,} = user
        res.status(201).json({
            _id,name,email,photo,phone,bio,token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password")
    }
  });


  //login user
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "",{
        path:"/", 
        httpOnly: true, 
        expires:new Date(0), //expire the cookie
        sameSite: "none",
        secure: true,
    });
    return res.status(200).json({message: "successful logout"})
});

module.exports = {registerUser,loginUser,logout,};