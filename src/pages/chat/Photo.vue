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
        <h1 class="flex justify-center">
          <span class="relative font-normal">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              class="w-full absolute fill-blue-300 mt-6"
            >
              <path
                d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
              ></path>
            </svg>
            模糊图片秒转高清图
          </span>
          <div class="text-center mt-4 text-gray-400 text-sm">
            基于深度学习技术对模糊图片秒级处理重建高清
          </div>
        </h1>
      </div>

      <div class="main-content" v-if="winWidth > 400">
        <div class="left-content">
          <div class="top-content">
            <div>
              <a-upload
                v-model:file-list="fileList"
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="uploadUrl"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <div>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </div>
          </div>
          <div class="down-content">
            <div>
              <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  alt="avatar"
                  style="height: 252px; width: 247px"
                />
            </div>
          </div>
        </div>
        <div class="rigit-content">
          <div>
            <img
                  v-if="qingImageUrl"
                  :src="qingImageUrl"
                  alt="avatar"
                  style="height: 400px; width: 400px"
                />
          </div>
        </div>
      </div>
      <div class="main-content" style="display:unset" v-else>
        <div>
          <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="avatar"
              style="height: 400px; width: 400px"
            />
        </div>

        <div>
          <img
                v-if="qingImageUrl"
                :src="qingImageUrl"
                alt="avatar"
                style="height: 400px; width: 400px"
              />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div></div>
      <div v-if="winWidth <= 400">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <div style="text-align: center;">
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
        <div></div>
    </template>
  </page>
</template>
  
  <script setup lang="tsx">

  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import {defineComponent, getCurrentInstance, ref} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import Page from '../../components/Page.vue'
  
  const router = useRouter();
  const route = useRoute();
  const {proxy} = getCurrentInstance() as any

  
  const name = route.query.username?.toString();

  const winWidth = document.documentElement.clientWidth-40;


interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined,
    Page,
  },
});

    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>('');
    let qingImageUrl = ref<string>('');

    const uploadUrl = ()=>{
      return proxy.$httpClient.getBaseUrl() + "/api/auth/uploadPhoto"
    }

    const handleChange = (info: FileInfo) => {
      if (info.file.status === 'uploading') {
        loading.value = true;
        return;
      }
      
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        qingImageUrl.value = info.file.response + '';
        getBase64(info.file.originFileObj, (base64Url: string) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }
      if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
      }
    };

    const beforeUpload = (file: FileItem) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };

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
.chat-message {
  display: inline-block;
  background-color: #ffffff;
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

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.font-normal {
  font-weight: 400;
}

.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-text-opacity));
}

.title {
  height: 100px;
  margin-top: 4px;
  text-align: center;
  font-size: 5px;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.w-full {
  width: 100%;
}

.fill-blue-300 {
  fill: rgba(147, 197, 253);
}

.mt-6 {
  margin-top: 25px;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.mt-4 {
  margin-top: 30px;
}

.main-content {
  display: flex;
  justify-content: center;
}

.top-content {
  text-align: center;
  padding: 18px;
}


</style>
  