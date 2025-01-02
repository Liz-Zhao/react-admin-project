const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { getOpenID } = require("./wxUser");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check username
    let usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res
        .status(403)
        .json({ message: "Username already used", success: false });
    }
    // check email
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res
        .status(403)
        .json({ message: "Email already used", success: false });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create new user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      type: "normal",
    });
    delete newUser._doc.password;

    return res
      .status(200)
      .json({ success: true, message: "success", data: newUser.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on siginup.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check username
    const user = await User.findOne({ username, type: "normal" });
    if (!user) {
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password", success: false });
    }
    // compare password with inputed password
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(403)
        .json({ message: "Incorrect Username or Password", success: false });
    }
    delete user._doc.password;
    // get token
    const token = jwt.sign({ data: user }, process.env.SECRET_ACCESS_KEY);
    return res.status(200).json({
      success: true,
      message: "success",
      data: { token, ...user.toObject() },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on login.",
    });
  }
};

exports.isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token access!" });
    }
    // 解析 token
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, error: "Access token is invalid" });
      }
      req.user = decoded.data;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on token is wrong.",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { code, username } = req.body;

    // 测试环境代码
    if (code == "the code is a mock one") {
      let user = await User.findOne({
        username: username,
        type: "weixin",
      });
      if (user) {
        const token = jwt.sign({ data: user }, process.env.SECRET_ACCESS_KEY);
        return res.status(200).json({
          success: true,
          data: {
            token: token,
            ...user.toObject(),
          },
        });
      } else {
        let savedUser = await User.create({
          username: username,
          openid: "the openid is a mock one",
          type: "weixin",
        });
        // generate token
        const token = jwt.sign(
          { data: savedUser },
          process.env.SECRET_ACCESS_KEY
        );
        return res.status(200).json({
          success: true,
          data: {
            token: token,
            ...savedUser.toObject(),
          },
        });
      }
    } else {
      // 正式环境代码
      // 获取wx code
      const Open_data = await getOpenID(code);

      // 失败，报错
      if (Open_data.errcode) {
        return res.status(404).json({ success: false, message: "code ID is error" });
      }

      // 数据库查询唯一 openid, 如果找到则已注册
      let user = await User.findOne({ openid: Open_data.openid });

      let savedUser;
      // 注册用户
      if (!user) {
        savedUser = await User.create({
          openid: Open_data.openid,
          // 自定义用户名称
          username:
            username || "user_" + Math.random().toString(36).substring(2, 15),
          type: "weixin",
        });
      } else {
        savedUser = user;
      }

      const token = jwt.sign(
        { data: savedUser },
        process.env.SECRET_ACCESS_KEY
      );
      return res.status(200).json({
        success: true,
        data: {
          token,
          ...savedUser.toObject(),
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on token is wrong.",
    });
  }
};
