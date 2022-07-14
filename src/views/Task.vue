<template>
  <div class="task">
    <el-card class="box-card" style="height: 100%">
      <el-card
        shadow="hover"
        :body-style="{ padding: '0px' }"
        style="border-bottom: solid #eff7ff 3px; height: 100%"
      >
        <div class="grid-content grid-con-1">
          <span class="grid-con-icon">任务管理</span>
          <div class="grid-cont-right">
            <el-row :gutter="20">
              <el-col :span="5"
                ><div style="line-height: 2.5rem">任务名称</div>
              </el-col>
              <el-col :span="15">
                <el-input
                  v-model="search.name"
                  autocomplete="off"
                  placeholder="请输入任务名称"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <div class="grid-cont-right">
                  <!-- 添加项目的按钮 -->
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="getTasks"
                    plain
                  >
                    查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="grid-cont-right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showEdit(null)"
              plain
              >创建任务
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px">
        <!-- 任务列表 -->
        <span slot="label"><i class="el-icon-tickets"></i> 任务列表</span>
        <!-- 任务展示表格 -->
        <el-table
          :data="tasks"
          style="width: 100%; margin-top: 20px"
          size="mini"
          ref="table"
          row-key="id"
          :expand-row-keys="expandRowKeys"
        >
          <el-table-column
            type="index"
            label="序号"
            min-width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            min-width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="manual" label="关联模块" min-width="300">
            <template slot-scope="scope">
              <el-tag
                type="info"
                v-for="module in scope.row.modules"
                :key="module.id"
                style="margin-right: 2px"
                >{{ module.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="manual"
            label="是否已归档"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isArchive == true ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="manual"
            label="运行任务"
            min-width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="scope.row.isArchive == false"
                @click="showRun(scope.row)"
                type="success"
                plain
                icon="el-icon-caret-right"
                >运行
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="manual" label="操作" min-width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.isArchive == false"
                @click="showEdit(scope.row.id)"
                plain
                icon="el-icon-edit-outline"
                >编辑</el-button
              >
              <el-button
                type="info"
                size="mini"
                v-if="scope.row.isArchive == false"
                @click="archive(scope.row.id)"
                icon="el-icon-info"
                plain
                >归档
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="remove(scope.row.id)"
                icon="el-icon-delete"
                plain
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="margin-top: 10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="search.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </el-card>
    <!--测试任务编辑对话框-->
    <el-dialog
      :visible.sync="editVisible"
      :title="currentId ? '编辑任务' : '创建任务'"
      center
    >
      <task-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></task-edit>
    </el-dialog>
    <!--运行对话框-->
    <el-dialog :visible.sync="editVisibleForRun" title="运行任务" center>
      <task-run
        :task="currentTask"
        @callbackForSave="callbackForSaveForRun"
        @callbackForCancel="callbackForCancelForRun"
        v-if="editVisibleForRun"
      ></task-run>
    </el-dialog>
  </div>
</template>

<script>
import TaskEdit from "@/components/task/TaskEdit";
import TaskRun from "@/components/task/TaskRun";
import * as taskApi from "@/api/task";
import * as environmentApi from "@/api/environment";

export default {
  name: "Task",
  components: {
    TaskEdit,
    TaskRun,
  },
  data() {
    return {
      editVisible: false,
      editVisibleForRun: false,
      total: 0,
      tasks: [],
      search: {
        pageIndex: 1,
        pageSize: 10,
      },
      currentId: null,
      currentTask: {},
      currentJobId: null,
      currentTaskIdForJob: null,
      //展开定时执行信息的数组
      expandRowKeys: [],
      environments: [],
    };
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentProject;
    },
  },
  created() {
    //获取初始化数据
    this.getInitData();
  },
  methods: {
    //获取初始化数据
    async getInitData() {
      await this.getAllEnvironment();
      await this.getTasks();
    },
    //获取所有项目环境
    async getAllEnvironment() {
      await environmentApi
        .queryByProjectId(this.project.id)
        .then((response) => {
          let result = response.data;
          this.environments = result.data;
        });
    },
    //获取任务
    async getTasks() {
      this.search.projectId = this.project.id;
      await taskApi.query(this.search).then((response) => {
        let result = response.data;
        this.tasks = result.data;
        this.total = result.total;

        //将有job的任务展开定时任务信息
        this.expandRowKeys = this.tasks
          .filter((item) => item.isJob == true)
          .map((item) => {
            return item.id;
          });
      });
    },
    //获取Job状态名称
    getJobStatusName(status) {
      let statusName = "未定义";
      switch (status) {
        case 0:
          statusName = "草稿";
          break;
        case 1:
          statusName = "启动中";
          break;
        case 2:
          statusName = "已停止";
          break;
      }
      return statusName;
    },
    //获取当前项目环境信息
    getEnvironmentName(environmentId) {
      let environmentName = environmentId;
      let environments = this.environments.filter((item) => {
        return item.id == environmentId;
      });
      if (environments && environments.length > 0) {
        environmentName = environments[0].name;
      }

      return environmentName;
    },

    //显示详情弹窗
    showEdit(id) {
      //设置传递的id
      this.currentId = id;
      //显示弹出对话框
      this.editVisible = true;
    },
    //隐藏用户详情弹窗
    hideEdit() {
      this.editVisible = false;
    },
    //保存成功回调
    callbackForSave() {
      //隐藏弹窗
      this.hideEdit();
      //重新获取数据列表
      this.getTasks();
    },
    //取消回调
    callbackForCancel() {
      //隐藏弹窗
      this.hideEdit();
    },

    //显示运行任务弹窗
    showRun(task) {
      //设置传递的id
      this.currentTask = task;
      //显示弹出对话框
      this.editVisibleForRun = true;
    },
    //隐藏运行任务弹窗
    hideRun() {
      this.editVisibleForRun = false;
    },
    //保存成功回调
    callbackForSaveForRun() {
      //隐藏弹窗
      this.hideRun();
    },
    //取消回调
    callbackForCancelForRun() {
      //隐藏弹窗
      this.hideRun();
    },

    //归档
    archive(id) {
      this.$confirm(
        "确定归档吗？归档后，任务将不能添加测试套件和测试用例，也不能再运行！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          taskApi.archive(id).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                message: "归档成功。",
                type: "success",
              });
              //重新加载数据
              this.getTasks();
            } else {
              this.$message({
                message: response.data.message,
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消归档",
          });
        });
    },
    //删除
    remove(id) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskApi.remove(id).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                message: "删除成功。",
                type: "success",
              });
              //重新加载数据
              this.getTasks();
            } else {
              this.$message({
                message: response.data.message,
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getTasks();
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val;
      this.getTasks();
    },
  },
};
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}

.grid-cont-right {
  flex: 1;
  font-size: 16px;
  color: #000;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
}

.grid-con-icon {
  font-size: 24px;
  width: 400px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #409eff;
  font-weight: bold;
}

.grid-con-1 .grid-con-icon {
  background: #eff7ff;
}
</style>
