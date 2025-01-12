const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: { type: String },
  routes: [String],
},{
  timestamps:true
});

module.exports = mongoose.model("roles", roleSchema);
