<template>
  <div>
    <el-card style="margin-top: 20px">
      <categorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></categorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" height="500" border style="width: 100%">
          <el-table-column
            label="序号"
            width="60px"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="attrValuList" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                size="mini"
                v-for="(value, idnex) in row.attrValueList"
                :key="value.id"
                >{{ value.valueName }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="updateAttrValue(row)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="60px"
          ></el-table-column>

          <el-table-column label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="changeModel(row)"
                @keyup.native.enter="changeModel(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button> -->
              <el-popconfirm
                title="确定删除这个属性值吗？"
                @onConfirm="deleteAttrValue(row, $index)"
              >
                <el-button
                  slot="reference"
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="saveAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="removeAdd">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result)
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    updateAttrValue(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      // console.log(row)
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    async deleteAttr(row) {
      // console.log("删除");
       let result  = await this.$API.attr.reqDeleteAttr(row.id)
      // console.log(result)
      if(result.code ==200){
        this.$message({
          type:'success',
          message:`${row.attrName}删除成功`
        })
        this.getAttrList()
      }else{
        this.$message({
          type:'danger',
          message:`${row.attrName}删除失败`
        })
      }
    },
    addAttr() {
      (this.isShowTable = false),
        (this.attrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 3,
        });
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    removeAdd() {
      this.isShowTable = true;
    },
    changeModel(row) {
      let sameAttr = this.attrInfo.attrValueList.find((item) => {
        if (row != item) {
          return item.valueName == row.valueName;
        }
      });
      if (row.valueName.trim() == "") {
        this.$message("请输入正确的属性值");
        return;
      } else if (sameAttr) {
        this.$message("请不要输入重复的属性值");
        return;
      }
      row.flag = false;
    },
    async saveAttr() {
      this.isShowTable = true;
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.attr.reqAddAttrInfo(this.attrInfo);
      //  console.log(result)
      if (result.code == 200) {
        this.$message({
          message: this.attrInfo.id ? "修改属性成功" : "添加属性成功",
          type: "success",
        });
        // if (this.attrInfo.id) {
        this.getAttrList();
        // } else {
        //   this.getTradeList();
        // }
      } else {
        this.$message.error(this.attrInfo.id ? "修改属性失败" : "添加属性失败");
      }
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteAttrValue(row, index) {
      // console.log("删除");
      this.attrInfo.attrValueList.splice(index, 1);
    },
  },
};
</script>

<style></style>
