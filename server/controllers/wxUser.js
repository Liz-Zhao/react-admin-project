const axios = require("axios");

require("dotenv").config();

const getOpenID = async (code) => {
  try {
    //整合三者
    const appId = process.env.APPID;
    const appSecret = process.env.APPSECRET;

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    const response = await axios.get(url);
    return response.data;
    
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "fail to get wx code",
      error: error.message || error.toString(),
    });
  }
};

module.exports = { getOpenID };
