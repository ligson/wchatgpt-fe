import {createApp} from 'vue'
import './style.css'
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import router from "./router/router"
import * as antIcons from '@ant-design/icons-vue';
import HttpClient from "./util/HttpClient"
import {config} from "./util/GlobalPropConfig"


const app = createApp(App)
// 注册组件
Object.keys(antIcons).forEach(key => {
    app.component(key, (antIcons as any)[key])
})
app.config.globalProperties.$httpClient = HttpClient
config(app)

app.use(Antd).use(router).mount('#app')
