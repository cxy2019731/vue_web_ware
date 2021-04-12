/*
 * @Author: itmanyong
 * @Date: 2021-04-12 14:08:51
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-12 17:44:44
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\store\index.js
 */
import Vue from "vue";
// import Vuex from 'vuex'
import Vuex from "./cVuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 2,
  },
  mutations: {
    add(state, payload) {
      payload ? (state.count = payload) : state.count++;
    },
    del(state, payload) {
      payload ? (state.count = state.count - payload) : state.count--;
    },
  },
  actions: {
    add({ commit }, payload) {
      commit("add", payload);
    },
    del({ commit }, payload) {
      commit("del", payload);
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
});
