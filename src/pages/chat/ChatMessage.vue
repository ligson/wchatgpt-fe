<template>
  <template v-if="message.type==='text'">
    <div :class="className" v-html="message.content"></div>
  </template>
  <template v-else-if="message.type==='audio'">
    <div :class="className">
      <audio ref="audioRef" :src="message.audioUrl"/>
      <span>{{ message.audioText }}</span>
      <a-button type="text" @click="playClick">
        <sound-outlined/>
      </a-button>
    </div>
  </template>

</template>

<script setup lang="ts">
import {ref} from 'vue';

defineProps({
  message: {
    type: Object,
    required: true
  },
  className: {
    type: String,
    required: true
  }
})
const audioRef: any = ref(null)

const playClick = () => {
  if (audioRef.value) {
    audioRef.value.play()
  }
}


</script>
