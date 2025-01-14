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
      const allowedRoutes = routesConfig.map((route) => {
        if(route.subMenu){
          return route.subMenu.filter((subRoute) => action.payload.includes(subRoute.path));  
        }else if(action.payload.includes(route.path)){
          return route
        }
        return null
      }).filter(Boolean).flat();
      state.routes = allowedRoutes;

      const menuRoutes = routesConfig.map((route) => {
        if(route.subMenu){
          const filteredSubMenu = route.subMenu.filter((subRoute) => action.payload.includes(subRoute.path) && !subRoute.hidden);
          if (filteredSubMenu.length > 0) {
            // 如果子路由有符合条件的，返回包含这些子路由的父级路由
            return {
              ...route,
              subMenu: filteredSubMenu,
            };
          }
        }else if(action.payload.includes(route.path) && !route.hidden){
          return route
        }
        return null;
      }).filter(Boolean);

      state.menuRoutes = menuRoutes
      state.routLoading = false
    },
    
  },
});

// 导出 actions
export const {setRoutes} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
