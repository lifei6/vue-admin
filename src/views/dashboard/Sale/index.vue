<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!-- @tab-click="handleClick" -->
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="date1">
        <span @click="getDay">今日</span>
        <span @click="getWeek">本周</span>
        <span @click="getMonth">本月 </span>
        <span @click="getYear">本年</span>

        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date2"
          size="mini"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div>
      <el-row>
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul class="sort">
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>3</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  data() {
    return {
      activeName: "sale",
      barCharts: null,
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  methods: {
    getDay() {
      const date = dayjs().format("YYYY-MM-DD");

      this.date = [date, date];
    },
    getWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    getMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    getYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  mounted() {
    this.barCharts = echarts.init(this.$refs.charts);
    this.barCharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "yellowgreen",
        },
      ],
    });
  },
  watch: {
    title: {
        // immediate:true,
        handler:function() {
        this.barCharts.setOption({
          title: {
            text: this.title + "趋势",
          },
          xAxis: {
            data:
              this.activeName == "sale"
                ? this.listState.orderFullYearAxis
                : this.listState.userFullYearAxis,
          },
          series: [
            {
              name: "Direct",
              type: "bar",
              barWidth: "60%",
              color: this.activeName == "sale" ? "skyblue" : "red",
              data:
                this.activeName == "sale"
                  ? this.listState.orderFullYear
                  : this.listState.userFullYear,
            },
          ],
        });
      },
    },
    listState(){
        this.barCharts.setOption({
          title: {
            text: this.title + "趋势",
          },
          xAxis: {
            data: this.listState.orderFullYearAxis
          },
          series: [
            {
              name: "Direct",
              type: "bar",
              barWidth: "60%",
              color: "skyblue",
              data: this.listState.orderFullYear
            },
          ],
        });
    }
  },
};
</script>

<style scoped>
.sort {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
.sort li {
  height: 10%;
}
.sort li > span {
  margin-right: 20px;
  /* margin-bottom: 10px; */
}
.rvalue {
  float: right;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 60%;
  background-color: black;
  color: white;
  text-align: center;
  font-size: 20px;
}
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}

.date1 span {
  margin: 0 10px;
}

.date1 {
  position: absolute;
  right: 0;
}

.date2 {
  width: 280px;
}

.charts {
  width: 100%;
  height: 300px;
}
</style>
