<template>
  <div>
    <div v-show="scene == 0">
      <el-card style="margin-top: 20px">
        <categorySelect
          @getCategoryId="getCategoryId"
          :show="scene!= 0"
        ></categorySelect>
      </el-card>

      <el-card style="margin-top: 20px">
        <div v-show="true">
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!category3Id"
            @click="addSpu"
            >添加SPU</el-button
          >
          <el-table :data="spuList" border style="width: 100%">
            <el-table-column
              label="序号"
              width="60px"
              type="index"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="spuName" label="spu名称" width="width">
            </el-table-column>
            <el-table-column prop="description" label="spu描述" width="width">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="{ row, $index }">
                <hint-button
                  type="success"
                  icon="el-icon-plus"
                  title="添加sku"
                  @click="addSku(row)"
                ></hint-button>
                <hint-button
                  type="warning"
                  icon="el-icon-edit"
                  title="修改spu"
                  @click="updateSpu(row)"
                ></hint-button>
                <hint-button
                  type="info"
                  icon="el-icon-info"
                  title="查看当前spu的skuspu"
                  @click="handler(row)"
                ></hint-button>
                <el-popconfirm title="确定删除该spu吗？" @onConfirm="deleteSpu(row)">
                  <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <!-- :pager-count="1" -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            style="text-align: center"
            :current-page="page"
            :page-sizes="[3, 5, 10]"
            :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>

      <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- table展示sku列表-->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
           <template slot-scope="{row,$index}">
               <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
           </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    </div>
    <SpuInfo v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuInfo>
    <SkuInfo v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuInfo>
  </div>
</template>

<script>
// import '@/mixin/categorySelect'
import SkuInfo from "./SkuInfo";
import SpuInfo from "./SpuInfo";

export default {
  name: "Spu",
  components: {
    SkuInfo,
    SpuInfo,
  },
  data() {
    return {
      loading:true,
      skuList:[],
      spu:{},
      dialogTableVisible:false,
      page: 1,
      limit: 4,
      total: 0,
      scene: 0,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // records
      spuList: [],
      visible: false,
    };
  },
  methods: {
    close(done){
      this.loading = true
      this.skuList = []
      done()
    },
    //查看SKU的按钮的回调
    async handler(spu) {
      //点击这个按钮的时候，对话框可见的
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //loading隐藏
        this.loading = false;
      }
    },
    changeScenes(scene){
      this.scene = scene
    },
    addSku(row){
      this.scene=2
      this.$refs.sku.getData(this.category1Id, this.category2Id,row)
    },
    async deleteSpu(row){
      let res = await this.$API.spu.reqDeletSpu(row.id)
      if(res.code==200){
        this.$message({
          type:'success',
          message:'删除成功'
        })
        this.getSpuList(this.spuList>1?this.page:1)
      }
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpudata(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initAttr(row);
    },
    changeScene({ scene, flag }) {
      this.scene = scene;
      // console.log(flag)
      if (flag == "update") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    handleCurrentChange(page) {
      this.getSpuList(page);
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
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
        this.getSpuList();
      }
    },
    async getSpuList(pager = 1) {
      this.page = pager;
      let result = await this.$API.spu.reqSpuList(
        pager,
        this.limit,
        this.category3Id
      );
      // console.log(result)
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
  },
};
</script>

<style></style>
