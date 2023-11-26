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
  name: "StatisticOrderBrands",

  data() {
    return {
      data: null,

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

  computed: {
    chartData() {
      let data = {
        labels: [],
        datasets: [
          {
            label: ['Số lượng'],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            data: []
          },
        ]
      }
      for (let i = 0; i < this.data.length; i++) {
        data.labels.push(this.data[i].label)
        data.datasets[0].data.push(this.data[i].value)
      }
      return data
    }
  },

  methods: {
    async fetchData() {

      await axios.get(`http://localhost:3030/api/admin/product-order-brands`).then(res => {
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
    <BarChart id="my-chart-id"
              :options="chartOptions"
              :chartData="chartData"
    />
  </div>
</template>

<style scoped>

</style>