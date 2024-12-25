const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

require('dotenv').config()


exports.signup = async (req,res)=>{
    try{
        const {username, email, password} = req.body;
        // check username
        let usernameCheck = await User.findOne({username});
        if(usernameCheck){
            return res.status(403).json({message:"Username already used", success:false})
        }
        // check email
        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.status(403).json({message:"Email already used", success:false})
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10);
        // create new user
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
        })
        delete newUser._doc.password;

        return res.status(200).json({success:true,message:'success', data:newUser.toObject()})

    }catch(error){
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on siginup.",
          });
    }
}

exports.login = async (req,res)=>{
    try {
        const {username, password} = req.body;
        // check username
        const user = await User.findOne({username});
        if(!user){
            return res.status(403).json({message:"Incorrect Username or Password", success:false})
        }
        // compare password with inputed password
        const passwordCheck = await bcrypt.compare(password, user.password)
        if(!passwordCheck){
            return res.status(403).json({message:"Incorrect Username or Password", success:false})
        }
        delete user._doc.password;
        // get token
        const token= jwt.sign({data:user},process.env.SECRET_ACCESS_KEY);
        return res.status(200).json({success:true,message:'success', data:{token, ...user.toObject()}})

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on login.",
          });
    }
}


exports.isAuth = async(req,res,next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({success:false, message:"No token access!"})
        }
        // 解析 token
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
            if (err) {
              return res.status(403).json({ success:false,error: "Access token is invalid" });
            }
            req.user = decoded.data;
            next();
          });
        

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on token is wrong.",
        });
    }
}