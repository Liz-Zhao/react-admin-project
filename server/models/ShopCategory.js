const mongoose = require("mongoose");

const shopCateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  description: {
    type: String,
    max: 100,
  },
  status:{
    type:String,
    // 0 未启用  1 启用
    enum:['0','1'],  
    default:'0'
  }
},{
  timestamps:true
});

module.exports = mongoose.model("shopcategories", shopCateSchema);
