const Role = require("../models/Role");
const ApiFeature = require("../utils/apiFeature");

exports.addRole = async (req, res) => {
  try {
    const { roleName, description, permissions } = req.body;

    let updateRoutes = [];
    permissions.forEach((item) => {
      if (item.route && item.checked) {
        updateRoutes.push(item.route);
        item.children.forEach((child) => {
          if (child.route && item.checked) updateRoutes.push(child.route);
        });
      }
    });

    const newItem = await Role.create({
      roleName,
      description,
      permissions,
      routes: updateRoutes,
    });

    return res
      .status(200)
      .json({ success: true, message: "success", data: newItem.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add a role.",
    });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { _id: id, roleName, description, permissions } = req.body;

    let updateRoutes = [];
    permissions.forEach((item) => {
      if (item.route && item.checked) {
        updateRoutes.push(item.route);
        item.children.forEach((child) => {
          if (child.route && item.checked) updateRoutes.push(child.route);
        });
      }
    });

    const newItem = await Role.findByIdAndUpdate(
      id,
      { roleName, description, permissions, routes: updateRoutes },
      { new: true }
    );
    if (!newItem) {
      return res.status(400).json({ success: false, message: "该对象不存在" });
    }
    return res
      .status(200)
      .json({ success: true, message: "success", data: newItem.toObject() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || error.toString(),
      message: "There was an error on add a role.",
    });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const apiFeature = new ApiFeature(Role.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();

    const items = await apiFeature.query;
    const totals_p = new ApiFeature(Role.find(), req.query).filter();
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
      message: "There was an error on get role list.",
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateItem = await Role.findById(id);
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
      message: "There was an error on get role list.",
    });
  }
};
