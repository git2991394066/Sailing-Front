<template>
  <div id="layout">
    <!-- 头部 -->
    <!-- <header>头部</header> -->
    <!-- 左侧 -->
    <!-- <aside style="float: left">
      <router-link to="/user">用户信息</router-link> <br />
      <router-link to="/project">项目信息</router-link>
    </aside> -->
    <!-- 中间内容 -->
    <!-- <section><router-view></router-view></section> -->

    <!-- 头部 -->
    <headbar></headbar>
    <!-- 左侧 -->
    <sidebar></sidebar>
    <div class="content-box">
      <!-- <tags></tags> -->
      <div class="content">
        <transition name="move" mode="out-in">
          <!-- keep-alive 用于切换页面时，缓存页面编辑中的数据，再次返回界面数据还在 -->
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
      </div>
    </div>
  </div>
</template>
<script>
import Headbar from "@/layout/Headbar.vue";
import Sidebar from "@/layout/Sidebar.vue";
export default {
  name: "layout",
  components: {
    Headbar,
    Sidebar,
  },
  data() {
    return {
      tagsList: [],
    };
  },
};
</script>
<style scoped>
</style>