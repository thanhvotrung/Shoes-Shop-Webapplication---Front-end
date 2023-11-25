<script>
import {BarChart} from "vue-chart-3";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js"
import axios from "axios";

Chart.register(BarController, CategoryScale, LinearScale, BarElement)

export default {
  name: "ChartBar",
  setup(){
    const currentDate = new Date().toISOString().split('T')[0];
    let late30Day = new Date();
    late30Day.setDate(late30Day.getDate() - 30)
    late30Day = late30Day.toISOString().split('T')[0]
    return {currentDate, late30Day}
  },
  data() {
    return {
      data: null,
      toDate: this.late30Day,
      fromDate:this.currentDate,
      maxDate: this.currentDate,

      chartOptions: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Thống kê doanh số',
            padding: {
              top: 10,
              bottom: 30
            }
          },
        }
      },
    }
  },
  watch: {
    toDate(){
      this.fetchData()
    },
    fromDate(){
      this.fetchData()
    }
  },
  computed: {
    chartData() {
      let data = {
        labels: [],
        datasets: [
          {
            label: 'Doanh thu',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            data: []
          },
          {
            label: 'Lợi nhuận',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: []
          },
          {
            label: 'Doanh số sản phẩm',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: []
          },
        ]
      }
      for (let i = 0; i < this.data.length; i++) {
        data.labels.push(this.data[i].createdAt)
        data.datasets[0].data.push(this.data[i].sales)
        data.datasets[1].data.push(this.data[i].profit)
        data.datasets[2].data.push(this.data[i].quantity)
      }
      return data
    }
  },
  methods: {
    async fetchData() {
      let data = {
        toDate: this.toDate,
        fromDate: this.fromDate
      }
      await axios.post(`http://localhost:3030/api/admin/statistics`, data).then(res => {
        this.data = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    handleTest(){
      console.log(this.toDate)
      console.log(this.fromDate)
    }
  },
  mounted() {
    this.fetchData()
  },
  components: {BarChart},

}
</script>

<template>
  <div style="background-color: #fff; border-radius: 5px" class="px-2 py-2 mb-3" v-if="data">
    <div class="form-group d-flex" style="padding: 10px 1rem;">
      &ensp;<label class="form-label" for="toDate">Từ:&ensp; </label>
      <input :max="maxDate" v-model="toDate" id="toDate" type="date"  class="toDate form-control" @change="handleTest">
      &ensp;<label class="form-label" for="fromDate">Đến:&ensp; </label>
      <input :max="maxDate" v-model="fromDate" id="fromDate" type="date" class="fromDate, form-control" @change="handleTest">
    </div>
  <BarChart id="my-chart-id"
            :options="chartOptions"
            :chartData="chartData"
  />
  </div>
</template>

<style scoped>

</style>