<template>
  <page @returnClick="goBack" :title="name">
    <template v-slot:header-right>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <more-outlined style="color: #FFF"/>
        </a>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="refresh">刷新</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template v-slot:content>
      <div v-for="(message, index) in messages" :key="index"
           :class="message.sentByMe?'chat-message-item chat-message-right':'chat-message-item'">
        <template v-if="message.sentByMe">
          <div class="chat-message" v-html="message.content"></div>
          <a-avatar shape="square">
            <template #icon>
              <user-outlined/>
            </template>
          </a-avatar>
        </template>
        <template v-else>
          <a-avatar shape="square" :src="'/src/assets/openai.webp'"/>
          <div class="chat-message" v-html="message.content"></div>
        </template>
      </div>
    </template>
    <template v-slot:footer>
      <a-input-search
          v-model:value="inputMessage"
          placeholder="请输入信息"
          size="large"
          @search="sendMessage"
      >
        <template #enterButton>
          <a-button @click="sendMessage">发送</a-button>
        </template>
      </a-input-search>
    </template>
  </page>
</template>

<script setup lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Page from '../../components/Page.vue'
import {marked} from 'marked';
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/github.css'

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance() as any

defineComponent({
  Page
})

const name = route.query.username?.toString();
/*const messages = ref([
  {
    sentByMe: true,
    avatar: 'my-avatar-url',
    content: '你好！插槽就是子组件中的提供给父组件使用的一个占位符,用<slot></slot> 表示,父组件可以在这个占位符中填充任何模板代码,如 HTML、组件等,填充的内容会替换子组件'
  },
  {sentByMe: false, avatar: 'friend-avatar-url', content: '你好！你是谁？'},
]);*/
const messages: any = ref([])
const inputMessage = ref('');

const goBack = () => {
  router.go(-1);
};

const render = new marked.Renderer()
marked.setOptions({
  renderer: render, // 这是必填项
  gfm: true,	// 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）

  // 高亮的语法规范
  //highlight: (code, lang) => hljs.highlight(code, {language: lang}).value,
  highlight: (code) => hljs.highlightAuto(code).value,
});

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  messages.value.push({sentByMe: true, avatar: 'my-avatar-url', content: inputMessage.value});
  inputMessage.value = '';
  let messageList: any = []
  for (let i = 0; i < messages.value.length; i++) {
    //assistant
    let msg = messages.value[i]
    if (msg.sentByMe) {
      messageList.push({content: msg.content, role: 'user'})
    } else {
      messageList.push({content: msg.content, role: 'assistant'})
    }
  }
  if (name === "OpenAi对话") {
    proxy.$httpClient.post("/api/openai/chat", {messages: messageList}).then((data: any) => {
      messages.value.push({sentByMe: false, avatar: 'my-avatar-url', content: marked(data.msg)});
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
  } else if (name === "OpenAi画图") {
    proxy.$httpClient.post("/api/openai/img", {messages: messageList}).then((data: any) => {
      messages.value.push({sentByMe: false, avatar: 'my-avatar-url', content: marked(data.msg)});
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
  }
};
const handleMenuClick = (e: any) => {
  if (e.key === 'refresh') {
    window.document.location.reload()
  }
}
onMounted(() => {
  if (!name) {
    proxy.$dlg.error("参数错误")
  }
})
</script>

<style scoped>
.chat-header {
  padding: 12px 0;
  cursor: pointer;
}

.chat-title {
  text-align: center;
}

.chat-content {
  padding: 12px;
  overflow-y: auto;
  max-height: 300px;
}

.chat-message {
  display: inline-block;
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 4px 8px;
}

.chat-message-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chat-message-right {
  justify-content: flex-end;
}

.chat-message-right .chat-message {
  background-color: #95df68;
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 12px 0;
}
</style>
