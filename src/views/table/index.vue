<template>
  <div class="table-container">
    <h1>Table</h1>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template v-slot="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template v-slot="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template v-slot="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="list && list.length > 0"
      layout="total, prev, pager, next"
      background
      :total="pageTotal"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentPageChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getList } from '@/api/table'

@Component({
  name: 'Table',
  filters: {
    statusFilter(status: string) {
      const statusMap: { [propName: string]: string } = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  }
})
export default class extends Vue {
  private list: Array<any> = []
  private listLoading: boolean = true
  private pageTotal: number = 100
  private pageSize: number = 20
  private currentPage: number = 1

  private created() {
    this.fetchData()
  }

  private fetchData() {
    this.listLoading = true
    getList().then(response => {
      this.list = response.data.items
      this.listLoading = false
    })
  }

  private handleCurrentPageChange(val: number) {
    console.log(val)
  }
}
</script>

<style lang="scss" scoped>
.table-container{
  padding: 20px;
  overflow: hidden;
  box-sizing: border-box;
  h1 {
    margin-bottom: 20px;
  }
  .el-pagination {
    float: right;
    margin-top: 20px;
  }
}
</style>
