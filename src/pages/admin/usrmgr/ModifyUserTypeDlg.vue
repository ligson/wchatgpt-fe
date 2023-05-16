<template>
  <a-modal v-model:visible="modifyUserTypeDlgVisible"
           title="修改用户类型"
           @ok="modifyUserTypeHandleOk"
           @cancel="modifyUserTypeHandleCancel">
    <a-form ref="modifyUserTypeForm"
            @finish="handleSubmit"
            :model="modifyUserTypeFormState"
            :rules="rules">

      <a-form-item
          name="userType"
          :validateTrigger="['change']"
      >
        <a-select v-model:value="modifyUserTypeFormState.userType" :options="userType"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  userType: string
}

const props = defineProps({
  userId: {
    type: String
  },
  userType: {
    type: String
  }
})

const userType = [
  {value: 'ADMIN', label: '管理员'},
  {value: 'NORMAL', label: '普通用户'},
];

const modifyUserTypeDlgVisible = ref(false)
const modifyUserTypeFormState = reactive<FormState>({
  userType: props.userType || 'NORMAL',
});

const rules: Record<string, Rule[]> = {
  userType: [{required: true, message: '请选择类型'}],
};
const modifyUserTypeForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const emits = defineEmits(["success"])
const handleSubmit = async () => {
  modifyUserTypeForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/admin/usermgr/modifyUserType", {
      id: props.userId,
      userType: values.userType
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      modifyUserTypeDlgVisible.value = false
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


const modifyUserTypeHandleCancel = () => {
  modifyUserTypeForm.value?.resetFields()
}
const modifyUserTypeHandleOk = () => {
  handleSubmit()
}
const openDlg = () => {
  modifyUserTypeDlgVisible.value = true
  setTimeout(() => {
    modifyUserTypeFormState.userType = props.userType || 'NORMAL'
  }, 200)
}
defineExpose({
  openDlg
})
</script>

<style scoped>

</style>
