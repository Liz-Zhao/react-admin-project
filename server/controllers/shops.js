const ShopCategory = require("../models/ShopCategory");
const Shop = require("../models/Shop");
const ApiFeature = require("../utils/apiFeature");
const { Types } = require("mongoose");

exports.addShopcate = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "title is required!" });
    }
    if (!(status in ["0", "1"])) {
      return res.status(400).json({ success: false, message: "状态错误" });
    }

    const newItem = await ShopCategory.create({ title, description, status });
    return res
      .status(200)
      .json({ success: true, message: "success", data: newItem.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add shopcate.",
    });
  }
};

exports.removeShopcate = async (req, res) => {
  try {
    const { id } = req.params;
    await ShopCategory.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "success" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on remove shopcate.",
    });
  }
};

exports.getShopcates = async (req, res) => {
  try {
    const apiFeature = new ApiFeature(ShopCategory.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();

    const items = await apiFeature.query;
    const totals_p = new ApiFeature(Shop.find(), req.query).filter();
    let totals = await totals_p.query;
    totals = totals.length;

    return res.status(200).json({
      success: true,
      message: "success",
      data: { totals, data: items },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shopcates.",
    });
  }
};

exports.updateShopcate = async (req, res) => {
  try {
    const { id, title, description, status } = req.body;
    if (!(status in ["0", "1"])) {
      return res.status(400).json({ success: false, message: "状态错误" });
    }
    const updateItem = await ShopCategory.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );
    if (!updateItem) {
      return res.status(403).json({ success: false, message: "该对象不存在" });
    }

    return res
      .status(200)
      .json({ success: true, message: "success", data: updateItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on update shopcate.",
    });
  }
};

// shop
exports.addShop = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      shopcates,
      coverImage,
      shopImages,
      price,
      stockNums,
      specification,
    } = req.body;

    if (!title || !shopcates || !coverImage || !shopImages) {
      return res.status(400).json({
        success: false,
        message: "缺少必填项, 如商品图片、商品展示图",
      });
    }

    const newItem = await Shop.create({
      title,
      subtitle,
      description,
      shopcates,
      coverImage,
      shopImages,
      price,
      stockNums,
      specification,
    });
    return res
      .status(200)
      .json({ success: true, message: "success", data: newItem.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add shop.",
    });
  }
};

exports.removeShop = async (req, res) => {
  try {
    const { id } = req.params;
    // check status
    const item = await Shop.findOne({ _id: id });
    if (!item) {
      return res
        .status(403)
        .json({ success: false, message: "无法删除，非下架状态！" });
    }
    await Shop.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "success" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on remove shop.",
    });
  }
};

exports.getShops = async (req, res) => {
  try {
    const apiFeature = new ApiFeature(Shop.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();

    const items = await apiFeature.query.populate("shopcates", "title");
    const totals_p = new ApiFeature(Shop.find(), req.query).filter();
    let totals = await totals_p.query;
    totals = totals.length;

    return res.status(200).json({
      success: true,
      message: "success",
      data: { totals, data: items },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shops.",
    });
  }
};

// $facet 聚合管道同时执行多个操作（分页和计数）。
// 在这种情况下，我们使用 $count 来获取符合条件的商店总数，并存储在 metadata 中。
exports.getShopsByCateWithPage = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, id } = req.query; // 获取分页参数
    
    // 有ID，则根据类别进行查询
    if (id) {
      const cate = await ShopCategory.findOne({ status: "1", _id:id });

      const shops = await Shop.aggregate([
        {
          $match: {
            shopcates: cate._id, // 如果直接使用id, 会查不出来的
          },
        },
        {
          $facet: {
            metadata: [
              { $count: "total" }, // 获取总数
            ],
            data: [
              { $skip: (page - 1) * pageSize }, // 分页 - 跳过前面的数据
              { $limit: parseInt(pageSize) }, // 限制返回的数量
            ],
          },
        },
      ]);
      const totalItems = shops[0]?.metadata[0]?.total || 0; // 获取总数量
      const totalPages = Math.ceil(totalItems / pageSize); // 计算总页数
      
      const data ={
        cate: cate.title, // 分组后的类别名称
        id: cate._id,
        shops: shops[0]?.data || [], // 当前类别下的shop列表
        page: parseInt(page), // 当前页码
        pageSize: parseInt(pageSize), // 每页数量
        totals: totalItems, // 总商品数量
        pages: totalPages, // 总页数
      };

      res.status(200).json({ success: true, data });
    } else {
      // 查询所有shopcates
      const shopCategories = await ShopCategory.find({ status: "1" });
      // 创建一个查询结果数组，用来存储分组后的结果
      const result = [];
      // 处理每一个类别
      for (let category of shopCategories) {
        // 使用aggregate进行分组查询
        const shops = await Shop.aggregate([
          {
            $match: {
              shopcates: category._id, // 根据shopcate_id进行匹配
            },
          },
          {
            $facet: {
              metadata: [
                { $count: "total" }, // 获取总数
              ],
              data: [
                { $skip: (page - 1) * pageSize }, // 分页 - 跳过前面的数据
                { $limit: parseInt(pageSize) }, // 限制返回的数量
              ],
            },
          },
        ]);
        const totalItems = shops[0]?.metadata[0]?.total || 0; // 获取总数量
        const totalPages = Math.ceil(totalItems / pageSize); // 计算总页数

        result.push({
          cate: category.title, // 分组后的类别名称
          id: category._id,
          shops: shops[0]?.data || [], // 当前类别下的shop列表
          page: parseInt(page), // 当前页码
          pageSize: parseInt(pageSize), // 每页数量
          totals: totalItems, // 总商品数量
          pages: totalPages, // 总页数
        });
      }

      res.status(200).json({ success: true, data: result });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shops.",
    });
  }
};

exports.getShopsByCateNotPage = async (req, res) => {
  try {
    const items = await Shop.find().populate("shopcates", "title");

    // Group shops by shopcate title
    const groupedShops = items.reduce((acc, shop) => {
      // Iterate over each shopcate in shop.shopcates
      shop.shopcates.forEach((cate) => {
        const cateTitle = cate.title;

        // Find existing group or create new one
        let group = acc.find((g) => g.cate === cateTitle);
        if (!group) {
          group = {
            cate: cateTitle,
            shops: [],
          };
          acc.push(group);
        }

        // Add shop to group
        group.shops.push(shop);
      });

      return acc;
    }, []);

    return res.status(200).json({
      success: true,
      message: "success",
      data: groupedShops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shops.",
    });
  }
};

exports.test = async (req, res) => {
  try {
    // const count = await Shop.countDocuments({title: { $regex: 'five5' }})
    const count = await Shop.find({ shopcates: "676e47170173af7ea409ca76" });
    return res.status(200).json({ data: count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shops.",
    });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const {
      _id: id,
      title,
      subtitle,
      description,
      shopcates,
      coverImage,
      shopImages,
      price,
      stockNums,
      specification,
    } = req.body;

    const updateItem = await Shop.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        description,
        shopcates,
        coverImage,
        shopImages,
        price,
        stockNums,
        specification,
      },
      { new: true }
    );

    if (!updateItem) {
      return res.status(400).json({ success: false, message: "该对象不存在" });
    }

    return res
      .status(200)
      .json({ success: true, message: "success", data: updateItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on update shop.",
    });
  }
};

exports.getShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateItem = await Shop.findById(id);
    if (!updateItem) {
      return res.status(400).json({ success: false, message: "该对象不存在" });
    }

    return res
      .status(200)
      .json({ success: true, message: "success", data: updateItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on get shop.",
    });
  }
};

exports.updateShopStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    //check status
    if (!(status in ["0", "1", "2"])) {
      return res.status(400).json({ success: false, message: "状态错误" });
    }
    const updateItem = await Shop.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updateItem) {
      return res.status(400).json({ success: false, message: "该对象不存在" });
    }

    return res
      .status(200)
      .json({ success: true, message: "success", data: updateItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on update shop status.",
    });
  }
};
