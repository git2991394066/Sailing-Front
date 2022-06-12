<template>
  <!-- <div id="sidebar">
    <router-link to="/user">用户信息</router-link> <br />
    <router-link to="/project">项目信息</router-link>
    {{ items }} -->
  <div id="sidebar">
    <!--菜单-->
    <el-menu
      class="sidebar-el-menu"
      :default-active="defaultActive"
      :collapse="$store.getters.getCollapse"
      background-color="#000"
      text-color="#fff"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <el-menu-item
          :index="item.index"
          :key="item.index"
          v-if="checkRight(item.roles)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
  <!-- </div> -->
</template>
<script>
import { menu } from "@/layout/menu";
export default {
  name: "Sidebar",
  data() {
    return {
      items: menu,
    };
  },
  computed: {
    //计算当前激活的菜单
    defaultActive() {
      let path = this.$route.path.toLowerCase();
      //如果是没有菜单的测试报告，使用其跳转进入的前置页面测试记录的路径
      if (path.toLowerCase() == "/testreport") {
        path = "/testrecord";
      }

      return path;
    },
  },
  methods: {
    checkRight(needRoles) {
      console.log(needRoles);
      return true;
    },
  },
};
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu {
  height: calc(100vh - 70px);
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh - 70px);
}
.sidebar > ul {
  height: 100%;
}
</style>