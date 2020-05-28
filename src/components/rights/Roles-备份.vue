<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/roles">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" width="100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 暂无权限的提示 -->
          <el-row v-if="scope.row.children.length === 0">
            暂无权限
          </el-row>
          <!-- 放一级权限 -->
          <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag @close="deleteRight(scope.row, level1.id)" closable>{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 放二级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, level2.id)" closable type="success">{{level2.authName}}</el-tag>
                </el-col>
                <!-- 放三级权限 -->
                <el-col :span="20">
                  <!-- scope.row指定就是当前角色 -->
                  <el-tag  @close="deleteRight(scope.row, level3.id)" class="level3" closable type="danger" v-for="level3 in level2.children" :key="level3.id">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="showAssignRight(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <!-- 权限的树形结构 数组 队列 栈 tree -->
      <el-tree
         ref="tree"
         :data="rightList"
         :props="defaultProps"
         show-checkbox
         default-expand-all
         node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" :rules="rules" label-width="80px" ref="editForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      // 控制分配权限对话框
      assignDialogVisible: false,
      rightList: [],
      // 指定默认的属性名字
      defaultProps: {
        children: 'children',
        // 设置用于显示的名字对应的属性名
        label: 'authName'
      },
      // 角色id
      roleId: '',
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单的校验规则
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
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
    async getRightList() {
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    async deleteRight(role, rightId) {
      console.log(role, rightId)
      // 发送ajax请求
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      // data: 当前角色修改后所拥有的权限
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        // this.getRoleList()
        // 只更新了当前角色的children，当前角色权限
        role.children = data
        this.$message.success('恭喜你，删除成功')
      }
    },
    // 显示分配权限的对话框
    showAssignRight(role) {
      // console.log(role)
      // 把修改的角色id存起来
      this.roleId = role.id
      // 获取所有的权限信息
      this.getRightList()
      // 展示对话框
      this.assignDialogVisible = true
      // 显示了对话框的时候，属性菜单还没有渲染
      this.$nextTick(() => {
        // console.log(this.$refs.tree)
        // 获取到当前角色拥有的所有的3级权限？？？？
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              // 把3级的id存起来
              temp.push(l3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight() {
      // 先获取到所有全选中id值
      let checked = this.$refs.tree.getCheckedKeys()
      // 获取到所有半选中的id
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      // ... 扩展运算符，展开一个数组或者对象
      let all = [...checked, ...halfChecked]
      // 发送ajax请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: all.join()
      })
      if (res.meta.status === 200) {
        this.assignDialogVisible = false
        // 重新渲染
        this.getRoleList()
      }
    },
    // 删除角色
    async deleteRole({ id }) {
      try {
        await this.$confirm('你确定要删除这个角色吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送ajax请求删除角色
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.$message.success('恭喜你，删除成功了')
          // 重新渲染
          this.getRoleList()
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    // 显示添加的对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    addRole() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let res = await this.axios.post(`roles`, this.addForm)
        if (res.meta.status === 201) {
          // 1. 重置表单
          this.$refs.addForm.resetFields()
          // 2. 隐藏模态框
          this.addDialogVisible = false
          // 3. 重新渲染
          this.getRoleList()
          // 4. 提示成功
          this.$message.success('恭喜你，添加成功')
        }
      })
    },
    // 显示修改对话框
    showEditDialog({ id, roleName, roleDesc }) {
      // 弹出模态框
      this.editDialogVisible = true
      this.editForm = {
        id,
        roleName,
        roleDesc
      }
    },
    editRole() {
      // 表单校验
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let res = await this.axios.put(
          `roles/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status === 200) {
          // 1. 重置表单
          this.$refs.editForm.resetFields()
          // 2. 隐藏模态框
          this.editDialogVisible = false
          // 3. 重新渲染
          this.getRoleList()
          // 4. 提示成功
          this.$message.success('恭喜你，修改成功')
        }
      })
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}

.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
