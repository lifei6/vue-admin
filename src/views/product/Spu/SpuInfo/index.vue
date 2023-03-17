<template>
  <div style="margin-top: 20px">
    <el-form ref="form" :model="spuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 选择框 -->
        <el-select
          :placeholder="`还有${unSelectSaleAttrList.length}个未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="select.name"
            :value="`${select.id}:${select.name}`"
            v-for="(select, index) in unSelectSaleAttrList"
            :key="select.id"
          ></el-option>
        </el-select>
        <!-- 按键 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 表格 -->
        <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
          <el-table-column
            label="序号"
            width="60px"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column label="属性名" width="200px" prop="saleAttrName">
          </el-table-column>

          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="attrValue.id"
                v-for="(attrValue, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ attrValue.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.native.enter="handleInputConfirm(row)" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="`${$index}`"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row, $index)"
                >+ 属性值</el-button
              >
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <!-- 保存取消按钮 -->
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="$emit('changeScene', {scene:0,flag:'update'})">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "SpuInfo",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        // 三级id
        category3Id: 0,
        // 名称
        spuName: "",
        // 描述
        description: "",
        // 修改有新增无
        // id: 0,

        // 图片列表
        spuImageList: [],
        // 销售属性列表
        spuSaleAttrList: [],
        // 品牌id
        // 开始不存在
        tmId: "",
      }, //spu基本信息
      tradeMarkList: [], //所有品牌列表
      spuImageList: [], //图片列表
      saleAttrList: [], //销售属性列表
      attrIdAndName: "", //未选择的销售属性id和名称
    };
  },
  computed: {
    unSelectSaleAttrList() {
      return this.saleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    async addOrUpdateAttr() {
      // 整理数据
      this.spuInfo.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发送请求
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo);
      if (res.code == 200) {
        // console.log(result)
        // 回到scene==0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spuInfo.id ? "update" : "add",
        });
        // 通知父组件去更新页面
        this.$message({
          type: "success",
          message: this.spuInfo.id ?"修改spu成功":"添加spu成功",
        });
      } else {
        this.$message(this.spuInfo.id ?"修改spu失败":"添加spu失败");
      }
    },
    handleInputConfirm(row) {
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == row.inputValue
      );
      if (row.inputValue.trim() == 0) {
        this.$message("请输入正确的属性值");
        return;
      } else if (result) {
        this.$message("请不要输入相同的属性值");
        return;
      } else {
        let { baseSaleAttrId, inputValue } = row;
        let newAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
        row.spuSaleAttrValueList.push(newAttrValue);
        row.inputVisible = false;
      }
    },
    addSaleAttrValue(row, index) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      // console.log(index)
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let newAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuInfo.spuSaleAttrList.push(newAttr);
      this.attrIdAndName = "";
    },
    handleAvatarSuccess(res, file, fileList) {
      //   console.log(res, file);
      if (res.code == 200) {
        // this.spuImageList.push({
        //   // id: 0,
        //   imgName: res.data,
        //   imgUrl: file.name,
        //   spuId: undefined,
        // });
        this.spuImageList = fileList;
      }
    },
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initAttr(spu) {
      // console.log('发起请求',spu)
      let result = await this.$API.spu.reqSpuById(spu.id);
      // console.log(result);
      if (result.code == 200) {
        this.spuInfo = result.data;
      }
      let result2 = await this.$API.spu.reqSpuImageList(spu.id);
      if (result2.code == 200) {
        let arr = result2.data;
        arr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = arr;
      }
      let result1 = await this.$API.spu.reqTradeMarkList();
      if (result1.code == 200) {
        this.tradeMarkList = result1.data;
      }
      let result3 = await this.$API.spu.reqSaleAttrList();
      if (result3.code == 200) {
        this.saleAttrList = result3.data;
      }
    },
    async addSpudata(category3Id) {
      // 清楚之前的数据
      (this.spuInfo = {
        category3Id: 0,
        spuName: "",
        description: "",
        spuImageList: [],
        spuSaleAttrList: [],
        tmId: "",
      }), //spu基本信息
        // 清理图片
        (this.spuImageList = []);
      // 收集三级id
      this.spuInfo.category3Id = category3Id;
      // 初始化品牌选择列表
      let result1 = await this.$API.spu.reqTradeMarkList();
      if (result1.code == 200) {
        this.tradeMarkList = result1.data;
      }
      // 初始化销售属性列表
      let result3 = await this.$API.spu.reqSaleAttrList();
      if (result3.code == 200) {
        this.saleAttrList = result3.data;
      }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
