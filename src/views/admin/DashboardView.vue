<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios";
import ChartBar from "@/components/admin/statistic/ChartBar.vue";

import StatisticOrderCategories from "@/components/admin/statistic/StatisticOrderCategories.vue";
import StatisticOrderBrands from "@/components/admin/statistic/StatisticOrderBrands.vue";
import ChartProductOrderTopInMonth from "@/components/admin/statistic/ChartProductOrderTopInMonth.vue";

export default {
  name: "DashboardView",
  components: {ChartProductOrderTopInMonth, StatisticOrderCategories, StatisticOrderBrands, ChartBar, LayoutView,},
  data() {
    return {
      countProduct: 0,
      countBrand: 0,
      countCategory: 0,
      countPost: 0,
      countOrder: 0,
      countUser: 0,


      totalSales: 0,
      totalProfit: 0,
      totalQuantity: 0,

    }
  },

  methods: {

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/count/products`).then(res => this.countProduct = res.data)
      await axios.get(`http://localhost:3030/api/admin/count/brands`).then(res => this.countBrand = res.data)
      await axios.get(`http://localhost:3030/api/admin/count/categories`).then(res => this.countCategory = res.data)
      await axios.get(`http://localhost:3030/api/admin/count/posts`).then(res => this.countPost = res.data)
      await axios.get(`http://localhost:3030/api/admin/count/orders`).then(res => this.countOrder = res.data)
      await axios.get(`http://localhost:3030/api/admin/count/users`).then(res => this.countUser = res.data)

      await axios.get(`http://localhost:3030/api/admin/statistics/total-sales`).then(res => this.totalSales = res.data)
      await axios.get(`http://localhost:3030/api/admin/statistics/total-profit`).then(res => this.totalProfit = res.data)
      await axios.get(`http://localhost:3030/api/admin/statistics/total-quantity`).then(res => this.totalQuantity = res.data)

    }

  },

  mounted() {
    this.fetchData()
  }
}
</script>

<template>
<<<<<<< HEAD
<LayoutView>
  <section style="background-color:#f1f1f1" role="main" class="content-body" id="main-content">

    <div class="row">
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-primary mb-3">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countProduct }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Số lượng sản phẩm</h4>
                </div>
                <div class="summary-footer">
                  <router-link to="/admin/products" class="text-muted text-uppercase">(Xem chi tiết)</router-link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-secondary">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countCategory }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Tổng số danh mục</h4>
                </div>
                <div class="summary-footer">
                  <a class="text-muted text-uppercase" href="/admin/categories">(Xem chi tiết)</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-secondary">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countPost }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Tổng số bài viết</h4>
                </div>
                <div class="summary-footer">
                  <a class="text-muted text-uppercase" href="/admin/posts">(Xem chi tiết)</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-tertiary mb-3">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countOrder }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Tổng số đơn hàng</h4>
                </div>
                <div class="summary-footer">
                  <a class="text-muted text-uppercase" href="/admin/orders">(Xem chi tiết)</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-quaternary">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countBrand }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Tổng số nhãn hiệu</h4>
                </div>
                <div class="summary-footer">
                  <a class="text-muted text-uppercase" href="/admin/brands">(Xem chi tiết)</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="col-xl-4">
        <section class="card card-featured-left card-featured-tertiary mb-3">
          <div class="card-body">
            <div class="widget-summary">
              <div class="widget-summary-col widget-summary-col-icon">
                <div class="summary-icon bg-secondary">
                  {{ countUser }}
                </div>
              </div>
              <div class="widget-summary-col">
                <div class="">
                  <h4 class="text-5">Tổng số Khách hàng</h4>
                </div>
                <div class="summary-footer">
                  <a class="text-muted text-uppercase" href="/admin/users">(Xem chi tiết)</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div>
      <ChartBar/>
    </div>
  </section>
</LayoutView>
=======
  <LayoutView>
    <section style="background-color:#f1f1f1" role="main" class="content-body" id="main-content">

      <div class="row">
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-tertiary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng doanh thu</h4>
                    <h2>{{ formattedPrice(totalSales) }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-tertiary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng lợi nhuận</h4>
                    <h2>{{ formattedPrice(totalProfit) }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-tertiary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Số lượng đã bán</h4>
                    <h2>{{ (totalQuantity) }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-primary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countProduct }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Số lượng sản phẩm</h4>
                  </div>
                  <div class="summary-footer">
                    <router-link to="/admin/products" class="text-muted text-uppercase">(Xem chi tiết)</router-link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-secondary">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countCategory }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng số danh mục</h4>
                  </div>
                  <div class="summary-footer">
                    <a class="text-muted text-uppercase" href="/admin/categories">(Xem chi tiết)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-secondary">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countPost }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng số bài viết</h4>
                  </div>
                  <div class="summary-footer">
                    <a class="text-muted text-uppercase" href="/admin/posts">(Xem chi tiết)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-tertiary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countOrder }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng số đơn hàng</h4>
                  </div>
                  <div class="summary-footer">
                    <a class="text-muted text-uppercase" href="/admin/orders">(Xem chi tiết)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-quaternary">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countBrand }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng số nhãn hiệu</h4>
                  </div>
                  <div class="summary-footer">
                    <a class="text-muted text-uppercase" href="/admin/brands">(Xem chi tiết)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="card card-featured-left card-featured-tertiary mb-3">
            <div class="card-body">
              <div class="widget-summary">
                <div class="widget-summary-col widget-summary-col-icon">
                  <div class="summary-icon bg-secondary">
                    {{ countUser }}
                  </div>
                </div>
                <div class="widget-summary-col">
                  <div class="">
                    <h4 class="text-5">Tổng số Khách hàng</h4>
                  </div>
                  <div class="summary-footer">
                    <a class="text-muted text-uppercase" href="/admin/users">(Xem chi tiết)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div>
        <ChartBar/>
        <StatisticOrderCategories/>
        <StatisticOrderBrands/>
        <ChartProductOrderTopInMonth/>
      </div>
    </section>
  </LayoutView>
>>>>>>> origin/master
</template>

<style scoped>

</style>