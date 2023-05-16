<template>
  <a-modal v-model:visible="modifyUserLevelDlgVisible"
           title="修改用户级别"
           @ok="modifyUserLevelHandleOk"
           @cancel="modifyUserLevelHandleCancel">
    <a-form ref="modifyUserLevelForm"
            @finish="handleSubmit"
            :model="modifyUserLevelFormState"
            :rules="rules">

      <a-form-item
          name="level"
          :validateTrigger="['change']"
      >
        <a-select v-model:value="modifyUserLevelFormState.level" :options="userLevel"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {FormInstance} from "ant-design-vue";

interface FormState {
  level: string
}

const props = defineProps({
  userId: {
    type: String
  },
  level: {
    type: String
  }
})

const userLevel = [
  {value: 'FREE', label: '免费'},
  {value: 'FOREVER', label: '付费'},
];

const modifyUserLevelDlgVisible = ref(false)
const modifyUserLevelFormState = reactive<FormState>({
  level: props.level || 'FREE',
});

const rules: Record<string, Rule[]> = {
  level: [{required: true, message: '请选择级别'}],
};
const modifyUserLevelForm = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const emits = defineEmits(["success"])
const handleSubmit = async () => {
  modifyUserLevelForm.value?.validateFields().then((values: any) => {
    httpClient.post("/api/admin/usermgr/modifyUserLevel", {
      id: props.userId,
      level: values.level
    }).then((data: any) => {
      console.log(data)
      //window.localStorage.setItem("token", data.token)
      //window.localStorage.setItem("username", data.username)
      //router.push({path: "/main"})
      modifyUserLevelDlgVisible.value = false
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


const modifyUserLevelHandleCancel = () => {
  modifyUserLevelForm.value?.resetFields()
}
const modifyUserLevelHandleOk = () => {
  handleSubmit()
}
const openDlg = () => {
  modifyUserLevelDlgVisible.value = true
  setTimeout(() => {
    modifyUserLevelFormState.level = props.level || 'FREE'
  }, 200)
}
defineExpose({
  openDlg
})
</script>

<style scoped>

</style>
