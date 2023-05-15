<template>
  <page @returnClick="goBack" :title="name">
    <template v-slot:header-right>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <more-outlined style="color: #FFF"/>
        </a>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="clearMsg">清空</a-menu-item>
            <a-menu-item key="refresh">刷新</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template v-slot:content>
      <div v-for="(message, index) in messages" :key="index"
           :class="message.sentByMe?'chat-message-item chat-message-right':'chat-message-item'">
        <template v-if="message.sentByMe">

          <!--          <div class="chat-message">{{ test(message) }}</div>-->
          <template v-if="message.type==='audio'">
            <chat-message @playAudio="playAudio(index)"
                          :audio-url="message.audioUrl"
                          :audio-text="message.audioText"
            />
          </template>
          <template v-else>
            <div class="chat-message" v-html="message.content"></div>
          </template>

          <a-avatar shape="square">
            <template #icon>
              <user-outlined/>
            </template>
          </a-avatar>
        </template>
        <template v-else>
          <a-avatar shape="square" :src="message.avatar"/>
          <!--          <div class="chat-message">{{ test(message) }}</div>-->
          <template v-if="message.type==='text'">
            <div class="chat-message" v-html="message.content"></div>
          </template>
          <template v-else>
            <chat-message @playAudio="playAudio(index)"
                          :audio-url="message.audioUrl"
                          :audio-text="message.audioText"
            />
          </template>
        </template>
      </div>
    </template>
    <template v-slot:footer>
      <a-button @click="switchModel">
        <template #icon>
          <code-outlined v-if="!txtChatModel"/>
          <audio-outlined v-if="txtChatModel"/>
        </template>
      </a-button>
      <a-button v-if="!txtChatModel" class="send-txt"
                @touchstart="startRecord"
                @touchend="stopRecord"
                @mousedown="startRecord"
                @mouseup="stopRecord">{{ recording ? '录制中...' : '按住说话' }}
      </a-button>
      <a-input v-if="txtChatModel" v-model:value="inputMessage"
               class="send-txt"
               placeholder="请输入信息"
               enterkeyhint="send"
               size="large"
               @pressEnter="sendMessage"></a-input>
      <a-button @click="sendMessage">
        <template #icon>
          <send-outlined/>
        </template>
      </a-button>
    </template>
  </page>
</template>

<script setup lang="tsx">
import {defineComponent, getCurrentInstance, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Page from '../../components/Page.vue'
import {marked} from 'marked';
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/github.css'
import OpenAiLogo from '../../assets/openai.webp'
import ChatMessage from "./ChatMessage.vue";

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance() as any

defineComponent({
  Page, ChatMessage
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
const txtChatModel = ref(true)

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
      messages.value.push({sentByMe: false, avatar: OpenAiLogo, content: marked(data.msg), type: 'text'});
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
  } else if (name === "OpenAi画图") {
    proxy.$httpClient.post("/api/openai/img", {messages: messageList}).then((data: any) => {
      messages.value.push({sentByMe: false, avatar: OpenAiLogo, content: marked(data.msg), type: 'text'});
    }).catch((reason: any) => {
      proxy.$dlg.error(reason)
    })
  }
};
const handleMenuClick = (e: any) => {
  if (e.key === 'refresh') {
    window.document.location.reload()
  } else if (e.key === 'clearMsg') {
    messages.value = []
  }
}
const switchModel = () => {
  txtChatModel.value = !txtChatModel.value
}


const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);
const recording = ref(false)
const startRecord = () => {
  console.log("start recored......")
  //MediaStreamConstraints
  const constraints = {
    audio: {
      sampleRate: 44100, // 采样率
      channelCount: 2,   // 声道
      volume: 6.0     // 音量
    }
  }
  window.navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
    mediaRecorder.value = new MediaRecorder(mediaStream)
    mediaRecorder.value.onstart = () => {
      recording.value = true;
    }
    mediaRecorder.value.onstop = () => {
      recording.value = false;
    }
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    }
    mediaRecorder.value.start()
  }).catch(err => {
    // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
    // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误
    console.error(err);
  });
}

const audioRefs = ref<Array<HTMLAudioElement>>([]);
const playAudio = (idx: number) => {
  audioRefs.value = Array.from(document.querySelectorAll('audio'));
  if (audioRefs.value[idx]) {
    audioRefs.value[idx].play();
  }
}
const stopRecord = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks.value, {type: 'audio/wav'});
      audioChunks.value = []; // 清空录音数据
      console.log(audioBlob)
      let formData = new FormData()
      formData.set("file", audioBlob);

      let audioUrl = URL.createObjectURL(audioBlob)


      proxy.$httpClient.fetch("/api/openai/audio2txt",
          "POST",
          {headers: {'Content-Type': 'multipart/form-data'}},
          formData).then((data: any) => {

        console.log(data)
        messages.value.push({
          sentByMe: true,
          avatar: 'my-avatar-url',
          content: '',
          type: 'audio',
          audioUrl: audioUrl,
          audioText: data.text
        });
      }).catch((err: any) => {
        console.error(err)
      })
    });

    mediaRecorder.value.stop();
  }
}
const test = (info: any) => {
  debugger
  return <div>
    {info.sentByMe}
  </div>
}
onMounted(() => {
  if (!name) {
    proxy.$dlg.error("参数错误")
  }
})
</script>

<style scoped>

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

.send-txt {
  border: 0;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 5px;
  flex: 1;
}

</style>
