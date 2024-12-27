import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',  // React 相关的推荐规则
  ],
  rules: {
    'react/prop-types': 'off', // 禁用 props 校验
  }
})
