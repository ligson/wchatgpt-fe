<template>
  <div class="my-container">
    <div class="my-top">
      <div class="my-photo">
        <a-avatar shape="square">
          <template #icon>
            <user-outlined/>
          </template>
        </a-avatar>
      </div>
      <div class="my-content">
        <div class="my-nickname">{{ nickname }}</div>
        <!--        <div class="my-account"><span>账号:</span>xxxxxxx</div>-->
      </div>
    </div>
    <div class="my-setting">
      <a-list :itemLayout="'horizontal'">
        <a-list-item class="my-list-item" @click="resetPwdHandler">
          <setting-outlined/>
          <div>修改密码</div>
          <right-outlined/>
        </a-list-item>
        <a-list-item class="my-list-item" @click="adminHandler">
          <setting-outlined/>
          <div>管理员</div>
          <right-outlined/>
        </a-list-item>
        <a-list-item class="my-list-item" @click="settingHandler">
          <setting-outlined/>
          <div>退出</div>
          <right-outlined/>
        </a-list-item>
      </a-list>
    </div>
  </div>

  <reset-pwd-dlg ref="resetPwdRef"></reset-pwd-dlg>
  <upgrade-user-dlg ref="upgradeUserDlgRef"></upgrade-user-dlg>
  <delete-user-dlg ref="deleteUserDlgRef"></delete-user-dlg>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {defineComponent, onMounted, ref} from "vue";
import ResetPwdDlg from "./ResetPwdDlg.vue";
import UpgradeUserDlg from "./UpgradeUserDlg.vue";
import DeleteUserDlg from "./DeleteUserDlg.vue";

defineComponent({
  ResetPwdDlg, UpgradeUserDlg, DeleteUserDlg
})

const router = useRouter();

const settingHandler = () => {
  window.localStorage.removeItem("token")
  window.localStorage.removeItem("username")
  router.push({path: "/login"})
}
const resetPwdRef = ref()
const resetPwdHandler = () => {
  resetPwdRef.value.openDlg()
}

const upgradeUserDlgRef = ref()
const adminHandler = () => {
  router.push({path: "/admin"})
}
const deleteUserDlgRef = ref()

const nickname = ref("")
onMounted(() => {
  nickname.value = localStorage.getItem("username") || ""
})
</script>

<style scoped>
.my-container {
  display: flex;
  flex-direction: column;
  background: #F3F3F3;
}

.my-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #FFFFFF;
  padding: 5px;
  border-radius: 5px;
}

.my-content {
  padding: 5px;
  display: flex;
  flex-direction: column;

}

.my-content .my-nickname {
  font-weight: bold;
  font-size: 14px;
}

.my-list-item {
  background: #FFFFFF;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.my-list-item:hover {
  background: #D4D4D4;
}

.my-setting {
  margin-top: 5px;
}
</style>
