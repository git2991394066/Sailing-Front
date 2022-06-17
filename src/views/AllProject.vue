<template>
  <div>
    <headbar></headbar>
    <el-card style="min-height: calc(100vh - 110px)">
      <div style="margin: 0 50px">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8" v-for="project in projects" :key="project.id">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-7">
                <i class="el-icon-monitor grid-con-icon"></i>
                <div class="grid-cont-right">
                  <a href="javascript:void(0)">
                    <div class="grid-num" @click.stop="selectProject(project)">
                      {{ project.name }}
                    </div>
                  </a>
                  <div style="border-top: solid 1px #d8dee5">
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <div style="text-indent: 10px; font-weight: bold">
                          负责人:{{ project.leaderName }}
                        </div>
                      </el-col>
                      <el-col
                        :span="10"
                        style="text-align: right; padding-right: 20px"
                      >
                        <el-dropdown
                          @command="handleItem(project, $event)"
                          placement="bottom"
                          v-if="checkOperationRight(project)"
                        >
                          <span class="el-dropdown-link"> 更多操作 </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              icon="el-icon-edit-outline"
                              command="edit"
                              >编辑
                            </el-dropdown-item>
                            <el-dropdown-item
                              icon="el-icon-delete-solid"
                              style="color: crimson"
                              command="delete"
                              >删除
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <a href="javascript:void(0)">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-4" @click="showEdit(null)">
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      <i class="el-icon-plus" style="font-size: 60px"></i>
                    </div>
                  </div>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import Headbar from "@/layout/Headbar.vue";
import * as projectApi from "@/api/project";
import * as cookies from "@/util/cookies";

export default {
  name: "AllProject",
  components: { Headbar },
  data() {
    return {
      projects: [
        // { id: 1, name: "项目1" },
        // { id: 2, name: "项目2" },
        // { id: 3, name: "项目3" },
      ],
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    //获取初始数据
    getInitData() {
      this.getAllProject();
    },
    getAllProject() {
      projectApi.queryAll().then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          this.projects = responseData.data;
          // this.$message({
          //   message:responseData.message,
          //   type:'success'
          // })
        } else {
          this.$message({
            message: responseData.message,
            type: "warning",
          });
        }
      });
    },
    //验证项目操作权限
    checkOperationRight(project) {
      // console.log(project);
      // return true;
      let result = false;
      let currentUser = cookies.getCurrentUser();
      if (
        currentUser.id == project.leaderId ||
        currentUser.id == project.createById
      ) {
        result = true;
      }
      return result;
    },
    //选择当前项目
    selectProject(project) {
      // 将选中的项目存储到一个全局状态
      this.$store.commit("setCurrentProject", project);
      // 跳转
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.el-col {
  margin-top: 20px;
}

.title {
  text-align: right;
  font: bold 30px/60px "microsoft sans serif";
  border-bottom: solid 2px #bebebe;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 120px;
}

.grid-cont-right {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.grid-num {
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}

.grid-con-icon {
  font-size: 100px;
  width: 180px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(110, 177, 240);
}

.grid-con-1 .grid-num {
  color: rgb(110, 177, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(126, 204, 132);
}

.grid-con-2 .grid-num {
  color: rgb(126, 204, 132);
}

.grid-con-3 .grid-con-icon {
  background: rgb(239, 168, 52);
}

.grid-con-3 .grid-num {
  color: rgb(239, 168, 52);
}

.grid-con-4 .grid-con-icon {
  background: rgb(255, 255, 255);
}

.grid-con-4 .grid-num {
  background: rgb(255, 255, 255);
}

.grid-con-5 .grid-con-icon {
  background: rgb(134, 198, 180);
}

.grid-con-5 .grid-num {
  color: rgb(134, 198, 180);
}

.grid-con-6 .grid-con-icon {
  background: rgb(127, 132, 179);
}

.grid-con-6 .grid-num {
  color: rgb(127, 132, 179);
}

.grid-con-7 .grid-con-icon {
  background: rgb(179, 181, 144);
}

.grid-con-7 .grid-num {
  color: rgb(179, 181, 144);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.el-dialog__header {
  padding: 0px 20px 20px;
}
</style>