import { createSlice } from "@reduxjs/toolkit";
import routesConfig from "../utils/routesConfig";

const initialState = {
  routes: [],
  menuRoutes:[],
  routLoading: true, // 初始为 true
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      const allowedRoutes = routesConfig.filter((route) => {
        return action.payload.includes(route.path);
      });
      state.routes = allowedRoutes;

      const menuRoutes = routesConfig.filter((route)=>{
        return action.payload.includes(route.path) && !route.hidden;
      })
      state.menuRoutes = menuRoutes
      state.routLoading = false
    },
    
  },
});

// 导出 actions
export const {setRoutes} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
