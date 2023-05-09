<template>
  <a-modal v-model:visible="resetPwdDlgVisible" title="升级用户" @ok="resetPwdHandleOk" @cancel="resetPwdHandleCancel">
    <a-form ref="loginForm"
            @finish="handleSubmit"
            :model="loginFormState"
            :rules="rules">
      <a-form-item
          name="username"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="loginFormState.username" type="text" placeholder="请输入用户名"/>
      </a-form-item>
      <a-form-item
          name="registerCode"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="loginFormState.registerCode" type="password" placeholder="请输入注册码"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  username: string
  registerCode: string;
}

const resetPwdDlgVisible = ref(false)
const loginFormState = reactive<FormState>({
  username: '',
  registerCode: '',
});

const rules: Record<string, Rule[]> = {
  username: [{required: true, message: '请填写用户名'}],
  registerCode: [{required: true, message: '请填写注册码'}],
};
const loginForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient

const handleSubmit = async () => {
  loginForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/user/upgrade", {
      username: values.username,
      register_code: values.registerCode
    }).then((data: any) => {
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      console.log(data)
      resetPwdDlgVisible.value = false
      proxy.$dlg.info("升级成功")
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
