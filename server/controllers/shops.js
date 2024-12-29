const ShopCategory = require("../models/ShopCategory")
const Shop = require("../models/Shop")
const ApiFeature = require('../utils/apiFeature')

exports.addShopcate = async(req,res)=>{
    try {
        const {title, description,status} = req.body;

        if(!title){
            return res.status(403).json({success:false, message:'title is required!'})
        }
        if(!(status in ['0','1'])){
            return res.status(403).json({success:false,message:'状态错误'})
        }

        const newItem= await ShopCategory.create({title, description,status});
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
        const {id} =req.params;
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

        const apiFeature_total = new ApiFeature(ShopCategory.find(), req.query).filter();
        
        const items = await apiFeature.query;
        const totalsQueryString = await apiFeature_total.queryString;
        const totals = await ShopCategory.countDocuments(JSON.stringify(totalsQueryString))


        return res.status(200).json({success:true,message:'success',data:{totals,data:items}})

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
        const {id, title, description,status} = req.body;
        if(!(status in ['0','1'])){
            return res.status(403).json({success:false,message:'状态错误'})
        }
        const updateItem = await ShopCategory.findByIdAndUpdate(id, {title, description,status},{new:true})
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


// shop
exports.addShop = async(req,res)=>{
    try {
        const {title,subtitle, description,shopcates,
            coverImage,shopImages,price,
            stockNums,specification} = req.body;

        if(!title || !shopcates || !coverImage || !shopImages){
            return res.status(403).json({success:false, message:'缺少必填项, 如商品图片、商品展示图'})
        }

        const newItem= await Shop.create({title,subtitle, description,shopcates,
            coverImage,shopImages,price,
            stockNums,specification});
        return res.status(200).json({success:true,message:'success', data:newItem.toObject()})

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on add shop.",
          });
    }
}

exports.removeShop = async(req,res)=>{
    try {
        const {id} =req.params;
        // check status
        const item = await Shop.findOne({_id:id,status:'0'});
        if(!item){
            return res.status(403).json({success:false, message:'无法删除，非下架状态！'})
        }
        await Shop.findByIdAndDelete(id);
        return res.status(200).json({success:true,message:'success'})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on remove shop.",
          });
    }
}

exports.getShops = async(req,res)=>{
    try {
        const apiFeature = new ApiFeature(Shop.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .pagination();      
        
        const apiFeature_total = new ApiFeature(Shop.find(), req.query).filter();

        const items = await apiFeature.query.populate('shopcates','title');
        const totalsQueryString = await apiFeature_total.queryString;
        const totals = await Shop.countDocuments(JSON.stringify(totalsQueryString))

        return res.status(200).json({success:true,message:'success',data:{totals,data:items}})

    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on get shops.",
          });
    }
}

exports.updateShop = async(req,res)=>{
    try {
        const {_id:id, title,subtitle, description,shopcates,
            coverImage,shopImages,price,
            stockNums,specification} = req.body;

        const updateItem = await Shop.findByIdAndUpdate(id, {title,subtitle, description,shopcates,
            coverImage,shopImages,price,stockNums,specification},{new:true})

        if(!updateItem){
            return res.status(403).json({success:false,message:'该对象不存在'})
        }

        return res.status(200).json({success:true,message:'success',data:updateItem})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on update shop.",
          });
    }
}

exports.getShop = async(req,res)=>{
    try {
        const {id} = req.params;
        const updateItem = await Shop.findById(id)
        if(!updateItem){
            return res.status(403).json({success:false,message:'该对象不存在'})
        }

        return res.status(200).json({success:true,message:'success',data:updateItem})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on get shop.",
          });
    }
}

exports.updateShopStatus = async(req,res)=>{
    try {
        const {id,status} = req.body;
        //check status
        if(!(status in ['0','1','2'])){
            return res.status(403).json({success:false,message:'状态错误'})
        }
        const updateItem = await Shop.findByIdAndUpdate(id, {status},{new:true})
        if(!updateItem){
            return res.status(403).json({success:false,message:'该对象不存在'})
        }

        return res.status(200).json({success:true,message:'success',data:updateItem})
    } catch (error) {
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message: "There was an error on update shop status.",
          });
    }
}