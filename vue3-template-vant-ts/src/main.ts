/*
 * @Author: itmanyong
 * @Date: 2021-03-10 18:12:17
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-14 13:33:34
 * @FilePath: \vue_web_ware\vue3-template-vant-ts\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import ant from "./utils/ant";
import 'lib-flexible/flexible'
import 'vant/lib/index.css'; // 全局引入样式
import "./utils/rem";
// 日志,构建去除即可
import VConsole from 'vconsole';
var vconsole=new VConsole();
 // 全局引入样式
createApp(App)
.use(router)
.use(store)
.use(ant)
.mount('#app')
