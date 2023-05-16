import {defineConfig, loadEnv, ServerOptions, UserConfigExport} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";


//const baseUrl = import.meta.env.VITE_BASE_URL
// https://vitejs.dev/config/
export default (({mode}: { mode: any }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};


    const serverConfig: ServerOptions = {
        proxy: {
            "^/.+/api": {
                target: process.env.VITE_BASE_URL,
                changeOrigin: true,
                //rewrite:(path)=>{path.replace("")}
            }
        }
    }
    const config: UserConfigExport = {
        base: "/wchatgpt-fe/",
        plugins: [vue(), vueJsxPlugin()],
        server: serverConfig
    }
    return defineConfig(config)
})
