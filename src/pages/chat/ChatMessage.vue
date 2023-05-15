<template>
  <div class="chat-message">
    <audio :src="audioUrl"/>
    <span>{{ audioText }}</span>
    <a-button type="text" @click="playClick">
      <sound-outlined/>
    </a-button>
  </div>
</template>

<script setup lang="ts">

defineProps({
  audioUrl: {
    type: String
  },
  audioText: {
    type: String
  },
})

const emit = defineEmits([
  "playAudio"
])
const playClick = () => {
  emit("playAudio")
}


</script>

<style scoped>
.chat-message {
  display: inline-block;
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 4px 8px;
}
</style>
