const mongoose = require("mongoose");

const shopListSchema = new mongoose.Schema({
  shopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops",
  },
  shopTitle:{type:String,required:true},
  shopSubtitle:{type:String},
  price:{type:Number,required:true},
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
    actualPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
