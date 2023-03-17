export default {
    data() {
        return {
          category1Id: "",
          category2Id: "",
          category3Id: "",
          attrList: [],
        }
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
      },
}