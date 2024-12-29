import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { addShopAPI, getShopAPI, getShopcatesAPI, updateShopAPI } from "../apis/apiRequest";
import { useNavigate, useParams } from "react-router";
import { toast } from 'react-toastify';


const AddShop = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    shopcates: [],
    description: "",
    coverImage: null,
    shopImages: [],
    price: "",
    stockNums: "",
    specification: [{ title: "", options: [{ title: "", price: "" }] }],
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()
  let {id} = useParams()

  useEffect(() => {
    // Fetch categories
    const getCategories = async () => {
      const res = await getShopcatesAPI();
      if (res.success) {
        setCategories(res.data.data);
      }
    };

    const getShop = async()=>{
      const res = await getShopAPI(id);
      if(res.success){
        setFormData(res.data)
      }
    }

    getCategories();
    if(id){
      getShop()
    }

  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      shopcates: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      coverImage: file.name,
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specification];
    newSpecs[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      specification: newSpecs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    if(id){
      const res = await updateShopAPI(formData);
      if (res.success) {
        toast.success('修改成功');
      }else{
        toast.error(res.message);
      }
    }else{
      const res = await addShopAPI(formData);
      if (res.success) {
        toast.success('新增成功');
      }else{
        toast.error(res.message);
      }
    }
    
  };


  return (
    <>
      <Typography
        component="h3"
        variant="h5"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 1rem)" }}
      >
        新增商品
      </Typography>

      <Card variant="outlined" sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <div>
            <TextField
              required
              label="商品名称"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              label="商品副标题"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
            />
          </div>

          <FormControl fullWidth required>
            <InputLabel>商品类别</InputLabel>
            <Select
              name="shopcates"
              multiple
              value={formData.shopcates}
              onChange={handleSelectChange}
              label="商品类别"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="商品描述"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddIcon />}
            >
              上传商品图片
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {formData.coverImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                已选择: {formData.coverImage}
              </Typography>
            )}
          </Box>

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddIcon />}
            >
              上传商品展示图片
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setFormData((prev) => ({
                    ...prev,
                    shopImages: files.map((file) => file.name),
                  }));
                }}
              />
            </Button>
            {formData.shopImages && formData.shopImages.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                已选择: {formData.shopImages.length} 张图片
              </Typography>
            )}
          </Box>

          <div>
            <Box>
              <TextField
                required
                type="number"
                label="价格"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                inputProps={{
                  step: "0.01",
                  min: "0",
                }}
              />
              <TextField
                required
                type="number"
                label="库存"
                name="stockNums"
                value={formData.stockNums}
                onChange={handleInputChange}
                inputProps={{
                  step: "1",
                  min: "0",
                }}
              />
            </Box>
          </div>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">规格</Typography>
            {formData.specification.map((specGroup, groupIndex) => (
              <Box
                key={groupIndex}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    label="规格名称"
                    value={specGroup.title}
                    onChange={(e) =>
                      handleSpecificationChange(
                        groupIndex,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  <IconButton
                    onClick={() => {
                      const newSpecs = [...formData.specification];
                      newSpecs.splice(groupIndex, 1);
                      setFormData((prev) => ({
                        ...prev,
                        specification: newSpecs,
                      }));
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {specGroup.options.map((option, optionIndex) => (
                  <Box
                    key={optionIndex}
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      ml: 4,
                    }}
                  >
                    <TextField
                      label="规格选项"
                      value={option.title}
                      onChange={(e) => {
                        const newSpecs = [...formData.specification];
                        newSpecs[groupIndex].options[optionIndex].title =
                          e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          specification: newSpecs,
                        }));
                      }}
                    />
                    <TextField
                      type="number"
                      label="价格"
                      value={option.price}
                      onChange={(e) => {
                        const newSpecs = [...formData.specification];
                        newSpecs[groupIndex].options[optionIndex].price =
                          e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          specification: newSpecs,
                        }));
                      }}
                      inputProps={{
                        step: "0.01",
                        min: "0",
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const newSpecs = [...formData.specification];
                        newSpecs[groupIndex].options.splice(optionIndex, 1);
                        setFormData((prev) => ({
                          ...prev,
                          specification: newSpecs,
                        }));
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  onClick={() => {
                    const newSpecs = [...formData.specification];
                    newSpecs[groupIndex].options.push({ title: "", price: "" });
                    setFormData((prev) => ({
                      ...prev,
                      specification: newSpecs,
                    }));
                  }}
                  startIcon={<AddIcon />}
                  sx={{ alignSelf: "flex-start", ml: 4 }}
                >
                  添加规格选项
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  specification: [
                    ...prev.specification,
                    { title: "", options: [{ title: "", price: "" }] },
                  ],
                }));
              }}
              startIcon={<AddIcon />}
            >
              添加规格组
            </Button>
          </Box>
          <div>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 ,marginRight:2}}
            >
              保存
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate('/shop')}
            >
              取消
            </Button>
          </div>
        </Box>
      </Card>
    </>
  );
};

export default AddShop;
