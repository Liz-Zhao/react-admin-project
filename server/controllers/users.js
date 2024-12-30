const User = require('../models/User');
const bcrypt = require("bcryptjs");


exports.getUser = async(req,res,next)=>{
    try {
        const {_id:id} = req.user;
        const users = await User.findById(id);
        delete users.password;
        return res.status(200).json({success:true, message:'success', data:users})
    } catch (error) {   
        return res.status(500).json({success:false, message:'error', error: error.message || error.toString()})
    }
}


exports.changeUserField = async(req,res,next)=>{
    try {
        const {_id:id} = req.user;
        const {field,value} = req.body;
        if(!field || !value){
            return res.status(400).json({success:false, message:'参数不能为空'})
        }
        const checkExists = await User.exists({[field]:value});
        if(checkExists){
            return res.status(400).json({success:false, message:'参数已存在'})
        }
        const user = await User.findByIdAndUpdate(id, {[field]:value}, {new:true});
        return res.status(200).json({success:true, message:'success', data:user})
    } catch (error) {
        return res.status(500).json({success:false, message:'error', error: error.message || error.toString()})
    }
}

exports.changePassword = async(req,res,next)=>{
    try {
        const {_id:id} = req.user;
        const {oldPassword,password} = req.body;
        const user = await User.findById(id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:'原密码不正确'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const UpdatedUser = await User.findByIdAndUpdate(id, {password:hashedPassword}, {new:true});
        return res.status(200).json({success:true, message:'success', data:UpdatedUser})
    } catch (error) {
        return res.status(500).json({success:false, message:'error', error: error.message || error.toString()})
    }
}
