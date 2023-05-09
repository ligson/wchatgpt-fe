<template>
  <a-layout class="x-main">
    <a-layout-header class="x-header">
      <div class="x-header-return" v-if="returnShow">
        <left-outlined @click="returnHandler"/>
      </div>
      <div class="x-header-title">{{ title }}</div>
      <div class="x-header-right">
        <slot name="header-right"></slot>
      </div>
    </a-layout-header>
    <a-layout-content class="x-content">
      <slot name="content"></slot>
    </a-layout-content>
    <a-layout-footer class="x-footer">
      <div class="x-footer-bar">
        <slot name="footer"></slot>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: false
  },
  returnShow: {
    type: Boolean,
    required: false,
    default: true
  }
})
const emit = defineEmits([
  "returnClick"
])
const returnHandler = () => {
  emit("returnClick")
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

.x-header-return,.x-header-right {
  width: 24px;
  height: 24px;
  line-height: 24px;
}
.x-header-title{
  flex: 1;
  text-align: center;
}

.x-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #F3F3F3;
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
  padding: 5px;
}


</style>
