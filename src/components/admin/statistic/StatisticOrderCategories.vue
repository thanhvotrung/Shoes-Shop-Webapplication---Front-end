<script>
import {PieChart} from "vue-chart-3";
import {Chart, PieController,ArcElement} from 'chart.js'
import axios from "axios";
Chart.register(PieController,ArcElement)
export default {
  name: "StatisticOrderCategories",
  components: {PieChart},
  data(){
    return{
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
      }
    }
  },

  computed: {
    chartData(){
      let data = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(86,255,140, 0.2)',
            'rgba(86,23,213, 0.2)',
            'rgba(121,237,248, 0.2)',
            'rgba(255,0,0, 0.2)',
            'rgba(208,208,208, 0.2)',
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(86,255,140)',
            'rgb(86,23,213)',
            'rgb(121,237,248)',
            'rgba(255,0,0,0.42)',
            'rgb(208,208,208)',
          ],
          borderWidth: 1,
          hoverOffset: 4
        }]
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
      await axios.get(`http://localhost:3030/api/admin/product-order-categories`).then(res => {
        this.data = res.data
      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<template>
  <div style="background-color: #fff; border-radius: 5px" class="px-2 py-2 mb-3" v-if="data">
    <PieChart
        :options="chartOptions"
        :chartData="chartData"
    />
  </div>

</template>

<style scoped>

</style>