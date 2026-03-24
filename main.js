import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  app.use(pinia)
  
  // 核心：必须返回 pinia 实例
  return {
    app,
    Pinia
  }
}