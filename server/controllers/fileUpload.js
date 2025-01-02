// multer.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFilePath = path.join(__dirname, "../public/images/");

// 如果路径不存在，则创建
if (!fs.existsSync(uploadFilePath)) {
  fs.mkdirSync(uploadFilePath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFilePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.upload = multer({ storage: storage });

// 上传文件
exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message:"No file uploaded."});
    }
    return res.status(200).json({
      success:true,
      message: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success:false, message: "fail", error: error.message || error.toString() });
  }
};

// 上传文件
exports.uploadFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({message:"No file uploaded."});
    }
    return res.status(200).json({
      success:true,
      message: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success:false, message: "fail", error: error.message || error.toString() });
  }
};