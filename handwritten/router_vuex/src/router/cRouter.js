/*
 * @Author: itmanyong
 * @Date: 2021-04-12 14:30:41
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-12 17:27:25
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\router\cRouter.js
 */
var __Vue;
// router本身创建时是通过new来创建的，所以使用class进行创建
class VueRouter {
  // 接收创建时的参数
  constructor(options) {
    this.options = options;
    this.routes = options.routes || [];
    this.flatRoutes = this.getFlatMapRoutes(options.routes);
    // 由于需要根据URL变化动态渲染视图,所以我们必须实时响应URL的变化,我们先在内部把URL存起来
    this.current = window.location.hash.slice(1) || "/";

    // 创建一个路由映射表,这样方便调取路由
    // this.routeMap = {};
    // this.routes.forEach((route) => {
    //   this.routeMap[route.path] = route;
    // });

    // 当前渲染的路由集合,就是渲染在界面上的route的集合
    this.matched = [];
    __Vue.util.defineReactive(this, "matched", []);
    this.getMatched();

    // 还需要动态监听URL变化，把最新的值保存在current
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));
    // 但是内部current虽然实时保存了，但是界面并不会变化，因为current不是响应式数据,所以我们需要将其变为响应式数据.
    // 这里可以使用new Vue/defineReactive;第二个是Vue内部未暴露的响应式API
    // 使用Vue的API又不导入Vue，我们可以使用install里面的_Vue,将其映射为全局
    // __Vue.util.defineReactive(
    //   this,
    //   "current",
    //   window.location.hash.slice(1) || "/"
    // );
  }
  // 路由变化触发
  onHashChange() {
    this.current = window.location.hash.slice(1) || "/";
    this.matched = [];
    this.getMatched();
  }
  // 获取当前以及匹配的路由集合
  getMatched(routes = this.routes) {
    for (let route of routes) {
      // 如果是根路由,则无需匹配,直接返回
      if (this.current === "/" && route.path === "/") {
        this.matched.push(route);
        return;
      }

      if (route.path !== "/" && this.current.indexOf(route.path) != -1) {
        this.matched.push(route);
        if (route.children && route.children.length) {
          this.getMatched(route.children);
          return;
        }
      }
    }
  }
  // 获取当前路由的扁平化信息
  getFlatMapRoutes(routes = this.routes) {
    let list = [];
    routes.forEach((i) => {
      list.push(i);
      if (i.children && i.children.length) {
        list = [...list, ...this.getFlatMapRoutes(i.children)];
      }
    });
    return list;
  }

  // 由于router通过了use api进行注册,所以必须要实现install方法
  static install(_Vue) {
    __Vue = _Vue;
    // 平时使用时直接this.$router就可以使用了,肯定是需要做处理的,这里我们直接使用mixin
    __Vue.mixin({
      beforeCreate() {
        // 我们在main.js中是在Vue实例中注入了router的,所以我们可以拿到他
        // 这里通过this.$options可以拿到this实例的属性,为何需要判断解除下面注释内容看具体输入即可明白
        // console.log(this.$options)
        if (this.$options.router) {
          __Vue.prototype.$router = this.$options.router;
        }
      },
    });
    // router在平时使用时会用到router-link和router-view,会发现这两个我们是按照组件的方式去使用的，但是我们并没有申明,就可以直接使用
    // 所以需要在注册router的时候全局注册一下这两个组件,否则无法使用
    __Vue.component("router-link", {
      // render是vue中一个内部的渲染函数,h是视图创建方法
      render(h) {
        // 获取需要显示的链接的名称，这里this.$router能使用是因为我们上面mixin挂载了
        const entey = this.$router.flatRoutes.find(
          (i) => i.path === this.$attrs.to
        );
        // 由于需要改变URL，平时使用VueRouter中router-link最终也是渲染的a标签
        return h("a", { attrs: { href: "#" + this.$attrs.to } }, this.$slots.default||entey.name);
      },
    });

    __Vue.component("router-view", {
      render(h) {
        // 把当前组件标记为routerView组件
        this.$vnode.data.routerView = true;
        //当前嵌套深度,这里抽取深度主要是为了匹配嵌套routerView中的route
        let depth = 0;
        let parent = this.$parent;
        while (parent) {
          const parentVnodeData = parent.$vnode && parent.$vnode.data;
          if (parentVnodeData) {
            // 如果父组件也是routerView组件，则深度加一
            if (parentVnodeData.routerView) {
              depth++;
            }
          }

          parent = parent.$parent || null;
        }
        // 获取需要显示的组件的信息
        let component = null;
        const entey = this.$router.matched[depth];
        if (entey) {
          component = entey.component;
        }
        return h(component);
      },
    });
  }
}

export default VueRouter;
