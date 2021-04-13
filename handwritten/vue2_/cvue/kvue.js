/*
 * @Author: itmanyong
 * @Date: 2021-04-13 14:54:25
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-13 18:25:38
 * @FilePath: \vue_web_ware\handwritten\vue2_\cvue\kvue.js
 */

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

function defineReactive(obj, key, val) {
  // 递归监听
  observe(val);

  // 创建dep依赖对象
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      // 此处在每个地方使用状态的时候正好可以获取那些地方创建了Watch,将Watch实例导入当前key对应的dep实例的deps中,方便key更新时去调用这个Wather
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(v) {
      if (val != v) {
        // 新对象需要重新挂载响应式监听
        console.log("set", key);
        val = v;
        observe(v);
        // 这里可以触发更新操作-处罚的肯定就是dep中的更新方法拉
        dep.notify();
      }
    },
  });
}

// 递归遍历方法
function observe(obj) {
  // 不是对象就不递归监听了
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  // 创建对象监听实例
  new Observer(obj);
}

// 每一个响应式对象中的某个key的值只要是一个对象,就要创建一个observer的实例
class Observer {
  // 根据传入数据的类型做不同的响应式处理
  constructor(obj) {
    this.value = obj;
    if (Array.isArray(obj)) {
      // to do
    } else {
      // obj
      this.walk(obj);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get: () => vm.$data[key],
      set: (v) => (vm.$data[key] = v),
    });
  });
}

class Kvue {
  // new Kvue({el,data...})
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;
    // 1.对data做响应式的处理
    observe(this.$data);
    // 1.5 代理
    proxy(this);

    // 2.编译
    new Compiler(options.el, this);
  }
}

class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    // 获取根节点el
    this.$el = document.querySelector(el);
    if (this.$el) {
      this.compiler(this.$el);
    }
  }
  // 处理节点下有所子孙节点或对应事件文本
  compiler(el) {
    //   1.获取所有子节点
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (this.isElement(node)) {
        // 节点的话除了解析自身的其他响应,还需要继续处理本身自己的子节点
        this.compileElement(node);
        if (node.childNodes && node.childNodes.length) {
          this.compiler(node);
        }
      } else if (this.isText(node)) {
        this.compileText(node);
      }
    });
  }
  // 判断text
  isText(node) {
    // 特别说明:这里的正则采用分组的概念,最终匹配的变量名会被赋值于RegExp.$1上,方便调用,可见compileText中使用
    return node.nodeType === 3 && /\{\{(.*)}\}/.test(node.textContent);
  }
  // 判断elm
  isElement(node) {
    return node.nodeType === 1;
  }
  // 处理事件
  compileEvent(node, eventType, fnName) {
    console.log(node, eventType, fnName);
    // 判断methods中是否存在此函数
    const fn = this.$vm.$methods[fnName] || null;
    if (fn) {
      node.addEventListener(eventType, () => fn.call(this.$vm));
    } else {
      console.error(`${fnName} 函数在 methods 中未找到`);
    }
  }
  // 处理节点-主要是v-text这一类指令
  compileElement(node) {
    // 1.先获取节点上的属性,匹配需要作处理的指令
    const nodeAttrs = Array.from(node.attributes);
    if (!nodeAttrs.length) {
      return;
    }
    nodeAttrs.forEach((attr) => {
      const { name, value } = attr;
      // 指令
      switch (name) {
        case "c-text":
          this.update(node, value, "text");
          break;
        case "c-html":
          this.update(node, value, "html");
          break;
        case "c-model":
          this.compileModel(node,value)
          break;
      }
      // 事件
      if (name.indexOf("@") != -1 || name.indexOf("c-on:") != -1) {
        this.compileEvent(
          node,
          name.replace("@", "").replace("c-on:", ""),
          value
        );
      }
    });
  }
  // 抽象更新函数,执行更新分发
  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);
    // 创建Wather,因为每一个更新的时候都会触发此函数,就方便创建Wather,这里的newVal是下面call绑定传送的参数
    new Wather(this.$vm, exp, function(newVal) {
      fn && fn(node, newVal);
    });
  }
  // 处理{{text}}
  compileText(node) {
    this.update(node, RegExp.$1, "text");
  }
  // 处理c-model
  compileModel(node,exp){
    // 先绑定初始值
    node.value = this.$vm[exp];
    // 给当前node绑定change事件,并且指定更新对应值
    node.addEventListener('input',event=>{
      this.$vm[exp] = event.target.value||"";
    })
  }
  // 处理c-text/{{text}}
  textUpdater(node, val) {
    node.textContent = val;
  }
  // 处理c-html
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
}

// 更新执行者Wather,每一个引用的地方都是一个Wather,即使是针对同一个key
class Wather {
  constructor(vm, key, updater) {
    this._vm = vm;
    this._key = key;
    this._updater = updater;
    // 将当前Wather放入到Dep中方便更新依赖引用
    Dep.target = this;
    this._vm[this._key];
    Dep.target = null;
  }

  update() {
    // 重置上下文,传递最新的值给更新函数
    this._updater.call(this._vm, this._vm[this._key]);
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watch) {
    this.deps.push(watch);
  }

  notify() {
    this.deps.forEach((w) => w.update());
  }
}
