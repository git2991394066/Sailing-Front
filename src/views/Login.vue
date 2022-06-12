<template>
  <div id="login" class="login_context">
    <div class="login_box">
      <el-button
        type="warning"
        plain
        size="small"
        style="width: 20%; float: right; margin-top: 10px; margin-right: 10px"
        @click="$router.push('/register')"
        >注&nbsp;&nbsp;&nbsp;册</el-button
      >
      <div class="title">接口自动化测试平台</div>
      <!-- label-width是用占位的 -->
      <el-form
        ref="loginRef"
        class="login_from"
        :model="user"
        :rules="rulesLogin"
      >
        <!-- 账号密码输入框 -->
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="user.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="user.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-s-goods"
          ></el-input>
        </el-form-item>
        <el-form-item label="记住账号" size="mini">
          <el-switch v-model="status"></el-switch>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            size="medium"
            style="width: 100%"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as accountApi from "@/api/account";
import * as cookies from "@/util/cookies";
export default {
  name: "Login",
  data() {
    return {
      userResult: {},
      user: {},
      status: false,
      rulesLogin: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录用户名", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // //加载初始数据
    // this.login();
  },
  methods: {
    login() {
      // let user = { username: "admin", password: "123456" };
      accountApi.login(this.user).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          // this.userResult = responseData.data;
          // 登录成功
          // 1.提示
          this.$message({
            message: "登录成功",
            type: "success",
          });
          // 2.写登录成功cookie
          cookies.setCurrentUser(responseData.data);
          // 3.跳转到首页
          this.$router.push("/");
        } else {
          //登录失败，给出对应错误提示
          this.$message({
            message: responseData.message,
            type: "warning",
          });
          // console.log(responseData.message);
        }
      });
      //已经在util/request.js定义了通用的响应异常拦截了，使用通用能满足就不用新定义了
      // }).catch((err) => {

      // });
    },
  },
};
</script>

<style scoped>
.title {
  position: absolute;
  left: 50%;
  top: 12%;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #409eff;
}
.login_context {
  background: rgb(255, 255, 255);
  height: 100%;
}
.login_box {
  width: 620px;
  height: 420px;
  box-shadow: 0 0 10px rgb(21, 21, 90);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_from {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 5% 10%;
  box-sizing: border-box;
}

.btns {
  width: 100%;
  position: flex;
  float: right;
  justify-content: flex-end;
}
</style>
