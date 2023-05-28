<template>
  <page @returnClick="goBack" :title="name">
    <template v-slot:header-right>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <more-outlined style="color: #fff" />
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
      <div class="title">
        <img src="../../assets/chess.jpg" :style="{'max-height': winHeight,'max-width': winWidth,'margin-left': '10px'}"/>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <H2><a :href="proxy.$httpClient.getBaseUrl() + '/api/auth/downloadChess'">AI智能象棋App下载</a></H2>
      </div>
    </template>
    <template v-slot:footer> </template>
  </page>
</template>
  
  <script setup lang="tsx">

  import {defineComponent,getCurrentInstance} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import Page from '../../components/Page.vue'
  
  const router = useRouter();
  const route = useRoute();
  const {proxy} = getCurrentInstance() as any

  const winHeight = document.documentElement.clientHeight-200 + 'px';
  const winWidth = document.documentElement.clientWidth-40 + 'px';

  const name = route.query.username?.toString();

  defineComponent({
    components: {
      Page,
    },
  });

  const handleMenuClick = (e: any) => {
      if (e.key === 'refresh') {
          window.document.location.reload()
      } else if (e.key === 'clearMsg') {
      }
  }

  const goBack = () => {
    router.go(-1);
  };
  </script>
  
  <style scoped>

  .title {
    margin-top: 4px;
    text-align: center;
    font-size: 5px;
  }

  </style>
    