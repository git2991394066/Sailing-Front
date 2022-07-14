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
    <div
      class="content-box"
      :class="{ 'content-collapse': $store.getters.getCollapse }"
    >
      <tags></tags>
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
import Tags from "./Tags.vue";
export default {
  name: "layout",
  components: {
    Headbar,
    Sidebar,
    Tags,
  },
  data() {
    return {
      // tagsList: [],
    };
  },
  computed: {
    tagsList() {
      //需要缓存的页面
      let needCacheRouters = ["TestCase"];
      //返回全局状态快捷标签的名称，与组件export中name一致时，当router-view中使用include包含，将会缓存页面
      return this.$store.getters.getTagsList
        .filter((item) => needCacheRouters.indexOf(item.name) >= 0)
        .map((item) => item.name);
    },
  },
};
</script>
<style scoped>
</style>