<template>
  <a-space>
    <a-button @click="addClick">
      <template #icon>
        <user-add-outlined/>
      </template>
      新增
    </a-button>
    <a-button @click="deleteClick">
      <template #icon>
        <user-delete-outlined/>
      </template>
      删除
    </a-button>
    <a-button @click="resetPwdClick">
      <template #icon>
        <edit-outlined/>
      </template>
      重置密码
    </a-button>
    <a-button @click="modifyUserLevelClick">
      <template #icon>
        <edit-outlined/>
      </template>
      修改用户等级
    </a-button>
    <a-button @click="modifyUserTypeClick">
      <template #icon>
        <edit-outlined/>
      </template>
      修改用户类型
    </a-button>
    <a-button @click="modifyUserTimesClick">
      <template #icon>
        <edit-outlined/>
      </template>
      修改用户次数
    </a-button>

  </a-space>
  <a-table bordered :data-source="dataSource"
           :pagination="pageConfig"
           @change="pageChange"
           :loading="loading"
           :row-key="'id'"
           :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange }"
           :columns="columns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'level'">
        {{ record.level === 'FREE' ? '免费' : '付费' }}
      </template>
      <template v-else-if="column.dataIndex === 'userType'">
        {{ record.userType === 'NORMAL' ? '普通用户' : '管理员' }}
      </template>
    </template>
  </a-table>
  <add-dlg ref="addDlgRef" @success="query"></add-dlg>
  <reset-pwd-dlg ref="resetPwdDlgRef" :user-id="userId"></reset-pwd-dlg>
  <modify-user-level-dlg ref="modifyUserLevelDlgRef" :user-id="userId" :level="userLevel"
                         @success="query"></modify-user-level-dlg>
  <modify-user-times-dlg ref="modifyUserTimesDlgRef" :user-id="userId" :times="userTimes"
                         @success="query"></modify-user-times-dlg>
  <modify-user-type-dlg ref="modifyUserTypeDlgRef" :user-id="userId" :user-type="userType"
                        @success="query"></modify-user-type-dlg>
</template>

<script setup lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref} from "vue";
import AddDlg from "./AddDlg.vue";
import ModifyUserLevelDlg from "./ModifyUserLevelDlg.vue";
import ModifyUserTypeDlg from "./ModifyUserTypeDlg.vue";
import ModifyUserTimesDlg from "./ModifyUserTimesDlg.vue";
import ResetPwdDlg from "./ResetPwdDlg.vue";

defineComponent({
  AddDlg, ModifyUserLevelDlg, ModifyUserTypeDlg, ModifyUserTimesDlg, ResetPwdDlg
})
const {proxy} = getCurrentInstance() as any
const httpClient = proxy.$httpClient
const addDlgRef: any = ref(null)
const resetPwdDlgRef: any = ref(null)
const modifyUserLevelDlgRef: any = ref(null)
const modifyUserTimesDlgRef: any = ref(null)
const modifyUserTypeDlgRef: any = ref(null)
const userId = ref("")
const userLevel = ref("")
const userTimes = ref("")
const userType = ref("")

const columns = ref([
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '级别',
    dataIndex: 'level'
  },
  {
    title: '类型',
    dataIndex: 'userType'
  },
  {
    title: '次数',
    dataIndex: 'times'
  },
  {
    title: '注册时间',
    dataIndex: 'createdTime'
  },
  {
    title: '上次登录时间',
    dataIndex: 'lastedLoginTime'
  },
])
const dataSource: any = ref([])
const pageConfig = reactive({
  current: 1,
  defaultPageSize: 10,
  pageSize: 10,
  sort: 'name',
  order: 'asc',
  total: 0,
  showSizeChanger: true,
  showTotal: (total: any, range: any) => {
    console.log(range)
    return "共" + total + "条记录"
  },
  showSizeChange: (current: number, size: number) => {
    pageConfig.pageSize = size
    pageConfig.current = current
  }
})

const pageChange = (page: any) => {
  //{"current":2,"pageSize":10,"total":138,"showSizeChanger":true}
  console.log(JSON.stringify(page))
  pageConfig.pageSize = page.pageSize;
  pageConfig.current = page.current;
  query()
}

const loading = ref(false)

const query = () => {
  dataSource.value = [];
  loading.value = true
  selectedRowKeys.value = []
  httpClient.post("/api/admin/usermgr/list", {
    page: pageConfig.current,
    max: pageConfig.pageSize,
    sort: pageConfig.sort,
    order: pageConfig.order
  }).then((data: any) => {
    let datas = data.datas
    for (let i = 0; i < datas.length; i++) {
      dataSource.value.push(datas[i])
    }
    dataSource.value = [...dataSource.value];
    pageConfig.total = data.total
    loading.value = false
  }).catch((e: any) => {
    loading.value = false
    proxy.$dlg.error(e)
  })
}
const selectedRows: any = ref([])
const selectedRowKeys: any = ref([])
const onSelectChange = (currentSelectedRowKeys: string[], currentSelectedRows: any[]) => {
  console.log("===" + currentSelectedRowKeys + "===" + currentSelectedRows)
  //selectedRowKeys.value = currentSelectedRowKeys;
  if (currentSelectedRows.length == 0) {
    selectedRowKeys.value = []
  } else {
    selectedRowKeys.value = []
    for (let i = 0; i < currentSelectedRows.length; i++) {
      selectedRowKeys.value.push(currentSelectedRows[i].id)
    }
    selectedRowKeys.value = [...selectedRowKeys.value]
  }
  console.log(selectedRowKeys.value)
  selectedRows.value = currentSelectedRows
}

const addClick = () => {
  if (addDlgRef.value) {
    addDlgRef.value.openDlg()
  }
}
const deleteClick = () => {
  if (selectedRows.value.length !== 1) {
    proxy.$dlg.error("请选中一条数据")
    return
  }
  userId.value = selectedRowKeys.value[0]
  httpClient.post("/api/admin/usermgr/delete", {id: userId.value}).then(() => {
    proxy.$dlg.info("删除成功")
    query()
  }).catch((e: any) => {
    proxy.$dlg.error(e)
  })
}
const resetPwdClick = () => {
  if (selectedRows.value.length !== 1) {
    proxy.$dlg.error("请选中一条数据")
    return
  }
  userId.value = selectedRowKeys.value[0]
  if (resetPwdDlgRef.value) {
    resetPwdDlgRef.value.openDlg()
  }
}
const modifyUserLevelClick = () => {
  if (selectedRows.value.length !== 1) {
    proxy.$dlg.error("请选中一条数据")
    return
  }
  if (modifyUserLevelDlgRef.value) {
    modifyUserLevelDlgRef.value.openDlg()
  }
}
const modifyUserTypeClick = () => {
  if (selectedRows.value.length !== 1) {
    proxy.$dlg.error("请选中一条数据")
    return
  }
  if (modifyUserTypeDlgRef.value) {
    modifyUserTypeDlgRef.value.openDlg()
  }
}
const modifyUserTimesClick = () => {
  if (selectedRows.value.length !== 1) {
    proxy.$dlg.error("请选中一条数据")
    return
  }
  if (modifyUserTimesDlgRef.value) {
    modifyUserTimesDlgRef.value.openDlg()
  }
}
onMounted(() => {
  query()
})
</script>

<style scoped>

</style>
