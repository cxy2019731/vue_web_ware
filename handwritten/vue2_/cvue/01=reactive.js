/*
 * @Author: itmanyong
 * @Date: 2021-04-13 14:27:22
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-13 15:09:39
 * @FilePath: \vue_web_ware\handwritten\vue2_\cvue\01=reactive.js
 */

// 数据响应式,这里只针对对象
// vue2中的数组有另一套响应式策略
function defineReactive(obj, key, val) {
  observe(obj);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      return val;
    },
    set(newVal) {
      if (val != newVal) {
        // 新对象需要重新挂载响应式监听
        observe(newVal);
        console.log("set", key);
        val = newVal;
        // 这里可以触发更新操作
      }
    },
  });
}

// 递归遍历方法
function observe(obj) {
  if (typeof obj != "object" || obj === null) {
    return;
  }

  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

// 未初始化属性新属性进行响应式绑定
function set(obj, key, val) {
  defineReactive(obj, key, val);
}

const obj = {
  foo: "foo",
  bar: "bar",
  baz: {
    a: "666",
  },
};
observe(obj);
// obj.foo;
// obj.foo = "foooooo";
// obj.baz = {
//   a: 6,
// };
// obj.baz.a;
// obj.dong='dong';
// obj.dong
