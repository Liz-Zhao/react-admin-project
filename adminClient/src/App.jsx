import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";
import ShopCategory from "./pages/ShopCategory";
import Shop from "./pages/Shop";
import Order from "./pages/Order"
import OrderDetial from "./pages/OrderDetial"
import Login from "./pages/Login";
import AddShop from "./pages/AddShop";
import UserInfo from "./pages/UserInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={
            <MainLayout />
        }>
          <Route index element={<Home />} />
          <Route path="shopcate" element={<ShopCategory />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<AddShop />} />
          <Route path="shop_add" element={<AddShop />} />
          <Route path="order" element={<Order />} />
          <Route path="order/:id" element={<OrderDetial />} />
          <Route path="user" element={<UserInfo />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
