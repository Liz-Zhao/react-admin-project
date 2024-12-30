import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import { changePasswordAPI, changeUserFieldAPI, getUserAPI } from "../apis/apiRequest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserInfoChange = () => {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
  });

  const [editState, setEditState] = React.useState({
    username: false,
    email: false
  });

  // 临时存储编辑值
  const [tempData, setTempData] = React.useState({
    username: '',
    email: ''
  });

  React.useEffect(()=>{
    getUserAPI().then((res)=>{
      setFormData(res.data);
    });
  },[]);

  const handleEdit = (field) => {
    setEditState(prev => ({ ...prev, [field]: true }));
    setTempData(prev => ({ ...prev, [field]: formData[field] }));
  };

  const handleCancel = (field) => {
    setEditState(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (field) => {
    try {
      // TODO: 调用API保存单个字段
      const response = await changeUserFieldAPI({field,value:tempData[field]});
      if(response.success){
        setFormData(prev => ({
          ...prev,
          [field]: tempData[field]
        }));
        setEditState(prev => ({ ...prev, [field]: false }));
        toast.success('保存成功！');
      }else{
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('保存失败，请重试！');
    }
  };

  const renderField = (field, label) => {
    const isEditing = editState[field];

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          fullWidth
          label={label}
          name={field}
          value={isEditing ? tempData[field] : formData[field]}
          onChange={handleChange}
          disabled={!isEditing}
          variant="outlined"
        />
        
        {!isEditing ? (
          <Button 
            variant="contained" 
            onClick={() => handleEdit(field)}
            sx={{ minWidth: '100px' }}
          >
            修改
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleSave(field)}
              sx={{ minWidth: '100px' }}
            >
              保存
            </Button>
            <Button 
              variant="outlined"
              onClick={() => handleCancel(field)}
              sx={{ minWidth: '100px' }}
            >
              取消
            </Button>
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
          信息修改
        </Typography>
        
        {renderField('username', '用户名称')}
        {renderField('email', '邮箱')}
      </Paper>
  );
};

const PasswordChange = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    oldPassword: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.oldPassword || !formData.password || !formData.password2){
      toast.error('请填写完整');
      return;
    }
    if(formData.password !== formData.password2){
      toast.error('两次密码不一致');
      return;
    }
    changePasswordAPI({oldPassword:formData.oldPassword,password:formData.password}).then((res)=>{
      if(res.success){
        toast.success('修改成功, 需要重新登录系统！');
        setTimeout(()=>{
          navigate('/login');
          localStorage.clear();
        },1000);
      }else{
        toast.error(res.message);
      }
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        密码修改
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="oldPassword"
          label="旧密码"
          name="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="新密码"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="password2"
          label="再输入新密码"
          name="password2"
          type="password"
          value={formData.password2}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
        >
          保存
        </Button>
      </Box>
    </Paper>
  );
};

export default function UserInfo() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="信息修改" {...a11yProps(0)} />
          <Tab label="密码修改" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserInfoChange />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PasswordChange />
      </CustomTabPanel>
    </Box>
  );
}
