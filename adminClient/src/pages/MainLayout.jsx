import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import GavelIcon from "@mui/icons-material/Gavel";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Avatar, Breadcrumbs, Menu, MenuItem, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const drawerWidth = 240;

const iconComponents = {
  AccessibilityIcon,
  LocalMallIcon,
  ShopTwoIcon,
  GavelIcon
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));


export default function MainLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  let navigate = useNavigate();
  let location = useLocation();
  const currentPath = location.pathname.split("/")[1];
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const token = localStorage.getItem('token');

  const menuRoutes = useSelector((state) => state.app.menuRoutes)


  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[token,navigate])
  
  if(!token){
     return null
  }

  const handleLogout = async()=>{
    navigate('/login');
    localStorage.clear()
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <AppBar position="fixed" open={open} sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ display:"flex", justifyContent:"space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=>setOpen(true)}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            后台管理系统
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(event)=>setAnchorElUser(event.currentTarget)} sx={{ p: 0 }}>
                {/* <Avatar alt="Remy Sharp" src="/public/vite.svg" /> */}
                <Avatar>U</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={()=>setAnchorElUser(null)}
            >
             <MenuItem onClick={()=>navigate('/user')}>
                  <Typography sx={{ textAlign: 'center' }}>账户信息</Typography>
                </MenuItem>
                <MenuItem  onClick={()=>handleLogout()}>
                  <Typography sx={{ textAlign: 'center' }}>退出系统</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
  
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={()=>setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <ListItemButton
              sx={[
                { minHeight: 48, px: 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="首页"
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>
          {
            menuRoutes.map((route,index) => {
              const IconComponent = iconComponents[route.icon]
              return (<ListItem
              key={index}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                navigate(route.path);
              }}
            >
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {IconComponent ? <IconComponent /> : null}
                </ListItemIcon>
                <ListItemText
                  primary={route.name}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>)
            })
          }
          
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div role="presentation" >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" to="/">
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href={"/"+'currentPath'}
              to={"/"+currentPath}
            >
              {currentPath}
            </Link>
            { location.pathname.split("/")[2] && <Typography sx={{ color: "text.primary" }}>详情</Typography>}
            
          </Breadcrumbs>
        </div>
        <Outlet />
      </Box>
    </Box>
  );
}
