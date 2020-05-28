<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框功能 -->
    <div>
      <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddDialog">用户添加</el-button>
    </div>
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 自定义这一列的内容，必须指定template -->
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <!-- current-change： 当页面发生改变的时候 -->
    <!-- size-change: 当每页的条数发生改变的时候 -->
    <!-- current-page:显示当前页 -->
    <!-- page-size:每页显示的条数 -->
    <!-- total:总条数 -->
    <!-- layout:控制分页的子组件的显示 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[2, 4, 6, 8]"
      background
      layout="total, sizes, prev, pager, next, jumper"
     >
    </el-pagination>

    <!-- 添加用户的对话框 -->
    <!-- el-dialog: 对话框组件 -->
    <!-- :visible:控制对话框的显示 -->
    <!-- width: 设置对话框的宽度 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 添加用户的表单 -->
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="请输入电话" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="请输入电话" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%">
      <el-form ref="assignForm" :rules="rules" :model="assignForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" prop="rid">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// const BASE_URL = 'http://localhost:8888/api/private/v1/'
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
      userList: [],
      // 控制添加用户的对话框的显示， false
      addDialogVisible: false,
      // 收集添加用户的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单的校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        rid: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      // 控制编辑用户的数据
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      // 角色列表
      roleList: []
    }
  },
  methods: {
    // 获取所有的角色列表信息
    async getRoleList() {
      let res = await this.axios.get('roles')
      // console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 获取用户列表信息
    async getUserList() {
      // 发送ajax请求，获取用户列表数据
      let res = await this.axios({
        method: 'get',
        // baseURL: BASE_URL,
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    handleCurrentChange(val) {
      // val就是当前页
      // console.log(val)
      // 修改当前页
      this.currentPage = val
      // 重新发送ajax请求获取数据
      this.getUserList()
    },
    // 每页条数发生改变
    handleSizeChange(val) {
      console.log(val)
      // 改变每页条数的时候，需不需要把页码改成1
      this.currentPage = 1
      this.pageSize = val
      // 重新渲染
      this.getUserList()
    },
    // 搜索功能
    search() {
      // 搜索需要把当前改成1
      this.currentPage = 1
      this.getUserList()
    },
    // 删除用户
    async delUser(id) {
      try {
        // console.log(id)
        await this.$confirm('你确定要删除这个用户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          // baseURL: BASE_URL,
          url: `users/${id}`
        })
        if (res.meta.status === 200) {
          // 1. 重新渲染
          if (this.userList.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          // 2. 提示删除成功,  问题：如果当前页只有一条数据的时候，页码值-1
          this.$message.success('删除成功了')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    // 修改用户的状态
    async changeState({ id, mg_state: mgState }) {
      // 发送ajax请求
      let res = await this.axios({
        // baseURL: BASE_URL,
        url: `users/${id}/state/${mgState}`,
        method: 'put'
      })
      if (res.meta.status === 200) {
        this.$message.success('修改状态成功了')
      } else {
        this.$message.error('修改状态失败了')
      }
    },
    // 显示添加的对话框
    showAddDialog() {
      // 显示对话框
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 成功
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        let {
          meta: { status }
        } = res
        if (status === 201) {
          // 重新渲染最后一页
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          // 重新渲染
          this.getUserList()
          // 隐藏模块框
          this.addDialogVisible = false
          // 清空表单
          this.$refs.addForm.resetFields()
        }
      })
    },
    // 显示修改用户对话框
    showEditDialog(user) {
      this.editDialogVisible = true
      // 让数据回显, 把user中的值赋值editForm中
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 修改用户
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let {
          meta: { status }
        } = res
        if (status === 200) {
          this.getUserList()
          // 重置
          this.$refs.editForm.resetFields()
          // 隐藏
          this.editDialogVisible = false
        }
      })
    },
    async showAssignDialog(role) {
      console.log(role)
      // 显示分配的对话框
      this.assignDialogVisible = true

      this.assignForm.id = role.id
      this.assignForm.username = role.username
      // 回显分配的数据, 回显角色id值
      // 要根据用户的id获取角色的id
      let res = await this.axios.get(`users/${role.id}`)
      let {
        meta: { status },
        data: { rid }
      } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
      // 获取角色列表
      this.getRoleList()
    },
    assignRole() {
      // 表单校验
      this.$refs.assignForm.validate(async valid => {
        if (!valid) return false
        let { id, rid } = this.assignForm
        let res = await this.axios.put(`users/${id}/role`, {
          rid
        })
        if (res.meta.status === 200) {
          this.assignDialogVisible = false
          this.$refs.assignForm.resetFields()
          this.getUserList()
          this.$message.success('恭喜你，分配角色成功')
        }
      })
    }
  },
  created() {
    // this.$router : 整个路由对象  routes
    // this.$route : 表示的是当前路由
    // console.log(this.$route.params)
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 400px;
  margin-bottom: 10px;
}
</style>
