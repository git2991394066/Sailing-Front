<template>
  <div id="test-case-edit" class="home">
    <!-- <h4>用例详情</h4>
    {{ testCase }}||{{ $store.getters.getCurrentTestCase }} -->
    <!--页面较长，相比一般的保存按钮放置在尾部，测试用例编辑的保存/删除操作放置于顶部，让用户直观看到-->
    <div style="text-align: right">
      <el-button
        type="primary"
        plain
        icon="el-icon-s-claim"
        @click="save"
        v-if="testCase.id"
        >保存用例
      </el-button>
      <el-button
        type="danger"
        v-if="testCase.id"
        @click="remove"
        plain
        icon="el-icon-delete"
        >删除用例
      </el-button>
    </div>
    <!--用例基础信息-->
    <el-divider content-position="left" v-if="testCase.id">
      <h2>用例基础信息</h2>
    </el-divider>
    <el-form label-width="120px" v-if="testCase.id">
      <el-row :gutter="10" style="margin-bottom: 3px">
        <el-col :span="12">
          <el-form-item label="接口模块">
            <el-select
              v-model="testCase.moduleId"
              placeholder="接口模块"
              style="width: 100%"
            >
              <el-option
                v-for="item in currentModules"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接口名称">
            <el-select
              v-model="testCase.interfaceId"
              placeholder="请选择接口"
              style="width: 100%"
            >
              <el-option
                v-for="item in currentInterfaces"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="用例名称">
            <el-input placeholder="请输入用例名称" v-model="testCase.name">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用例标签">
            <el-input
              placeholder="请输入用例标签，多个用逗号分隔，如成功、登录"
              v-model="testCase.marks"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom: 3px">
        <el-col :span="24">
          <el-form-item label="优先级">
            <el-input-number
              v-model="testCase.orderIndex"
              :min="1"
              :max="10"
              label="优先级"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--用例详细信息/接口信息-->
    <el-divider content-position="left" style="padding-top: 5px">
      <h2>
        {{ testCase.id ? "用例详细信息" : "接口信息" }}
        <el-tooltip
          v-if="testCase.id"
          content="用例详细信息中，[接口地址]来源于用例关联项目接口与项目环境，并不保存在用例信息中；[请求信息]将会在点击保存用例时保存到当前用例中"
          placement="right"
          effect="dark"
          style="display: inline-block"
        >
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </h2>
    </el-divider>
    <el-row :gutter="10">
      <el-col :span="24">
        <!--接口地址，包含请求方法、项目环境及对应的主机地址-->
        <el-card class="box-card">
          <el-divider>
            <span>
              <h4>接口地址</h4>
            </span>
          </el-divider>
          <div>
            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :span="4">
                <el-select
                  v-model="currentInterface.requestMethod"
                  placeholder="请求方法"
                  style="font-weight: bold"
                >
                  <el-option
                    :label="item"
                    :value="item"
                    v-for="item in requestMethods"
                    :key="item"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="line-height: 45px">
                <el-tooltip
                  content="请求方法不会保存在用例中，是根据用例关联的接口自动带出"
                  placement="right"
                  effect="dark"
                >
                  <i data-v-c52092f4="" class="header-icon el-icon-info"></i>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-select
                  v-model="currentEnvironment"
                  value-key="id"
                  placeholder="请选择项目环境"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in environments"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="14">
                <el-input
                  placeholder="http://www.xxx.com"
                  v-model="currentEnvironment.host"
                >
                  <template slot="prepend">主机</template>
                </el-input>
              </el-col>
              <el-col :span="1" style="line-height: 45px">
                <el-tooltip
                  content="项目环境、主机信息不会保存在用例中，需要在运行任务时选择合适的项目环境"
                  placement="right"
                  effect="dark"
                >
                  <i data-v-c52092f4="" class="header-icon el-icon-info"></i>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :span="20">
                <el-input
                  placeholder="/user/login"
                  v-model="currentInterface.path"
                >
                  <template slot="prepend">接口地址</template>
                </el-input>
              </el-col>
              <el-col :span="3" style="text-align: right">
                <el-button
                  type="primary"
                  icon="el-icon-s-promotion"
                  @click="run"
                  >Run
                </el-button>
              </el-col>
              <el-col :span="1"> &nbsp; </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <!--请求信息-->
        <el-card class="box-card">
          <el-divider>
            <span>
              <h4>
                请求信息
                <el-tooltip placement="right" effect="dark">
                  <div slot="content">
                    在请求头、请求参数、响应提取中，可使用关键字替换，用于替换成前置用例定义的随机值和响应提取值，替换规则如下：<br />
                    1、随机值规则：以##开头和结尾，将由系统生成，现支持##username##和##phone##，并支持在下一个关联用例中以#开头和结果形式获取使用，如#username#<br />
                    2、响应提取规则：以#开头和结尾为提取名称，用于提取返回内容，用于下一个关联用例中使用，使用形式与提取名一致，如#username#"
                  </div>
                  <i data-v-c52092f4="" class="header-icon el-icon-info"></i>
                </el-tooltip>
              </h4>
            </span>
          </el-divider>
        </el-card>
        <el-tabs type="border-card">
          <!-- 请求头 -->
          <el-tab-pane label="请求头">
            <el-row
              :gutter="20"
              v-for="(header, index) in requestData.headers"
              :key="index"
              style="margin: 10px"
            >
              <el-col :span="7">
                <el-input
                  v-model="header.key"
                  placeholder="KEY"
                  size="mini"
                  @input="addTableRow('header', requestData.headers)"
                >
                </el-input>
              </el-col>
              <el-col :span="13">
                <el-input
                  v-model="header.value"
                  placeholder="VALUE"
                  size="mini"
                  @input="addTableRow('header', requestData.headers)"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  v-if="index != requestData.headers.length - 1"
                  @click.native="delTableRow(requestData.headers, index)"
                  size="mini"
                >
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="请求参数">
            <!-- 请求参数 -->
            <el-tabs>
              <!-- 查询字符串 -->
              <el-tab-pane label="Params">
                <el-row
                  :gutter="20"
                  v-for="(par, index) in requestData.params"
                  :key="index"
                  style="margin: 10px"
                >
                  <el-col :span="6">
                    <el-input
                      v-model.lazy="par.key"
                      placeholder="参数名"
                      size="mini"
                      @input="addTableRow('param', requestData.params)"
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input
                      v-model.lazy="par.value"
                      placeholder="参数值"
                      size="mini"
                      @input="addTableRow('param', requestData.params)"
                    ></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      plain
                      v-if="index != requestData.params.length - 1"
                      @click="delTableRow(requestData.params, index)"
                      size="mini"
                    >
                    </el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <!-- 表单 -->
              <el-tab-pane label="x-www-form-urlencoded">
                <el-row
                  :gutter="20"
                  v-for="(item, index) in requestData.data"
                  :key="index"
                  style="margin: 10px"
                >
                  <el-col :span="6">
                    <el-input
                      v-model.lazy="item.key"
                      placeholder="参数名"
                      size="mini"
                      @input="addTableRow('data', requestData.data)"
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input
                      v-model.lazy="item.value"
                      placeholder="参数值"
                      size="mini"
                      @input="addTableRow('data', requestData.data)"
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      plain
                      v-if="index != requestData.data.length - 1"
                      @click.native="delTableRow(requestData.data, index)"
                      size="mini"
                    >
                    </el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <!-- json参数 -->
              <el-tab-pane label="json">
                <editor
                  height="300"
                  width="100%"
                  ref="editor"
                  :content="requestData.json"
                  v-model="requestData.json"
                  :options="{
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    tabSize: 2,
                    fontSize: 20,
                    showPrintMargin: false,
                  }"
                  :lang="'json'"
                  @init="editorInit"
                >
                </editor>
                <el-button
                  style="margin-top: 5px"
                  type="primary"
                  size="mini"
                  @click="jsonFormat"
                >
                  json格式化</el-button
                >
              </el-tab-pane>
            </el-tabs></el-tab-pane
          >
          <el-tab-pane label="响应提取">
            <!--响应提取-->
            <el-row
              :gutter="20"
              v-for="(ext, index) in testCase.extract"
              :key="index"
              style="margin: 10px"
            >
              <el-col :span="6">
                <el-input
                  v-model.lazy="ext[0]"
                  placeholder="参数名"
                  size="mini"
                  @input="addTableRow('extract', testCase.extract)"
                >
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model.lazy="ext[1]"
                  placeholder="参数值，使用JSONPath语法，如$..code"
                  size="mini"
                  @input="addTableRow('extract', testCase.extract)"
                >
                </el-input>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  v-if="index != testCase.extract.length - 1"
                  @click.native="delTableRow(testCase.extract, index)"
                  size="mini"
                >
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="用例断言">
            <!--用例断言  -->
            <el-row
              :gutter="20"
              v-for="(ass, index) in testCase.assertion"
              :key="index"
              style="margin: 10px"
            >
              <el-col :span="4">
                <el-input
                  v-model.number="ass[2]"
                  placeholder="预期结果"
                  size="mini"
                  @input="addTableRow('assertion', testCase.assertion)"
                >
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model.lazy="ass[0]"
                  placeholder="断言方式"
                  size="mini"
                  @input="addTableRow('assertion', testCase.assertion)"
                >
                  <el-option label="eq" value="eq"></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model.lazy="ass[1]"
                  placeholder="实际结果提取表达式，使用JSONPath语法，如$..code"
                  size="mini"
                  @input="addTableRow('assertion', testCase.assertion)"
                >
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  v-if="index != testCase.assertion.length - 1"
                  @click.native="delTableRow(testCase.assertion, index)"
                  size="mini"
                >
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="数据库校验">
            <!--数据库断言  -->
            <el-row
              :gutter="20"
              v-for="(ass, index) in testCase.dbAssertion"
              :key="index"
              style="margin: 10px"
            >
              <el-col :span="4">
                <el-input
                  v-model.lazy="ass[2]"
                  placeholder="预期结果"
                  size="mini"
                  @input="addTableRow('dbAssertion', testCase.dbAssertion)"
                >
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model.lazy="ass[0]"
                  placeholder="断言方式"
                  size="mini"
                  @input="addTableRow('dbAssertion', testCase.dbAssertion)"
                >
                  <el-option label="eq" value="eq"></el-option>
                  <el-option label="exist" value="exist"></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model.lazy="ass[1]"
                  placeholder="SQL语句"
                  size="mini"
                  @input="addTableRow('dbAssertion', testCase.dbAssertion)"
                >
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  v-if="index != testCase.dbAssertion.length - 1"
                  @click.native="delTableRow(testCase.dbAssertion, index)"
                  size="mini"
                >
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!--响应信息-->
    <el-divider content-position="left" style="padding-top: 5px">
      <h2>
        响应信息
        <el-tooltip
          content="响应信息仅用于使用Run调用接口时查看执行效果，类似于Postman"
          placement="right"
          effect="dark"
        >
          <i data-v-c52092f4="" class="header-icon el-icon-info"></i>
        </el-tooltip>
      </h2>
    </el-divider>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card class="box-card">
          <el-tabs>
            <el-tab-pane label="响应体">
              <json-view
                :data="responseData.body"
                style="height: 420px; overflow-y: scroll"
                v-if="responseData.body"
              />
              <el-empty description="内容为空" v-else></el-empty>
            </el-tab-pane>

            <el-tab-pane label="响应头">
              <json-view
                :data="responseData.headers"
                style="height: 420px; overflow-y: scroll"
                v-if="responseData.headers"
              />
              <el-empty description="内容为空" v-else></el-empty>
            </el-tab-pane>

            <el-tab-pane label="cookies">
              <json-view
                :data="responseData.cookies"
                style="height: 420px; overflow-y: scroll"
                v-if="responseData.cookies"
              />
              <el-empty description="内容为空" v-else></el-empty>
            </el-tab-pane>
            <el-tab-pane label="请求详情">
              <json-view
                :data="responseData.requestInfo"
                style="height: 420px; overflow-y: scroll"
                v-if="responseData.requestInfo"
              />
              <el-empty description="内容为空" v-else></el-empty>
            </el-tab-pane>
            <!-- v1.0.1 增加响应时间和大小的展示 -->
            <el-tab-pane label="响应时间和大小">
              <el-descriptions title="响应时间和大小">
                <el-descriptions-item
                  label="响应时间/ms "
                  v-if="responseData.responseTimeMs"
                  >{{ responseData.responseTimeMs }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="响应时间/s"
                  v-if="responseData.responseTimeS"
                  >{{ responseData.responseTimeS }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="响应大小content-length"
                  v-if="responseData.responseContentLength"
                  >{{
                    responseData.responseContentLength
                  }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="响应大小/kb"
                  v-if="responseData.responseContentLength"
                  >{{
                    responseData.responseContentLength / 1024
                  }}</el-descriptions-item
                >
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!-- {{ $store.getters.getCurrentTestCase }} -->
  </div>
</template>
<script>
import * as taskApi from "@/api/task";
import * as interfaceApi from "@/api/interface";
import * as commonData from "@/api/commonData";
import * as environmentApi from "@/api/environment";
import Editor from "vue2-ace-editor";
import JsonView from "vue-json-views";
import * as testcaseApi from "@/api/testcase";
export default {
  name: "Home",
  components: {
    Editor,
    JsonView,
  },
  data() {
    return {
      //  //created整体只执行一次，所以要把动态获取vuex中的testCase放在computed计算属性中，而不是data中这样不能动态获取
      // testCase: {
      //   id: null,
      // },
      currentModules: [],
      currentInterfaces: {}, //当前模块下的所有接口
      interfaces: [], //当前项目下的所有接口
      currentInterface: {},
      currentEnvironment: {},
      requestMethods: commonData.requestMethods,
      environments: [],
      requestData: {
        headers: [["", ""]],
        params: [["", ""]],
        data: [["", ""]],
        json: "",
      },
      responseData: {
        body: "",
        headers: "",
        cookies: "",
        requestInfo: "",
      },
    };
  },
  computed: {
    testCase() {
      return this.$store.getters.getCurrentTestCase;
    },
    project() {
      return this.$store.getters.getCurrentProject;
    },
  },
  watch: {
    //监听用例切换
    testCase() {
      console.log("abc");
      //获取关联模块
      this.getModulesByTaskId();
      //根据当前测试用例的模块，获取下面的所有接口
      this.getCurrentInterfaces();
      //获取当前测试用例的接口信息
      this.getCurrentInterface();
      //4、初始化请求数据，包括请求头、参数、form data、json
      if (this.testCase && this.testCase.requestData) {
        this.requestData = JSON.parse(this.testCase.requestData || {});
      }
      //初始化请求数据，包括请求头，数据、参数、json;因为后端保存的是JSON格式字符串
      this.requestData.headers = this.ObjectToKeyValue(
        this.requestData.headers || {}
      );
      this.requestData.data = this.ObjectToKeyValue(
        this.requestData.data || {}
      );
      this.requestData.params = this.ObjectToKeyValue(
        this.requestData.params || {}
      );
      //json字段格式化，JSON.stringify(value[, replacer [, space]])，表示前面有4个空格
      this.requestData.json = JSON.stringify(
        this.requestData.json || {},
        null,
        4
      );
      //5、初始化响应提取、断言、数据库断言数据，因为要支持至少有一行空数据，并且需要是js的数组，但数据返回的是字符串，所以要做一定的转换
      //响应提取
      if (!this.testCase.extract) {
        this.testCase.extract = "[]";
      }
      if (typeof this.testCase.extract == "string") {
        this.testCase.extract = JSON.parse(this.testCase.extract);
      }
      if (this.testCase.extract.length <= 0) {
        this.testCase.extract.push(["", "", ""]);
      }
      //断言
      if (!this.testCase.assertion) {
        this.testCase.assertion = "[]";
      }
      if (typeof this.testCase.assertion == "string") {
        this.testCase.assertion = JSON.parse(this.testCase.assertion);
      }
      if (this.testCase.assertion.length <= 0) {
        this.testCase.assertion.push(["", "", ""]);
      }
      //数据库断言
      if (!this.testCase.dbAssertion) {
        this.testCase.dbAssertion = "[]";
      }
      if (typeof this.testCase.dbAssertion == "string") {
        this.testCase.dbAssertion = JSON.parse(this.testCase.dbAssertion);
      }
      if (this.testCase.dbAssertion.length <= 0) {
        this.testCase.dbAssertion.push(["", "", ""]);
      }
    },
  },
  created() {
    //created整体只执行一次，所以要把动态获取vuex中的testCase放在computed计算属性中，而不是data中这样不能动态获取
    // this.testCase = this.$store.getters.getCurrentTestCase;
    this.getInitData();
  },
  methods: {
    //根据任务id获取模块列表
    getModulesByTaskId() {
      taskApi.getModulesByTaskId(this.testCase.taskId).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          this.currentModules = responseData.data;
        } else {
          console.log(responseData);
        }
      });
    },
    //获取项目下的所有接口
    getAllInterfaces() {
      interfaceApi.queryByProjectId(this.project.id).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          this.interfaces = responseData.data;
        } else {
          console.log(responseData);
        }
      });
    },
    //获取当前模块下的所有接口【对项目下的所有接口进行过滤】
    getCurrentInterfaces() {
      this.currentInterfaces = this.interfaces.filter((item) => {
        return item.moduleId == this.testCase.moduleId;
      });
    },
    //获取所有环境
    getAllEnvironments() {
      environmentApi.queryByProjectId(this.project.id).then((result) => {
        let responseData = result.data;
        if (responseData.code == 0) {
          this.environments = responseData.data;
        } else {
          console.log(responseData);
        }
      });
    },
    //获取当前选中测试用例的接口
    getCurrentInterface() {
      let currentInterface = this.interfaces.filter((item) => {
        return item.id == this.testCase.interfaceId;
      });
      if (currentInterface && currentInterface.length > 0) {
        this.currentInterface = currentInterface[0];
      }
    },
    //初始化
    getInitData() {
      //获取当前项目下所有接口
      this.getAllInterfaces();
      //获取当前项目下所有环境
      this.getAllEnvironments();
    },
    //【对象与key-value转换】
    //对象转key-value数组，将后端http请求支持的{key_a:value_a,key_b:value_b}数据转换为[{key:key_a,value:value_a},{key:key_b,value:value_b}]标准js对象
    ObjectToKeyValue(objects) {
      let hs = [];
      for (let k in objects) {
        hs.push({
          key: k,
          value: objects[k],
        });
      }
      hs.push({
        key: null,
        value: null,
      });
      return hs;
    },
    //key-value数组转对象，将[{key:key_a,value:value_a},{key:key_b,value:value_b}]标准js对象还原成后端http请求支持的对象{key_a:value_a,key_b:value_b}
    KeyValueToObject(value) {
      let res = {};
      value.forEach((item) => {
        if (item.key && item.value) {
          res[item.key] = item.value;
        }
      });
      return res;
    },
    //【请求信息中的行操作】
    // 添加行,如果是请求头、参数、数据、提取，如果最后一行的key和value有一个不为空，则添加一行；如果是断言、数据库断言，则最后一行3个条件组合只要有一个不为空，都添加一行
    addTableRow(type, data) {
      switch (type) {
        case "header":
        case "param":
        case "data":
          if (data[data.length - 1].key || data[data.length - 1].value) {
            data.push({ key: null, value: null });
          }
          break;
        case "extract":
          if (data[data.length - 1][0] || data[data.length - 1][1]) {
            data.push(["", ""]);
          }
          break;
        case "assertion":
        case "dbAssertion":
          if (
            data[data.length - 1][0] ||
            data[data.length - 1][1] ||
            data[data.length - 1][2]
          ) {
            data.push(["", "", ""]);
          }
          break;
      }
    },
    // 删除行
    delTableRow(data, i) {
      if (data.length > i) {
        //splice，在位置i，删除1个元素
        data.splice(i, 1);
      }
    },
    //【请求参数中的json】组件相关方法
    //json格式化
    jsonFormat() {
      try {
        this.requestData.json = JSON.parse(this.requestData.json);
        this.requestData.json = JSON.stringify(this.requestData.json, null, 4);
      } catch (err) {
        alert("json格式错误");
      }
    },
    //json数据编辑器配置
    editorInit() {
      require("brace/theme/chrome");
      require("brace/ext/language_tools");
      require("brace/mode/yaml");
      require("brace/mode/json");
      require("brace/mode/less");
      require("brace/snippets/json");
    },
    //运行
    run() {
      if (!this.currentEnvironment.host || !this.currentInterface.path) {
        this.$message({
          message: "主机和接口地址都不能为空才能运行。",
          type: "warning",
        });
        return;
      }
      let requestInfo = {
        url: this.currentEnvironment.host + this.currentInterface.path,
        method: this.currentInterface.requestMethod,
        request: {
          headers: this.requestData.headers
            ? this.KeyValueToObject(this.requestData.headers)
            : {},
          data: this.requestData.data
            ? this.KeyValueToObject(this.requestData.data)
            : {},
          params: this.requestData.params
            ? this.KeyValueToObject(this.requestData.params)
            : {},
          json: this.requestData.json ? JSON.parse(this.requestData.json) : {},
        },
      };
      testcaseApi.run(requestInfo).then((response) => {
        if (response.data.code === 0) {
          //成功提示
          this.$message({
            message: "运行成功。",
            type: "success",
          });
          if (response.data.data.json) {
            this.responseData.body = response.data.data.json;
          } else if (response.data.data.body) {
            this.responseData.body = {
              body: response.data.data.body,
            };
          }
          this.responseData.headers = response.data.data.headers;
          this.responseData.cookies = response.data.data.cookies;
          this.responseData.requestInfo = requestInfo;

          //v1.0.1 增加响应时间和大小的展示
          this.responseData.responseTimeMs = response.data.data.responseTimeMs;
          this.responseData.responseTimeS = response.data.data.responseTimeS;
          this.responseData.responseContentLength =
            response.data.data.contentLength;
        } else {
          //错误提示
          this.$message({
            message: response.data.message,
            type: "warning",
          });
        }
      });
    },
    //保存用例
    save() {
      //设置请求头、参数、数据、json为json字符串格式
      let requestData = {
        headers: this.KeyValueToObject(
          this.requestData.headers.filter((item) => {
            return item.key;
          })
        ),
        params: this.KeyValueToObject(
          this.requestData.params.filter((item) => {
            return item.key;
          })
        ),
        data: this.KeyValueToObject(
          this.requestData.data.filter((item) => {
            return item.key;
          })
        ),
        json: JSON.parse(this.requestData.json),
      };
      this.testCase.requestData = JSON.stringify(requestData);

      //设置响应提取、断言、数据库用例为json字符串格式
      this.testCase.extract = JSON.stringify(
        this.testCase.extract.filter((item) => {
          return item[0] || item[1]; //取数组第1、2个位置都不为空的数据
        })
      );
      this.testCase.assertion = JSON.stringify(
        this.testCase.assertion.filter((item) => {
          return item[0] || item[1] || item[2]; //取数组第1、2、3个位置都不为空的数据
        })
      );
      this.testCase.dbAssertion = JSON.stringify(
        this.testCase.dbAssertion.filter((item) => {
          return item[0] || item[1] || item[2]; //取数组第1、2、3个位置都不为空的数据
        })
      );
      //保存用例
      testcaseApi.modify(this.testCase).then((response) => {
        if (response.data.code === 0) {
          //成功提示
          this.$message({
            message: "保存成功。",
            type: "success",
          });
          //保存完后，将断言等字符串类型转换成对象，并添加一行
          if (typeof this.testCase.extract == "string") {
            this.testCase.extract = JSON.parse(this.testCase.extract);
            this.testCase.extract.push(["", "", ""]);
          }
          if (typeof this.testCase.assertion == "string") {
            this.testCase.assertion = JSON.parse(this.testCase.assertion);
            this.testCase.assertion.push(["", "", ""]);
          }
          if (typeof this.testCase.dbAssertion == "string") {
            this.testCase.dbAssertion = JSON.parse(this.testCase.dbAssertion);
            this.testCase.dbAssertion.push(["", "", ""]);
          }
          //保存成功，重新加载左侧任务详情列表
          this.getTaskDetails();
        } else {
          //错误提示
          this.$message({
            message: response.data.message,
            type: "warning",
          });
        }
      });
    },
    //删除用例
    remove() {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          testcaseApi.remove(this.testCase.id).then(() => {
            this.$message({
              message: "删除成功。",
              type: "success",
            });
            //清空当前用例数据
            this.testCase = {
              extract: [["", ""]],
              assertion: [["", "", ""]],
              dbAssertion: [["", "", ""]],
            };
            //从数据库刷新后，重新加载左侧菜单数据
            this.getTaskDetails();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
  },
};
</script>