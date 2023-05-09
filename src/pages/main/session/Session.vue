<template>
  <div v-if="currentTab === 'chats'" class="chats">
    <div class="chat" v-for="chat in chats" :key="chat.id" @click="chatHandler(chat)">
      <a-avatar shape="square" :size="50" :src="chat.avatar"></a-avatar>
      <div class="info">
        <div class="username">{{ chat.username }}</div>
        <div class="message">{{ chat.message }}</div>
      </div>
      <div class="time">{{ chat.time }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import OpenAiLogo from "../../../assets/openai.webp"

const router = useRouter();
const chats = reactive([
  {
    id: "1",
    avatar: OpenAiLogo,
    username: 'OpenAi对话',
    message: '文本对话',
    time: '',
  },
  {
    id: "2",
    avatar: OpenAiLogo,
    username: 'OpenAi画图',
    message: 'ai画图',
    time: '',
  },
  // ...
]);
const currentTab = ref("chats")

const chatHandler = (chat: any) => {
  router.push({name: "chat", query: {"username": chat.username}})
}
</script>

<style scoped>

.chats {
  display: flex;
  flex-direction: column;
}

.chat {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  background: #FFFFFF;
  border-radius: 5px;
  padding: 5px;
}

.chat:hover {
  background: #D4D4D4;
}

.chat .time {
  color: gray;
}

.info {
  flex-grow: 1;
  padding: 5px;
}

.username {
  font-weight: bold;
}

</style>
