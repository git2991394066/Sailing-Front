<template>
  <div id="user-edit">
    <el-form ref="user" :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.username" placeholder="用输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" style="text-align: left">
        <el-input
          v-model="user.password"
          placeholder="用输入密码"
          v-if="!user.id"
        ></el-input>
        <el-button
          type="primary"
          @click="isShowReset = true"
          v-if="id && !isShowReset"
          >重置密码</el-button
        >
        <el-input
          v-model="resetPassword"
          placeholder="用输入密码"
          v-if="isShowReset"
        ></el-input>
        <el-button type="primary" @click="reset" v-if="isShowReset"
          >确定</el-button
        >
        <el-button @click="isShowReset = false" v-if="isShowReset"
          >取消</el-button
        >
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name" placeholder="用输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" placeholder="用输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.mobile" placeholder="用输入电话"></el-input>
      </el-form-item>
      <el-form-item label="角色" style="text-align: left">
        <el-checkbox-group v-model="user.roles">
          <el-checkbox label="admin">管理员</el-checkbox>
          <el-checkbox label="staff">普通员工</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="user.description"
          placeholder="用输入描述"
        ></el-input>
      </el-form-item>
    </el-form>
    {{ id }}
    <!-- 增加根据返回的后端结果，处理是否关闭弹窗。所以把这块放到组件里，添加对应逻辑  -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </div>
</template>
<script>
export default {
  name: "UserEdit",
  //vue文件通过props接收相应的数据做方法入参
  props: {
    id: Number,
  },
  data() {
    return {
      user: {
        // 非js基本类型属性需要设置初值
        roles: [],
      },
    };
  },
  methods: {
    //  通过子组件触发事件，来调用父组件内的方法

    //取消
    cancel() {
      this.$emit("callbackForCancel");
    },
    //保存
    save() {
      //保存成功，关闭父页面弹窗
      this.$emit("callbackForSave");
    },
  },
};
</script>