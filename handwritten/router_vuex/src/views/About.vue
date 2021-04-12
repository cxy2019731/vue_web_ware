<!--
 * @Author: itmanyong
 * @Date: 2021-04-12 14:08:51
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-12 17:26:29
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\views\About.vue
-->
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2><router-link to="/about/detail">嵌套 detail page</router-link></h2>
    <div style="color:red;"><router-view /></div>
  </div>
</template>
