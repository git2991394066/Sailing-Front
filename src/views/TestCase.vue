<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-card><test-case-list></test-case-list></el-card
        ></el-col>
        <el-col :span="16"><test-case-edit></test-case-edit></el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import TestCaseList from "@/components/testcase/TestCaseList";
import TestCaseEdit from "@/components/testcase/TestCaseEdit";
export default {
  name: "TestCase",
  components: {
    TestCaseList,
    TestCaseEdit,
  },
};
</script>