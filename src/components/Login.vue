<template>
  <div class="login">
    <!-- el-form: 表单组件 -->
    <!-- :model="form" form对象用来收集表单中所有的数据 -->
    <!-- label-width：设置label的宽度 -->
    <!-- el-form-item：表单项 -->
    <!-- rules: 设置校验的规则 给每一个el-form-item设置一个prop属性 v-model的值一样 -->
    <el-form :model="form" ref="form" status-icon :rules="rules" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// shift + tab : 往前按了一下tab
// 引入axios
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 对username进行校验
        username: [
          // 必填项
          { required: true, message: '用户名不能为空', trigger: 'change' },
          // 校验长度
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          // 校验长度
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    reset() {
      // 获取到表单组件，调用resetFields
      this.$refs.form.resetFields()
    },
    // 登录
    login() {
      // await所在的函数必须使用async修饰
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          // console.log('校验通过了')
          let res = await axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          })
          console.log(res)
          if (res.meta.status === 200) {
            // 登录成功
            this.$message.success('登录成功')
            // 存储token
            localStorage.setItem('token', res.data.token)
            // 跳转到Home组件
            this.$router.push('/home')
          } else {
            // 登录失败
            // this.$message(res.data.meta.msg)
            // this.$message({
            //   message: res.data.meta.msg,
            //   type: 'error'
            // })
            this.$message.error(res.meta.msg)
          }
        } else {
          // 校验没通过
          console.log('没通过')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*
  vue脚手架给我们配置了less的配置，但是并没有安装less 和 less-loader
  yarn add less less-loader -D
*/
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -80px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button + .el-button {
      margin-left: 70px;
    }
  }
}
</style>
