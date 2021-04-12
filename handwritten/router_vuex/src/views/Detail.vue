<!--
 * @Author: itmanyong
 * @Date: 2021-04-12 15:25:38
 * @LastEditors: itmanyong
 * @Description: now file Description
 * @LastEditTime: 2021-04-12 18:17:14
 * @FilePath: \vue_web_ware\handwritten\router_vuex\src\views\Detail.vue
-->
<template>
  <div>
    <h3>User in Detail Info Page</h3>
    <h4>store</h4>
    <div>state count:{{ $store.state.count }}</div>
    <div>getters doubleCount:{{ $store.getters.doubleCount }}</div>
    <div>
      <button @click="$store.dispatch('add')">count dispatch加一</button>
      <button @click="$store.commit('add')">count commit加一</button>
      <button @click="$store.dispatch('del')">count dispatch减一</button>
      <button @click="$store.commit('del')">count commit减一</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  methods: {},
  mounted(){
    console.log(this.$store)
  }
};
</script>

<style></style>
