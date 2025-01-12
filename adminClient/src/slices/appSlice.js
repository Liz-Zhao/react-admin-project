import { createSlice } from "@reduxjs/toolkit";
import routesConfig from "../utils/routesConfig";

const initialState = {
  routes: [],
  menuRoutes:[],
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

    },
    
  },
});

// 导出 actions
export const {setRoutes} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
