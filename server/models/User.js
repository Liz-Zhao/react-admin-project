const mongoose = require("mongoose");

const getRandomProfilePicture = `avatar.png`;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    max: 50,
    required: function() {
      return this.type === 'normal'; // 如果是pc登录，邮箱是必需的
    }
  },
  password: {
    type: String,
    required: function() {
      return this.type === 'normal'; // 如果是pc登录，密码是必需的
    }
  },
  avatarImage: {
    type: String,
    default: getRandomProfilePicture,
  },
  openid: {
    type: String,
    required: function() {
      return this.type === 'weixin'; // 如果是微信登录，openid是必需的
    }
  },
  type: {
    type: String,
    enum: ['normal', 'weixin'], // 限制类型只能是这两个值
    default: 'normal'
  }
},{
  timestamps:true
});

module.exports = mongoose.model("users", userSchema);
