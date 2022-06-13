<template>
  <div id="user">
    <el-card shadow="always">
      <div class="grid-content grid-con-1">
        <span class="grid-con-icon">用户管理</span>
        <div class="grid-cont-right">
          <el-row :gutter="20">
            <el-col :span="4"
              ><div style="line-height: 2.5rem">用户名</div>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="search.username"
                autocomplete="off"
                placeholder="请输入用户名"
              >
              </el-input>
            </el-col>
            <el-col :span="4"
              ><div style="line-height: 2.5rem">姓名</div>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="search.name"
                autocomplete="off"
                placeholder="请输入姓名"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <div class="grid-cont-right">
                <!-- 查询的按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="getUsers"
                  plain
                >
                  查询
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="width: 200px; text-align: right; margin-right: 20px">
          <!-- 添加项目的按钮 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showEdit(null)"
            plain
          >
            添加用户
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin-top: 10px">
      <el-table :data="users" border style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          min-width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="id" label="ID" min-width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="120" align="center">
        </el-table-column>
        <el-table-column prop="roles" label="角色">
          <template slot-scope="scope">
            <el-tag
              type="info"
              v-for="item in scope.row.roles"
              :key="item"
              style="margin-right: 2px"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="createByName"
          label="创建人"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="135"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateByName"
          label="修改人"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="135"
          align="center"
        >
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
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="remove(scope.row.id)"
              plain
              icon="el-icon-delete"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :title="currentId ? '修改' : '新增'"
      :visible.sync="dialogVisible"
      width="50%"
      style="text-align: center"
    >
      <!-- 通过子组件触发事件，来调用父组件内的方法 -->
      <!-- vue有缓存，通过v-if="dialogVisible"来重新加载，可以解决编辑不同id都显示编辑时第一个id的数据 -->
      <user-edit
        v-if="dialogVisible"
        :id="currentId"
        @callbackForCancel="callbackForCancel"
        @callbackForSave="callbackForSave"
      ></user-edit>
      <!-- 增加根据返回的后端结果，处理是否关闭弹窗。所以把这块放到组件里，添加对应逻辑，而不是下面的简单逻辑的点击确认/取消就关闭  -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import * as userApi from "@/api/user";
import userEdit from "@/components/user/UserEdit.vue";
export default {
  components: { userEdit },
  name: "User",
  data() {
    return {
      users: [
        // { id: 1, username: "zs", name: "张三" },
        // { id: 2, username: "ls", name: "李四" },
      ],
      search: {
        pageIndex: 1,
        pageSize: 5,
      },
      total: 0,
      dialogVisible: false,
      currentId: null,
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    //获取初始数据
    getInitData() {
      //获取相关数据
      //获取用户数据
      this.getUsers();
    },
    getUsers() {
      userApi.query(this.search).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          this.users = responseData.data;
          this.total = responseData.total;
        } else {
          this.$message({
            message: responseData.message,
            type: "warning",
          });
        }
      });
      // }).catch((err) => {

      // });
    },
    //变更每页尺寸
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getUsers();
      // console.log(`每页 ${val} 条`);
    },
    //变更页号
    handleCurrentChange(val) {
      this.search.pageIndex = val;
      this.getUsers();
      // console.log(`当前页: ${val}`);
    },
    showEdit(id) {
      this.currentId = id;
      this.dialogVisible = true;
    },
    callbackForCancel() {
      this.dialogVisible = false;
      this.getUsers();
    },
    callbackForSave() {
      this.dialogVisible = false;
      this.getUsers();
    },
    //删除
    remove(id) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.remove(id).then((result) => {
            let responseData = result.data;
            if (responseData.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              //重新加载数据
              this.getUsers();
            } else {
              this.$message({
                message: responseData.message,
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
      // userApi.remove(id).then((result) => {
      //   let responseData = result.data;
      //   if (responseData.code == 0) {
      //     this.$message({
      //       message: "删除成功",
      //       type: "success",
      //     });
      // //重新加载数据
      //         this.getUsers()
      //   } else {
      //     this.$message({
      //       message: responseData.message,
      //       type: "warning",
      //     });
      //   }
      // })
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