<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类" >
        <el-select  placeholder="请输入" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="good1.name" :value="good1.id" v-for="(good1,index) in list1" :key="good1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select   placeholder="请输入" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="good2.name" :value="good2.id" v-for="(good2,index) in list2" :key="good2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select   placeholder="请输入" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="good3.name" :value="good3.id" v-for="(good3,index) in list3" :key="good3.id"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  props:['show'],
  data() {
    return {
        list1:[],
        list2:[],
        list3:[],
        cForm:{
            category1Id:'',
            category2Id:'',
            category3Id:'',

        }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List(){
        let result =await this.$API.attr.reqCategory1List()
        // console.log(result)
        if(result.code==200){
            this.list1 = result.data
        }
    },
    async handler1(){
        this.list2 = []
        this.list3 = []
        this.cForm.category2Id=''
        this.cForm.category3Id=''

        this.$emit('getCategoryId',{categoryId:this.cForm.category1Id,level:1})
        let result = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
        if(result.code==200){
            this.list2 = result.data
        }
    },
    async handler2(){
      this.list3 = []
      this.cForm.category3Id=''
      this.$emit('getCategoryId',{categoryId:this.cForm.category2Id,level:2})

        let result = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
        if(result.code==200){
            this.list3 = result.data
        }
    },
    handler3(){
        this.$emit('getCategoryId',{categoryId:this.cForm.category3Id,level:3})
    },
  },
};
</script>

<style></style>
