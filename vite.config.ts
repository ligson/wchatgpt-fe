import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default (({mode}: { mode: any }) => {
    const config = {
        base: "/wchatgpt-fe/",
        plugins: [vue()],
    }
    return defineConfig(config)
})
