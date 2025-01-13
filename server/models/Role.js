const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: { type: String },
  description:{ type: String },
  routes: [String],
  permissions:[{
    title:{ type: String },
    route:{ type: String,default:null },
    checked:{type:Boolean, default:false},
    children:[{
      title:{ type: String },
      route:{ type: String,default: null },
      checked:{type:Boolean, default:false},
    }]
  }]
},{
  timestamps:true
});

module.exports = mongoose.model("roles", roleSchema);
