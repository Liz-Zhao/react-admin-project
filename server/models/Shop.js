const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
    title:{type:String},
    options:[
        {
            title:{type:String},
            price:{type:Number,default:0},
            checked: {type:Boolean, default:false}
        }
    ]
})

const shopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  subtitle: {
    type: String,
    max: 20,
  },
  description: {
    type: String,
    max: 200,
  },
  shopcates: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "shopcategories",
  },
  coverImage:{
    type:String,
    required:true
  },
  shopImages:{
    type:[String],
    required:true
  },
  price:{
    type: Number,
    required:true,
    default:0.00
  },
  stockNums:{
    type: Number,
    required:true,
    default:1
  },
  status:{
    type:String,
    // 0 未上架（界面不可见）  1 上架（界面可见）  2 暂停销售（界面可见）
    enum:['0','1','2'],  
    default:'0'
  },
  specification:{
    type:[specificationSchema],
    default:()=>([])
  }
},{
  timestamps:true
});

module.exports = mongoose.model("shops", shopSchema);
