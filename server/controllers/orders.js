const Order = require("../models/Order");
const Shop = require("../models/Shop");
const ApiFeature = require("../utils/apiFeature");

function financial(x) {
  const num = Number.parseFloat(x);
  return num % 1 === 0 ? num.toFixed(2) : num.toFixed(2);
}

exports.addOrder = async (req, res) => {
  try {
    const { message, totalSolidNums, totalMoney, shops } = req.body;
    const user = req.user;
  
    let total_money = 0;
    let total_nums = 0;

    // 先验证所有商品是否存在
    for (const item of shops) {
      const s = await Shop.findById(item.id);
      if (!s) {
        return res
          .status(404)
          .json({ success: false, message: "商品ID不存在" });
      }
    }

    // 然后计算总价和数量
    shops.forEach((item) => {
      total_money += item.actualPrice * item.solidNums;
      total_nums += item.solidNums;
    });

    if (financial(total_money) !=financial(totalMoney)) {
      return res
        .status(400)
        .json({ success: false, message: "价格计算不正确" });
    }
    if (total_nums != totalSolidNums) {
      return res
        .status(400)
        .json({ success: false, message: "商品数量不正确" });
    }
    const newItem = await Order.create({
      message,
      totalSolidNums,
      totalMoney,
      shops,
      user:user._id
    });
    return res
      .status(200)
      .json({ success: true, message: "success", data: newItem.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add order.",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id ,type} = req.body;
    // check status
    const item = await Order.findOne({ _id: id, status: "0" });
    if (!item) {
      return res
        .status(403)
        .json({ success: false, message: "无法操作，非进行状态！" });
    }
    // 更新状态为取消
    if(type==='cancel'){
      await Order.findByIdAndUpdate(id, { status: "2" });
    }else{
      await Order.findByIdAndUpdate(id, { status: "1" });
    }
    return res.status(200).json({ success: true, message: "success" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add order.",
    });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // check status if completed
    const item = await Order.findOne({ _id: id, status: "1" });
    if (!item) {
      return res
        .status(403)
        .json({ success: false, message: "无法删除，非完成状态！" });
    }
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "success" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add order.",
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const apiFeature = new ApiFeature(Order.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();

    const items = await apiFeature.query.populate('user','username');
    const totals_p = new ApiFeature(Order.find(), req.query).filter();
    let totals = await totals_p.query
    totals = totals.length

    return res
      .status(200)
      .json({
        success: true,
        message: "success",
        data: { totals, data: items },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add order.",
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateItem = await Order.findById(id).populate('user','username');
    if (!updateItem) {
      return res.status(404).json({ success: false, message: "该对象不存在" });
    }

    return res
      .status(200)
      .json({ success: true, message: "success", data: updateItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add order.",
    });
  }
};
