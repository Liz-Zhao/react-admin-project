import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import React from "react";
import MuiCard from "@mui/material/Card";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { registerAPI } from "../apis/apiRequest";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Register = () => {
  const [fieldError, setFieldError] = React.useState({
    usernameError: false,
    usernameErrorMessage: "",
    passwordError: false,
    passwordErrorMessage: "",
    emailError: false,
    emailErrorMessage: "",
  });

  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    if (
      fieldError.usernameError ||
      fieldError.passwordError ||
      fieldError.emailError
    ) {
      event.preventDefault();
      return;
    }
    event.preventDefault();

    const res = await registerAPI(formData);

    if (res.success) {
      toast.success("注册成功，返回登录");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      toast.error("注册失败");
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!formData.email) {
      setFieldError((prev) => {
        return { ...prev, emailError: true, emailErrorMessage: "邮箱不合法" };
      });
      isValid = false;
    } else {
      setFieldError((prev) => {
        return { ...prev, emailError: false, emailErrorMessage: "" };
      });
    }

    if (!formData.username) {
      setFieldError((prev) => {
        return {
          ...prev,
          usernameError: true,
          usernameErrorMessage: "名称必填",
        };
      });
      isValid = false;
    } else {
      setFieldError((prev) => {
        return { ...prev, usernameError: false, usernameErrorMessage: "" };
      });
    }

    if (!formData.password || formData?.password?.length < 6) {
      setFieldError((prev) => {
        return {
          ...prev,
          passwordError: true,
          passwordErrorMessage: "密码不得少于6位",
        };
      });
      isValid = false;
    } else {
      setFieldError((prev) => {
        return { ...prev, passwordError: false, passwordErrorMessage: "" };
      });
    }

    return isValid;
  };

  return (
    <>
      <ToastContainer />
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            注册
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">邮箱</FormLabel>
              <TextField
                error={fieldError.emailError}
                helperText={fieldError.emailErrorMessage}
                value={formData.email}
                onChange={handleChange}
                id="email"
                type="email"
                name="email"
                placeholder="@email.com"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={fieldError.emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="username">账号</FormLabel>
              <TextField
                error={fieldError.usernameError}
                helperText={fieldError.usernameErrorMessage}
                value={formData.username}
                onChange={handleChange}
                id="username"
                type="text"
                name="username"
                placeholder="your"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={fieldError.usernameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">密码</FormLabel>
              <TextField
                error={fieldError.passwordError}
                helperText={fieldError.passwordErrorMessage}
                value={formData.password}
                onChange={handleChange}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={fieldError.passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              注册
            </Button>
          </Box>
          <Box>
            <Typography>
              已有账号？
              <Link
                href="/login"
                to="/login"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                登录
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Register;
