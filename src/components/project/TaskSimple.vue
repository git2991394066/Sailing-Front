<template>
  <div id="task-simple">
    <h4>测试任务</h4>
    <el-table :data="tasks" border style="width: 100%">
      <el-table-column prop="name" label="任务名称" width="120" align="center">
      </el-table-column>
      <!-- fixed="right"  用于固定在行的右边-->
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showEdit(scope.row.id)"
            plain
            icon="el-icon-edit-outline"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as taskApi from "@/api/task";
export default {
  name: "TaskSimple",
  data() {
    return {
      tasks: [
        // { id: 1, name: "测试任务" }
      ],
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      this.getTasks();
    },
    getTasks() {
      taskApi
        .queryByProjectId(this.$store.getters.getCurrentProject.id)
        .then((result) => {
          let responseData = result.data;
          if (responseData.code == 0) {
            this.tasks = responseData.data;
            //触发事件，给父组件Project.vue传递数量
            this.$emit("callback", this.tasks.length);
          } else {
            console.log(responseData);
          }
        });
    },
  },
};
</script>