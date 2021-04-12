/*
 * @Author: itmanyong
 * @Date: 2021-04-12 14:01:10
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-12 15:28:22
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\router\index.js
 */
import Vue from "vue";
// import VueRouter from 'vue-router'
import VueRouter from "./cRouter";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    children: [
      {
        path: "/about/detail",
        name: "Deatil",
        component: () => import("../views/Detail.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
