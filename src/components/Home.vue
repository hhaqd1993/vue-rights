<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click="logout">退出</a>
      </div>
       <h1 class="title">电商后台管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- el-menu: 菜单组件 -->
        <!-- default-active：默认选中的菜单 -->
        <!-- el-submenu: 子菜单 -->
        <!-- template：表示子菜单的内容 -->
        <!-- el-menu-item-group： 子菜单的分组 -->
        <!-- el-menu-item：菜单项  -->
        <!-- unique-opened：最多只能打开一个子菜单 -->
        <!-- router:开启了路由模式， 当我们点击导航的时候，会发生路由的跳转, 跳转到index对应的路径 -->
        <el-menu
          :default-active="$route.path.slice(1).split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <!-- 放菜单项 -->
            <el-menu-item v-for="item in menu.children" :index="item.path" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 配置了子路由的出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出
    async logout() {
      try {
        // 弹出模块框
        // 参数1： 提示内容
        // 参数2： 提示标题
        await this.$confirm('你确定要退出系统吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 成功了
        // 点击确认按钮
        // 删除token
        localStorage.removeItem('token')
        // 跳转到login组件
        this.$router.push('/login')
        // 提示退出成功
        this.$message.success('退出成功了')
      } catch (e) {
        this.$message.error('取消删除')
      }
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) {
      this.menuList = data
    }
    // console.log(res)
  }
}
</script>

<style lang="less" scoped>
// 如果给style添加scoped属性，样式只会在当前组件生效
// 实现原理： 如果给当前组件的style添加了scoped,,,,把当前组件中所有的div都增加一个随机的属性
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;

    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background-image: url('../assets/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: darkorange;
      }
    }

    .title {
      height: 60px;
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      color: #fff;
      font-size: 30px;
    }
  }
  .el-aside {
    background-color: #545c64;

    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
