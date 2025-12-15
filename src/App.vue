<script setup lang="ts">
import Layout from './components/layout/Layout.vue'
</script>

<template>
  <Layout />
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
  color: #303133;
  line-height: 1.6;
}

/* 链接样式 */
a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #66b1ff;
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
