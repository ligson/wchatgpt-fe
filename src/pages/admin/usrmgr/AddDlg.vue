<template>
  <a-modal v-model:visible="addDlgVisible"
           title="新增"
           @ok="addHandleOk"
           @cancel="addHandleCancel">
    <a-form ref="addForm"
            @finish="handleSubmit"
            :model="addFormState"
            :rules="rules">

      <a-form-item
          name="name"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="addFormState.name" type="text" placeholder="请输入用户名"/>
      </a-form-item>
      <a-form-item
          name="password"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="addFormState.password" type="password" placeholder="请输入密码"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  name: string
  password: string;
}

const addDlgVisible = ref(false)
const addFormState = reactive<FormState>({
  name: '',
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

const rules: Record<string, Rule[]> = {
  password: [{required: true, validator: passwordValidator}],
  name: [{required: true, validator: usernameValidator}],
};
const addForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const emits = defineEmits(["success"])
const handleSubmit = async () => {
  addForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/admin/usermgr/add", {
      name: values.name,
      password: values.password
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      addDlgVisible.value = false
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


const addHandleCancel = () => {
  addForm.value?.resetFields()
}
const addHandleOk = () => {
  handleSubmit()
}
const openDlg = () => {
  addDlgVisible.value = true
}
defineExpose({
  openDlg
})
</script>

<style scoped>

</style>
