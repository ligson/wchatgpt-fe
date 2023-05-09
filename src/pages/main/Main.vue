<template>
  <page :title="title" :returnShow="false">
    <template v-slot:content>
      <router-view></router-view>
    </template>
    <template v-slot:footer>
      <div :class="currentTab === '/session'?'x-footer-item x-footer-item-active':'x-footer-item'"
           @click="goToPage('/session')">
        <div class="x-footer-item-icon">
          <message-outlined/>
        </div>
        <div class="x-footer-item-text">会话</div>
      </div>
      <div :class="currentTab === '/contacts'?'x-footer-item x-footer-item-active':'x-footer-item'"
           @click="goToPage('/contacts')">
        <div class="x-footer-item-icon">
          <contacts-outlined/>
        </div>
        <div class="x-footer-item-text">联系人</div>
      </div>
      <div :class="currentTab === '/my'?'x-footer-item x-footer-item-active':'x-footer-item'"
           @click="goToPage('/my')">
        <div class="x-footer-item-icon">
          <user-outlined/>
        </div>
        <div class="x-footer-item-text">我的</div>
      </div>
    </template>
  </page>
</template>

<script setup lang="ts">
import {defineComponent, ref} from "vue";
import {useRouter} from "vue-router";
import Page from '../../components/Page.vue'

defineComponent({
  Page
})
const router = useRouter();


const currentTab = ref("/session")
const title = ref("会话")

const goToPage = (pagePath: any) => {
  currentTab.value = pagePath
  if (pagePath === '/session') {
    title.value = '会话'
  } else if (pagePath === '/contacts') {
    title.value = '联系人'
  } else {
    title.value = '我的'
  }
  router.push({path: pagePath})
}
</script>

<style scoped>

/*.avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-right: 10px;
}*/


.x-footer-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}


.x-footer-item-icon {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.x-footer-item-icon span {
  color: gray;
  font-size: 30px;
}

.x-footer-item-text {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.x-footer-item-active .x-footer-item-icon span, .x-footer-item-active .x-footer-item-text {
  color: #A9E97A;
  font-weight: bold;
}

a-button {
  margin: 0 5px;
}
</style>
