<template>
  <div class="goods-add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
           <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
           <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
           <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
             <el-cascader
              :options="options"
              :props="props"
              v-model="addForm.goods_cat">
            </el-cascader>
          </el-form-item>
           <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>

          <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- action:指定图片上传的地址 -->
        <!-- headers: 上传图片的请求头 -->
        <!-- on-success:图片上传成功会执行的钩子函数 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type='primary' @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        pics: [],
        goods_introduce: ''
      },
      // 所有的分类数据
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 上传图片需要设置token
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    handleClick(tab) {
      // 设置active的值
      this.active = +tab.index
    },
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    handleSuccess(res, file, fileList) {
      let {
        meta: { status },
        data: { tmp_path: tmpPath }
      } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpPath
        })
      }
    },
    async addGood() {
      // this.addForm.goods_cat = this.addForm.goods_cat.join()
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      let {
        meta: { status }
      } = res
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('恭喜你，添加成功')
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
// 如果你希望 scoped 样式中的一个选择器能够作用得“更深",能够影响到子组件
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
