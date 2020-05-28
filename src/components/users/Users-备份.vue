<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <!-- 搜索框功能 -->
    <!-- 表格展示功能 -->
    <!-- el-table:表格组件 -->
    <!-- :data="tableData": 需要给表格组件传递数据 -->
    <!-- el-table-column：表格的一列 -->
    <!-- label：表格这一列的标题 -->
    <!-- prop： 这一列对应的数据的属性名 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 自定义这一列的内容，必须指定template -->
        <template slot-scope="scope">

          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <!-- page-size控制每页的条数 -->
    <!-- background: 按钮有背景色 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      background
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 查询关键字
      query: '',
      // 当前页
      currentPage: 1,
      // 每页显示的条数
      pageSize: 2,
      // 总的条数
      total: 0,
      // 用户的列表数据
      userList: []
    }
  },
  methods: {
    // 获取用户列表信息
    getUserList() {
      // 发送ajax请求，获取用户列表数据
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    handleCurrentChange(val) {
      // val就是当前页
      // console.log(val)
      // 修改当前页
      this.currentPage = val
      // 重新发送ajax请求获取数据
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
</style>
