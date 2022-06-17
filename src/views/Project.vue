<template>
  <div id="project">
    <!-- <h1>项目</h1>
    <h2>{{ $store.getters.getCurrentProject }}</h2> -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6"
          ><el-card>{{
            $store.getters.getCurrentProject.name
          }}</el-card></el-col
        >
        <el-col :span="6"
          ><el-card>{{ totalOfTask }}</el-card></el-col
        >
        <el-col :span="6"
          ><el-card>{{ totalOfModule }}</el-card></el-col
        >
        <el-col :span="6"
          ><el-card>{{ totalOfEnvironment }}</el-card></el-col
        >
      </el-row>
      <el-divider content-position="left">项目基本信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-card
            ><task-simple @callback="callbackOfTask"></task-simple></el-card
        ></el-col>
        <el-col :span="8"
          ><el-card><module @callback="callbackOfModule"></module></el-card
        ></el-col>
        <el-col :span="8"
          ><el-card
            ><environment
              @callback="callbackOfEnvironment"
            ></environment></el-card
        ></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Environment from "@/components/environment/Environment.vue";
import TaskSimple from "@/components/project/TaskSimple.vue";
import Module from "@/components/module/Module.vue";
export default {
  components: { TaskSimple, Module, Environment },
  name: "Project",
  data() {
    return {
      totalOfTask: 0,
      totalOfModule: 0,
      totalOfEnvironment: 0,
    };
  },
  methods: {
    //任务初始化时的数量回调
    callbackOfTask(total) {
      this.totalOfTask = total;
    },
    //模块组件回调
    callbackOfModule(total) {
      this.totalOfModule = total;
    },
    callbackOfEnvironment(total) {
      this.totalOfEnvironment = total;
    },
  },
};
</script>

<style scoped>
</style>