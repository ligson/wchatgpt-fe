<template>
  <a-card class="login-container">
    <div class="login-header">
      <img :src="logo" alt="logo">
    </div>
    <a-card :bordered="false" style="width: 300px;">
      <a-form ref="loginForm"
              @finish="handleSubmit"
              :model="loginFormState"
              :rules="rules">
        <a-form-item
            name="username"
            :validateTrigger="['change']"
        >
          <a-input v-model:value="loginFormState.username" placeholder="用户名"/>
        </a-form-item>

        <a-form-item
            name="password"
            :validateTrigger="['change']"
        >
          <a-input v-model:value="loginFormState.password" type="password" placeholder="密码"/>
        </a-form-item>

        <a-form-item name="captchaCode"
                     :validateTrigger="['change']">
          <div style="display: flex; align-items: center;">
            <a-input v-model:value="loginFormState.captchaCode" style="flex: 1;" placeholder="验证码"/>
            <img
                :src="captchaUrl"
                alt="Captcha"
                style="margin-left: 8px; cursor: pointer;width: 100px;height: 36px"
                @click="refreshCaptcha"
            />
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%;">登录</a-button>
        </a-form-item>
      </a-form>
      <div class="login-links">
        <a href="#">忘记密码,请联系管理员:<span>{{ ichat ? 'jmc01362474' : 'abroket' }}</span></a><br/>
        <a href="/wchatgpt-fe/register">没有账号？请注册</a>
      </div>
    </a-card>
  </a-card>
</template>

<script setup lang="ts">
import type {Rule} from 'ant-design-vue/es/form';
import {getCurrentInstance, onMounted, reactive, ref} from 'vue';
import {FormInstance} from "ant-design-vue";
import {useRouter} from 'vue-router';
import Abroket from "../../assets/abroket-logo.png"
import Jmc from "../../assets/vue.svg"

interface FormState {
  username: string;
  password: string;
  captchaCode: string;
}

const router = useRouter();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient


const loginFormState = reactive<FormState>({
  username: '',
  password: '',
  captchaCode: '',
});
const rules: Record<string, Rule[]> = {
  username: [{required: true, message: '请输入用户名!'}],
  password: [{required: true, message: '请输入密码!'}],
  captchaCode: [{required: true, message: '请填写图形验证码'}],
};

const loginForm = ref<FormInstance>();
const captchaUrl = ref("");
const captchaKey = ref("")
const handleSubmit = async () => {
  loginForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/auth/login", {
      captcha_key: captchaKey.value,
      captcha_code: values.captchaCode,
      username: values.username,
      password: values.password
    }).then((data: any) => {
      window.localStorage.setItem("token", data.token)
      window.localStorage.setItem("username", data.username)
      router.push({path: "/main"})
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
    console.log('Form submitted  success:' + values);

    //return Promise.resolve()
  }).catch((errors: any) => {
    console.log('Form validation failed.' + errors);
  });
};


const refreshCaptcha = () => {
  ///wchatgpt-be/api/auth/getCaptcha
  httpClient.get("/api/auth/getCaptcha").then((data: any) => {
    captchaUrl.value = data.captchaPath
    captchaKey.value = data.captchaKey
  })
  console.log('Refresh captcha');
  // Refresh the captcha image, e.g., request a new image from your server
  //captchaUrl.value = `https://dummyimage.com/100x36/999/fff&text=${Math.random().toString(36).slice(2, 6)}`
};
const ichat = ref(true)
const logo = ref("")
const bingLogo = () => {
  ichat.value = window.location.host === 'ichat.x-assn.xyz';
  console.log(ichat.value + "=====")
  logo.value = ichat.value ? Jmc : Abroket
  console.log(logo.value + "=====")
}
const checkLogin = () => {
  const token = window.localStorage.getItem("token")
  if (token) {
    httpClient.post("/api/auth/checkLogin", {
      token: token
    }).then((data: any) => {
      //window.localStorage.setItem("token", data.token)
      window.localStorage.setItem("username", data.username)
      router.push({path: "/main"})
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
  }
}
onMounted(() => {
  bingLogo()
  checkLogin()
  refreshCaptcha()
})
</script>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-links {
  margin-top: 16px;
}
</style>
