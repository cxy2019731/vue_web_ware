import Vue from "vue";

/*
 * @Author: itmanyong
 * @Date: 2021-04-12 17:28:07
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-13 13:31:23
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\store\cVuex.js
 */
var __Vue;
class Store {
  constructor(options) {
    // 存放参数到实例上
    this.options = options;
    this.ostate = { ...options.state };
    this.matations = options.mutations;
    this.actions = options.actions;
    this.getterFuncs = options.getters;
    this.getters = {};
    let computed = {};
    // 对于getters先做处理转换为无参形式,利用Vue自身的computed实现响应式计算,再利用defineProperty监听输出
    // 这里的computed就是Vue中的computed,下面只是为computed定义key和getters对应的get方法
    // 实际上我们的getters最终变为computed了,只是我们取的时候通过getters的key去取computed中对应key的值
    const store = this;
    Object.keys(store.getterFuncs).forEach((fnKey) => {
      const fn = store.getterFuncs[fnKey];
      computed[fnKey] = function() {
        return fn(store.state);
      };
      Object.defineProperty(store.getters, fnKey, {
        get: () => store._vm[fnKey],
      });
    });
    // 申明一个变量来存储状态
    this._vm = new Vue({
      data: {
        // 使用$$开头可以只响应,不做代理
        $$state: options.state,
      },
      // 这里是计算属性,模拟getters
      computed,
    });
    // 绑定作用域
    this.dispatch = this.dispatch.bind(this);
    this.commit = this.commit.bind(this);
  }
  // 存取state直接方式
  get state() {
    return this._vm._data.$$state;
  }
  // 防止直接修改
  set state(v) {
    console.error("不允许直接修改状态数据");
    return;
  }

  // dispatch
  dispatch(key, data) {
    let entry = this.actions[key];
    if (!entry) {
      console.error(`${key} action not is undefined`);
      return;
    }
    return entry(this, data);
  }
  // commit
  commit(key, data) {
    let entry = this.matations[key];
    if (!entry) {
      console.error(`${key} matation not is undefined`);
      return;
    }
    return entry(this.state, data);
  }
}

function install(_Vue) {
  __Vue = _Vue;

  __Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        __Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { install, Store };
