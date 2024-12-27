import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";
import ShopCategory from "./pages/ShopCategory";
import Shop from "./pages/Shop";
import Order from "./pages/Order"
import Login from "./pages/Login";
import AddShop from "./pages/AddShop";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shopcate" element={<ShopCategory />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop_add" element={<AddShop />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="/login" element={<Login />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
