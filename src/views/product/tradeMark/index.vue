<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 20px 0"
      @click="showDiaLog"
      >添加</el-button
    >

    <el-table style="width: 100%" border :data="list">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        width="width"
        prop="tmName"
      ></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTradeList"
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="99"
    >
    </el-pagination>

    <el-dialog
      :title="tmList.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmList" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmList.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmList.logoUrl" :src="tmList.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    var validateName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        return callback(new Error("商品名字为2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmList: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { validator: validateName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择商品图片" }],
      },
    };
  },
  mounted() {
    this.getTradeList();
  },
  methods: {
    async getTradeList(pager = 1) {
      this.page = pager;
      let { limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(this.page, limit);
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
        return "ok";
      } else {
        return Promise.reject(new Error("faile"));
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeList();
    },
    showDiaLog() {
      this.dialogFormVisible = true;
      this.tmList = {
        tmName: "",
        logoUrl: "",
      };
    },
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // console.log(row)
      this.tmList = { ...row };
    },
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmList
          );
          if (result.code == 200) {
            this.$message({
              message: this.tmList.id ? "修改商品成功" : "添加商品成功",
              type: "success",
            });
            if (this.tmList.id) {
              this.getTradeList(this.page);
            } else {
              this.getTradeList();
            }
          } else {
            this.$message.error(
              this.tmList.id ? "修改商品失败" : "添加商品失败"
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      // console.log(res)
      if (res.code == 200) {
        this.tmList.logoUrl = res.data;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    deleteTradeMark(row) {
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqRemoveTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTradeList(this.list.length > 1 ? this.page : this.page - 1);
          } else {
            return Promise.reject(new Error("faile"));
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
