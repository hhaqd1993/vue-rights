<template>
  <div class="categories">
    <el-button type="success" @click="showAddDialog">添加分类</el-button>
    <el-table
      v-loading="loading"
      :data="categoryList"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      width="100%">
      <!-- childKey: 指定子元素集合的属性名，默认值是children -->
      <!-- tree-key: 每个节点的唯一标识 默认值  id   cat_id -->
      <!-- parent-key： 指定当前节点的父节点， 如果不指定，没法收起来 -->
      <!-- level-key: 指定节点的层级 -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20"
      >
      </el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delCategory(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addForm" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            :props="props"
            v-model="addForm.cat_pid"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      options: [],
      // 级联菜单的属性配置
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    async showAddDialog() {
      this.addDialogVisible = true

      // 获取分类的数据，获取2级
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          // 注意点：所有一级分类的pid都是0
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        let {
          meta: { status }
        } = res
        if (status === 201) {
          // 创建成功
          this.getCategoryList()
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.$message.success('恭喜你，添加分类成功了')
        }
      })
    },
    async delCategory(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${id}`)
        if (res.meta.status === 200) {
          this.getCategoryList()
          this.$message.success('删除功能')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
