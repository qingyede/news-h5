<template>
  <div id="app">
    <!-- //路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- //底部导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
body {
  user-select: none;
  width: 100%;
  word-break: break-all;
}
</style>
