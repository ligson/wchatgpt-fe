<template>
  <a-modal v-model:visible="modifyUserTimesDlgVisible"
           title="修改用户次数"
           @ok="modifyUserTimesHandleOk"
           @cancel="modifyUserTimesHandleCancel">
    <a-form ref="modifyUserTimesForm"
            @finish="handleSubmit"
            :model="modifyUserTimesFormState"
            :rules="rules">

      <a-form-item
          name="times"
          :validateTrigger="['change']"
      >
        <a-input v-model:value="modifyUserTimesFormState.times" type="text" placeholder="请输入次数"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  times: string
}

const props = defineProps({
  userId: {
    type: String
  },
  times: {
    type: String
  }
})
const modifyUserTimesDlgVisible = ref(false)
const modifyUserTimesFormState = reactive<FormState>({
  times: props.times || '5',
});

const rules: Record<string, Rule[]> = {
  times: [{required: true, message: '请输入次数'}],
};
const modifyUserTimesForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const emits = defineEmits(["success"])
const handleSubmit = async () => {
  modifyUserTimesForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/admin/usermgr/modifyUserTimes", {
      id: props.userId,
      times: values.times
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      modifyUserTimesDlgVisible.value = false
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


const modifyUserTimesHandleCancel = () => {
  modifyUserTimesForm.value?.resetFields()
}
const modifyUserTimesHandleOk = () => {
  handleSubmit()
}
const openDlg = () => {
  modifyUserTimesDlgVisible.value = true
}
defineExpose({
  openDlg
})
</script>

<style scoped>

</style>
