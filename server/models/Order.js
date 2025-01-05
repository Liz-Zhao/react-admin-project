const mongoose = require("mongoose");

const shopListSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops",
  },
  coverImage:{type:String},
  title:{type:String,required:true},
  details:{type:String},
  price:{type:Number,required:true},
  actualPrice:{type:Number, required:true},
  solidNums:{type:Number,required:true},
  totalPrice:{type:Number,required:true}
});

const orderSchema = new mongoose.Schema(
  {
    shops: {type:[shopListSchema],default:()=>([])},
    status:{type:String, 
        // 0 已提交（进行中） 1 已完成  2 已取消
        enum:['0','1','2'],
        default:'0'},
    message: { type: String },
    totalSolidNums:{type:Number},
    totalMoney: { type: Number, required: true },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'users',required:true},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
