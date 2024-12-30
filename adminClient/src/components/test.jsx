const UserInfoChange = () => {
    const [formData, setFormData] = React.useState({
      username: "",
      email: "",
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
      changeUserAPI(formData).then((res) => {
        if (res.success) {
          toast.success("修改成功");
        } else {
          toast.error(res.message);
        }
      });
    };
  
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          信息修改
        </Typography>
  
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="用户名称"
            name="username"
            autoComplete="off"
            value={formData.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
  
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱"
            name="email"
            type="email"
            value={formData.email}
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