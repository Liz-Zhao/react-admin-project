import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AddShop from "./pages/AddShop";
import Order from "./pages/Order";
import OrderDetial from "./pages/OrderDetial";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {setRoutes} from './slices/appSlice'

const components = {
  ShopCategory,
  Shop,
  AddShop,
  Order,
  OrderDetial,
  UserInfo,
  Dashboard,
};

function App() {
  const dispatch = useDispatch();
  const routes = useSelector((state) => state.app.routes)

  useEffect(()=>{
    const userRole = JSON.parse(localStorage.getItem('role'));
    if(userRole){
      dispatch(setRoutes(userRole.routes))
    }
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={ <MainLayout />}>
          <Route index element={<Home />} />
          {routes.map((route, index) => {
            const Component = components[route.element];
            return <Route key={index} path={route.path} element={<Component />} />;
        })}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

{/* <Route index element={<Home />} />
<Route path="shopcate" element={<ShopCategory />} />
<Route path="shop" element={<Shop />} />
<Route path="shop/:id" element={<AddShop />} />
<Route path="shop_add" element={<AddShop />} />
<Route path="order" element={<Order />} />
<Route path="order/:id" element={<OrderDetial />} />
<Route path="user" element={<UserInfo />} /> */}