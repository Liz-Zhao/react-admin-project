import { createSlice } from "@reduxjs/toolkit";
import routesConfig from "../utils/routesConfig";

const initialState = {
  routes: [],
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
    },
  },
});

// 导出 actions
export const {setRoutes} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
