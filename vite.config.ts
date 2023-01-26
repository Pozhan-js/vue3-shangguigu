import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import {resolve} from 'path'

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/

// 创建代理服务器
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    lintOnSave: false,
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': resolve(__dirname, "src"),
      },
      extensions: [".ts", ".vue", ".js", ".jsx", ".tsx"], // 导入时想要省略的扩展名列表。
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "./src/styles/variables.scss";',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    server:{
      host: "localhost",
      open: true,
      port: 5000,
      proxy:{
        '/app-dev': {
          // 运用外部网络也能实现接口数据请求
          target: 'http://gmall-h5-api.atguigu.cn',
          // 该选项控制 target选项是否能被替代
          changeOrigin: true,
          // 重写服务器路径
          rewrite: (path) => path.replace(/^\/app-dev/, '')
        },
      }
    },
  }
});
