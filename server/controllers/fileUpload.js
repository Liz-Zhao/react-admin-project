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

const upload = multer({ storage: storage });

// 上传文件
const uploadFile = (req, res) => {
  try {
    if (!req.file && !req.files) {
      return res.status(400).json({message:"No file uploaded."});
    }
    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "fail", error: error.message || error.toString() });
  }
};

module.exports = { upload, uploadFile };