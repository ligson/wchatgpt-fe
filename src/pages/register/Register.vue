<template>
  <a-card class="login-container">
    <div class="login-header">
      <img src="../../assets/vue.svg" alt="logo">
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
        <a-form-item
            name="repeatPassword"
            :validateTrigger="['change']"
        >
          <a-input v-model:value="loginFormState.repeatPassword" type="password" placeholder="重复输入密码"/>
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
          <a-button type="primary" html-type="submit" style="width: 100%;">注册</a-button>
        </a-form-item>
      </a-form>
      <div class="login-links">
        <a href="/wchatgpt-fe/login">去登录</a>
      </div>
    </a-card>
  </a-card>
</template>

<script setup lang="ts">
import type {Rule} from 'ant-design-vue/es/form';
import {getCurrentInstance, onMounted, reactive, ref} from 'vue';
import {FormInstance} from "ant-design-vue";


interface FormState {
  username: string;
  password: string;
  repeatPassword: string;
  captchaCode: string;
}

//const router = useRouter();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient


const loginFormState = reactive<FormState>({
  username: '',
  password: '',
  repeatPassword: '',
  captchaCode: '',
});
const usernameValidator = async (_rule: Rule, value: string) => {
  if (value) {
    let reg = /^[a-z0-9]{6,12}$/
    if (reg.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject('账号必须时小写英文和数字,长度6到12位');
    }
  } else {
    return Promise.reject('请输入用户名!');
  }
}

const passwordValidator = async (_rule: Rule, value: string) => {
  if (value) {
    let reg = /^[a-z0-9_]{8,}$/
    if (reg.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject('密码必须时小写英文和数字,长度至少8位');
    }
  } else {
    return Promise.reject('请输入密码!');
  }
}

const repeatPasswordValidator = async (_rule: Rule, value: string) => {
  if (value === loginFormState.password) {
    return Promise.resolve()
  } else {
    return Promise.reject('两次密码不一致!');
  }
}

const rules: Record<string, Rule[]> = {
  username: [{required: true, validator: usernameValidator}],
  password: [{required: true, validator: passwordValidator}],
  repeatPassword: [{required: true, validator: repeatPasswordValidator}],
  captchaCode: [{required: true, message: '请填写图形验证码'}],
};

const loginForm = ref<FormInstance>();
const captchaUrl = ref("");
const captchaKey = ref("")
const handleSubmit = async () => {
  loginForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/auth/register", {
      captcha_key: captchaKey.value,
      captcha_code: values.captchaCode,
      username: values.username,
      password: values.password
    }).then((data: any) => {
      console.log(data)
      proxy.$dlg.info("注册成功,去登录!")
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/login"})
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
onMounted(() => {
  refreshCaptcha()
})
</script>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-links {
  margin-top: 16px;
}
</style>
