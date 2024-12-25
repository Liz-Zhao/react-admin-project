const ShopCategory = require("../models/ShopCategory")
const ApiFeature = require('../utils/apiFeature')

exports.addShopcate = async(req,res)=>{
    try {
        const {title, description} = req.body;

        if(!title || !description){
            return res.status(403).json({success:false, message:'title and description is required!'})
        }

        const newItem= await ShopCategory.create({title, description});
        return res.status(200).json({success:true,message:'success', data:newItem.toObject()})

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on add shopcate.",
          });
    }
}

exports.removeShopcate = async(req,res)=>{
    try {
        const {id} =req.body;
        await ShopCategory.findByIdAndDelete(id)
        return res.status(200).json({success:true,message:'success'})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on remove shopcate.",
          });
    }
}

exports.getShopcates = async(req,res)=>{
    try {
        const apiFeature = new ApiFeature(ShopCategory.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .pagination();      
        
        const items = await apiFeature.query;
        return res.status(200).json({success:true,message:'success',data:items})

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on get shopcates.",
          });
    }
}

exports.updateShopcate = async(req,res)=>{
    try {
        const {id, title, description} = req.body;
        const updateItem = await ShopCategory.findByIdAndUpdate(id, {title, description},{new:true})
        if(!updateItem){
            return res.status(403).json({success:false,message:'该对象不存在'})
        }

        return res.status(200).json({success:true,message:'success',data:updateItem})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on update shopcate.",
          });
    }
}