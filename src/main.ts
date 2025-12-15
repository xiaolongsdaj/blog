import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入Vue Router
import router from './router'

// 导入Pinia
import { pinia } from './stores'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')
