<template>
  <a-layout class="x-main">
    <a-layout-header class="x-header">会话</a-layout-header>
    <a-layout-content class="x-content">
      <div v-if="currentTab === 'chats'" class="chats">
        <div class="chat" v-for="chat in chats" :key="chat.id" @click="chatHandler(chat)">
          <div class="avatar">{{ chat.avatar }}</div>
          <div class="info">
            <div class="username">{{ chat.username }}</div>
            <div class="message">{{ chat.message }}</div>
          </div>
          <div class="time">{{ chat.time }}</div>
        </div>
      </div>
    </a-layout-content>
    <a-layout-footer class="x-footer">
      <div class="x-footer-bar">
        <div :class="currentTab === 'chats'?'x-footer-item x-footer-item-active':'x-footer-item'"
             @click="currentTab = 'chats'">
          <div class="x-footer-item-icon">
            <message-outlined/>
          </div>
          <div class="x-footer-item-text">会话</div>
        </div>
        <div :class="currentTab === 'contacts'?'x-footer-item x-footer-item-active':'x-footer-item'"
             @click="currentTab = 'contacts'">
          <div class="x-footer-item-icon">
            <contacts-outlined/>
          </div>
          <div class="x-footer-item-text">联系人</div>
        </div>
        <div :class="currentTab === 'me'?'x-footer-item x-footer-item-active':'x-footer-item'"
             @click="currentTab = 'me'">
          <div class="x-footer-item-icon">
            <user-outlined/>
          </div>
          <div class="x-footer-item-text">我的</div>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();


const chats = reactive([
  {
    id: "1",
    avatar: 'A',
    username: 'Alice',
    message: 'Hello, how are you?',
    time: '10:45',
  },
  {
    id: "2",
    avatar: 'B',
    username: 'Bob',
    message: 'Hey, check this out!',
    time: '12:30',
  },
  // ...
]);
const currentTab = ref("chats")

const chatHandler = (chat: any) => {
  router.push({name: "chat", params: {"chat": chat}})
}

</script>

<style scoped>
.x-main {
  flex: 1;
}

.x-header {
  background-color: #1890ff;
  color: white;
  font-size: 1.5rem;
  padding: 10px;
  vertical-align: middle;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.x-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #ffffff;
}

.chats {
  display: flex;
  flex-direction: column;
}

.chat {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.chat:hover {
  background: #D4D4D4;
}

.avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-right: 10px;
}

.info {
  flex-grow: 1;
}

.username {
  font-weight: bold;
}

.x-footer {
  display: flex;
  justify-content: center;
  padding: 0;
  height: 67px;
}

.x-footer-bar {
  background-image: linear-gradient(#F7F7F7, #EBEBEB);
  flex: 1;
  border-top: 1px solid #D4D4D4;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

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
  color: #000;
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

.bottomBtn {
  flex: 1;
}

a-button {
  margin: 0 5px;
}
</style>
