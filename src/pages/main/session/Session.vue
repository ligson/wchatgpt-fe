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
  {
    id: "3",
    avatar: OpenAiLogo,
    username: 'OpenAi照片',
    message: 'ai照片修复',
    time: '',
  },
  {
    id: "4",
    avatar: OpenAiLogo,
    username: 'OpenAi象棋',
    message: 'ai智能象棋',
    time: '',
  },
  // ...
]);
const currentTab = ref("chats")

const chatHandler = (chat: any) => {
  if(chat.username === 'OpenAi照片') {
    router.push({name: "photo", query: {"username": chat.username}})
  } else if(chat.username === 'OpenAi象棋') {
    router.push({name: "chess", query: {"username": chat.username}})
  } else {
    router.push({name: "chat", query: {"username": chat.username}})
  }
  
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
