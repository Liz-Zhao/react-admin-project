import { Box, Button, Card, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { addRoleAPI, getRoleAPI, updateRoleAPI } from "../apis/apiRequest";
import { toast } from "react-toastify";

const AddPermission = () => {
  const navigate = useNavigate()
  let {id} = useParams()

  useEffect(()=>{
    if(id){
      getItemData()
    }
  },[id])

  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: [
      { title: "报表", route:'/dashboard', checked:false },
      { title: "订单管理", route:"/order", checked:false, 
        children: [{ title:"查看详情",route: "/order/:id", checked: false }] 
      },
      { title: "商品管理", route:"/shop", checked:false, 
        children: [{ title:"新增",route: "/shop_add", checked: false },
          { title:"编辑",route: "/shop/:id", checked: false },
          { title:"删除", checked: false },
        ] },
      { title: "商品类型", route:"/shopcate", checked:false, 
        children: [{ title:"新增", checked: false },
          { title:"编辑",checked: false },
          { title:"删除", checked: false },
      ]},
      { title: "个人信息", route:"/user", checked:true, 
        children: [{ title:"信息修改", checked: true },
          { title:"密码修改",checked: true },
      ]},
      { title: "权限管理", route:"/permission", checked:false, 
        children: [{ title:"新增",route:"/permission_add", checked: false },
          { title:"编辑", route:'/permission/:id',checked: false },
          { title:"删除", checked: false },
      ]},
    ],
  });

  const getItemData = async()=>{
    const res = await getRoleAPI(id);
    if(res.success){
      setFormData(res.data)
    }
  }

  const handleSubmit =async(e)=>{
    e.preventDefault()
    if(id){
      const res = await updateRoleAPI(formData);
      if (res.success) {
        toast.success('编辑成功');
      }else{
        toast.error(res.message);
      }
    }else{
      const res = await addRoleAPI(formData);
      if (res.success) {
        toast.success('新增成功');
      }else{
        toast.error(res.message);
      }
    }
  }

  return (
    <>
      <Typography
        component="h3"
        variant="h5"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 1rem)" }}
      >
        新增角色
      </Typography>
      <Card variant="outlined" sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            required
            label="角色名称"
            name="roleName"
            value={formData.roleName || ""}
            onChange={(e)=> setFormData(prev=>({...prev, roleName:e.target.value}))}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="角色描述"
            name="description"
            value={formData.description}
            onChange={(e)=> setFormData(prev=>({...prev, description:e.target.value}))}
          />
          <Box sx={{ display:'flex', flexDirection:'column'}}>
          {formData.permissions.map((item,Findex)=>(
            <Box key={Findex}>
              <FormControlLabel
                label={item.title}
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={(e)=>{
                      const newCheck = [...formData.permissions]
                      newCheck[Findex].checked = e.target.checked;

                      //update children
                      if (newCheck[Findex].children) {
                        newCheck[Findex].children = newCheck[Findex].children.map((child) => ({
                          ...child,
                          checked: e.target.checked,
                        }));
                      }

                      setFormData((prev)=>({...prev, permissions:newCheck}))
                    }}
                  />
                }
              />
              {item.children && <Box sx={{ display: 'flex',  ml: 3 }}>
                { item.children.map((child,Cindex)=>(
                  <FormControlLabel
                  key={child.title}
                  label={child.title}
                  control={<Checkbox checked={child.checked} onChange={(e)=>{
                    const newChild = [...formData.permissions]
                    newChild[Findex].children[Cindex].checked = e.target.checked;
                    // update father
                    const allChecked = newChild[Findex].children.some((child) => child.checked);
                    newChild[Findex].checked = allChecked;

                    setFormData((prev)=>({...prev, permissions:newChild}))
                  }} />}
                />
                ))}
              </Box>}
            </Box>
          ))}
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2, marginRight: 2 }}
            >
              保存
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate(-1)}
            >
              取消返回
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default AddPermission;
