<template>
  <a-modal v-model:visible="resetPwdDlgVisible" title="修改密码" @ok="resetPwdHandleOk" @cancel="resetPwdHandleCancel">
    <a-form ref="loginForm"
            @finish="handleSubmit"
            :model="loginFormState"
            :rules="rules">

      <a-form-item
          name="oldPassword"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="loginFormState.oldPassword" type="password" placeholder="请输入旧密码"/>
      </a-form-item>
      <a-form-item
          name="newPassword"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="loginFormState.newPassword" type="password" placeholder="请输入新密码"/>
      </a-form-item>
      <a-form-item
          name="repeatPassword"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="loginFormState.repeatPassword" type="password" placeholder="重复输入密码"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  oldPassword: string
  newPassword: string;
  repeatPassword: string;
}

const resetPwdDlgVisible = ref(false)
const loginFormState = reactive<FormState>({
  oldPassword: '',
  newPassword: '',
  repeatPassword: ''
});
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
  if (value === loginFormState.newPassword) {
    return Promise.resolve()
  } else {
    return Promise.reject('两次密码不一致!');
  }
}

const rules: Record<string, Rule[]> = {
  oldPassword: [{required: true, message: '请填写旧密码'}],
  newPassword: [{required: true, validator: passwordValidator}],
  repeatPassword: [{required: true, validator: repeatPasswordValidator}],
};
const loginForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient

const handleSubmit = async () => {
  loginForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/user/resetPassword", {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      resetPwdDlgVisible.value = false
      proxy.$dlg.info("修改成功")
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
    console.log('Form submitted  success:' + values);

    //return Promise.resolve()
  }).catch((errors: any) => {
    console.log('Form validation failed.' + errors);
  });
};


const resetPwdHandleCancel = () => {
  loginForm.value?.resetFields()
}
const resetPwdHandleOk = () => {
  handleSubmit()
}
const openDlg = () => {
  resetPwdDlgVisible.value = true
}
defineExpose({
  openDlg
})
</script>

<style scoped>

</style>
