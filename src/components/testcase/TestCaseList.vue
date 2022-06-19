<template>
  <div id="test-case-list">
    <h4 style="text-align: center">用例管理</h4>
    <el-menu default-active="2" class="el-menu-vertical-demo">
      <el-submenu
        :index="task.id + ''"
        v-for="task in taskDetails"
        :key="task.id"
      >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ task.name }}</span>
        </template>
        <el-submenu
          :index="task.id + '-' + testSuit.id"
          v-for="testSuit in task.testSuits"
          :key="testSuit.id"
        >
          <template slot="title">{{ testSuit.name }}</template>
          <el-menu-item
            :index="task.id + '-' + testSuit.id + '-' + testCase.id"
            v-for="testCase in testSuit.testCases"
            :key="testCase.id"
            @click="selectTestCase(testCase)"
            ><el-tooltip
              v-if="testCase.name.length > 17"
              :content="testCase.name"
              placement="right"
              effect="light"
            >
              <span>{{
                testCase.name.length > 17
                  ? testCase.name.substr(0, 17) + "..."
                  : testCase.name
              }}</span>
            </el-tooltip>
            <span v-else>{{ testCase.name }}</span>
            <span>
              <el-button
                type="text"
                icon="el-icon-document-copy"
                @click.stop="setCopyTestCase(testCase)"
                style="margin-bottom: 5px"
              ></el-button>
            </span>
          </el-menu-item>

          <!-- 添加用例 -->
          <el-menu-item>
            <template>
              <el-button
                type="text"
                @click.stop="showAddForTestCase(testSuit.id, task.id)"
              >
                <i
                  class="el-icon-folder-add"
                  style="color: #67c23a; font-size: 14px"
                >
                  添加用例
                </i>
              </el-button>
              <el-button
                type="text"
                @click.stop="pasteTestCase(testSuit, task)"
                v-if="copyTestCase"
                style="margin-left: 60px"
              >
                <i
                  class="el-icon-printer"
                  style="color: #67c23a; font-size: 14px"
                >
                  粘贴用例
                </i>
              </el-button>
            </template>
          </el-menu-item>
        </el-submenu>
        <!-- 添加测试套件 -->
        <el-menu-item @click="showEditForTestSuit(null, task.id)">
          <template slot="title">
            <div>
              <i
                class="el-icon-folder-add"
                style="color: #67c23a; font-size: 18px"
              >
                <span style="font-size: 14px"> 添加套件</span></i
              >
            </div>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <!--编辑测试套件对话框-->
    <el-dialog
      :visible.sync="editVisibleForTestSuit"
      :title="currentTestSuitId ? '编辑测试套件' : '添加测试套件'"
      center
      append-to-body
    >
      <test-suit-edit
        :id="currentTestSuitId"
        :taskId="currentTaskId"
        @callbackForSave="callbackForSaveForTestSuit"
        @callbackForCancel="callbackForCancelForTestSuit"
        v-if="editVisibleForTestSuit"
      ></test-suit-edit>
    </el-dialog>
    <!--编辑测试用例对话框-->
    <el-dialog
      :visible.sync="editVisibleForTestCase"
      title="添加测试用例"
      center
      append-to-body
    >
      <test-case-add
        :testSuitId="currentTestSuitId"
        :taskId="currentTaskId"
        @callbackForSave="callbackForSaveForTestCase"
        @callbackForCancel="callbackForCancelForTestCase"
        v-if="editVisibleForTestCase"
      ></test-case-add>
    </el-dialog>
  </div>
</template>
<script>
import TestSuitEdit from "@/components/testsuit/TestSuitEdit";
import TestCaseAdd from "@/components/testcase/TestCaseAdd";
import * as testcaseApi from "@/api/testcase";
import * as taskApi from "@/api/task";
export default {
  name: "TestCaseList",
  components: { TestSuitEdit, TestCaseAdd },
  data() {
    return {
      //用例列表与详情同步变更数据，放到了computed中了
      // taskDetails: [],
      //新增/修改测试套件弹窗是否可见
      editVisibleForTestSuit: false,
      //新增/修改测试用例弹窗是否可见
      editVisibleForTestCase: false,
      //当前测试套件ID，用于编辑测试套件，当前未提供此功能
      currentTestSuitId: null,
      //当前测试任务ID，用于新增/编辑测试套件时，一起传递给子组件
      currentTaskId: null,
      //当前选中项
      defaultActive: "-1",
    };
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentProject;
    },
    //获取拷贝的测试用例，用于粘贴的时候
    copyTestCase() {
      return this.$store.getters.getCopyTestCase;
    },
    taskDetails() {
      return this.$store.getters.getTaskDetails;
    },
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      this.getTaskDetails();
    },
    getTaskDetails() {
      // taskApi.queryDetailByProjectId(this.$siore.getters.getCurrentProject.id)
      taskApi.queryDetailByProjectId(this.project.id).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          //computed中的taskDetails中
          this.$store.commit("setTaskDetails", responseData.data);
          //data中定义的taskDetails
          // this.taskDetails = responseData.data;
          // console.log(JSON.stringify(this.taskDetails));
        } else {
          this.$message({
            message: responseData.message,
            type: "warning",
          });
        }
      });
    },
    //【测试套件相关】
    //显示测试套件弹窗
    showEditForTestSuit(testSuitId, taskId) {
      //设置传递的id
      this.currentTestSuitId = testSuitId;
      this.currentTaskId = taskId;
      //显示弹出对话框
      this.editVisibleForTestSuit = true;
    },
    //隐藏测试套件弹窗
    hideEditForTestSuit() {
      this.editVisibleForTestSuit = false;
    },
    //测试套件保存成功回调
    callbackForSaveForTestSuit() {
      //隐藏弹窗
      this.hideEditForTestSuit();
      //重新获取前任务详情列表
      this.getInitData();
    },
    //测试套件取消回调
    callbackForCancelForTestSuit() {
      //隐藏弹窗
      this.hideEditForTestSuit();
    },

    //【测试用例相关】
    //显示测试用例弹窗
    showAddForTestCase(testSuitId, taskId) {
      //设置传递的id
      this.currentTestSuitId = testSuitId;
      this.currentTaskId = taskId;
      //显示弹出对话框
      this.editVisibleForTestCase = true;
    },
    //隐藏测试用例弹窗
    hideAddForTestCase() {
      this.editVisibleForTestCase = false;
    },
    //测试用例保存成功回调
    callbackForSaveForTestCase(testCaseId, testSuitId, taskId) {
      //隐藏弹窗
      this.hideAddForTestCase();
      //重新获取前任务详情列表
      this.getInitData();
      //由于捕获不到el-menu重新绑定数据后，新增的组件，所以，使用setTimout滞后100毫秒，通过refs取到指定组件，触发点击事件
      let _refs = this.$refs;
      setTimeout(function () {
        let item = _refs[taskId + "_" + testSuitId + "_" + testCaseId][0];
        item.$emit("click");
      }, 100);
    },
    //测试用例取消回调
    callbackForCancelForTestCase() {
      //隐藏弹窗
      this.hideAddForTestCase();
    },
    //拷贝测试用例
    setCopyTestCase(testCase) {
      this.$store.commit("setCopyTestCase", testCase);
      //成功提示
      this.$message({
        message: "拷贝成功。",
        type: "success",
      });
    },
    //粘贴测试用例
    pasteTestCase(testSuit, task) {
      //深拷贝数据
      let copyTestCase = JSON.parse(JSON.stringify(this.copyTestCase));
      //拷贝时，需要将响应提取、断言、数据库断言转换成字符串提交给后端
      if (typeof copyTestCase.extract == "object") {
        copyTestCase.extract = JSON.stringify(copyTestCase.extract);
      }
      if (typeof copyTestCase.assertion == "object") {
        copyTestCase.assertion = JSON.stringify(copyTestCase.assertion);
      }
      if (typeof copyTestCase.dbAssertion == "object") {
        copyTestCase.dbAssertion = JSON.stringify(copyTestCase.dbAssertion);
      }
      //根据当前粘贴按钮所在的测试套件，重新设置测试任务id和测试套件id
      copyTestCase.testSuitId = testSuit.id;
      copyTestCase.taskId = task.id;
      //调用后端拷贝接口，实现拷贝
      testcaseApi.copy(copyTestCase).then((response) => {
        if (response.data.code === 0) {
          //重新获取数据列表
          this.getInitData();
          //由于捕获不到el-menu重新绑定数据后，新增的组件，所以，使用setTimout滞后100毫秒，通过refs取到指定组件，触发点击事件
          let _refs = this.$refs;
          setTimeout(function () {
            _refs[
              task.id + "_" + testSuit.id + "_" + response.data.data.id
            ][0].$emit("click");
          }, 100);
          //成功提示
          this.$message({
            message: "粘贴成功。",
            type: "success",
          });
        } else {
          //错误提示
          this.$message({
            message: response.data.message,
            type: "warning",
          });
        }
      });
    },
    //选择测试用例，此时需要切换菜单选中项，并设置当前测试用例
    // selectTestCase(testCase, testSuit, task) {
    selectTestCase(testCase) {
      // //设置当前激活测试用例菜单
      // this.defaultActive = task.id + "_" + testSuit.id + "_" + testCase.id;
      //设置当前测试用例
      this.$store.commit("setCurrentTestCase", testCase);
    },
  },
};
</script>