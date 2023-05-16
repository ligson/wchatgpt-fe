<template>
  <a-modal v-model:visible="resetPwdDlgVisible"
           title="重置密码"
           @ok="resetPwdHandleOk"
           @cancel="resetPwdHandleCancel">
    <a-form ref="resetPwdForm"
            @finish="handleSubmit"
            :model="resetPwdFormState"
            :rules="rules">

      <a-form-item
          name="password"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="resetPwdFormState.password" type="password" placeholder="请输入密码"/>
      </a-form-item>
      <a-form-item
          name="repeatPassword"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="resetPwdFormState.repeatPassword" type="password" placeholder="请输入再次输入密码"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  repeatPassword: string
  password: string;
}

const props = defineProps({
  userId: {
    type: String
  }
})
const resetPwdDlgVisible = ref(false)
const resetPwdFormState = reactive<FormState>({
  repeatPassword: '',
  password: '',
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
  if (value === resetPwdFormState.password) {
    return Promise.resolve()
  } else {
    return Promise.reject('两次密码不一致!');
  }
}

const rules: Record<string, Rule[]> = {
  password: [{required: true, validator: passwordValidator}],
  repeatPassword: [{required: true, validator: repeatPasswordValidator}],
};
const resetPwdForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const emits = defineEmits(["success"])
const handleSubmit = async () => {
  resetPwdForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/admin/usermgr/resetPwd", {
      id: props.userId,
      password: values.password
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      resetPwdDlgVisible.value = false
      proxy.$dlg.info("修改成功")
      emits("success")
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
  resetPwdForm.value?.resetFields()
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
