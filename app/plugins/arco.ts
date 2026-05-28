import ArcoVue, { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import en from '@arco-design/web-vue/es/locale/lang/en-us.js'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ArcoVue, {
    locale: en,
  })

  return {
    provide: {
      message: Message
    }
  }
})