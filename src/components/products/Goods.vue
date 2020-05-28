<template>
  <div class="goods">
    <el-button type="success" @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodList" width="100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let {
        meta: { status },
        data: { total, goods }
      } = res
      if (status === 200) {
        this.total = total
        this.goodList = goods
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.currentPage = 1
      this.getGoodList()
    },
    // 自定义列的索引
    indexMethod(index) {
      // console.log(index)
      // 加上之前所有页的条数
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>
</style>
