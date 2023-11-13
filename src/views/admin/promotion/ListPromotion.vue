<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios";

export default {
  name: "ListPromotion",
  components: {LayoutView,},
  data() {
    return {
      promotions: null,
    }
  },

  methods: {
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/promotions`)
          .then(res => {
            console.log(res)
            this.promotions = res.data.content
          }).catch(err => {
            console.log(err)
          })
    },
    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleString('vi-VN', options);
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
  },

  mounted() {
    this.fetchData()
  }

}
</script>

<template>
  <LayoutView>
    <section role="main" class="content-body" id="main-content">
      <header class="page-header">
        <div class="right-wrapper text-right mr-5">
          <ol class="breadcrumbs">
            <li>
              <router-link to="/admin">
                <i class="bx bx-home-alt"></i>
              </router-link>
            </li>
            <li><span>Danh sách khuyến mại</span></li>
          </ol>
        </div>
      </header>

      <section class="card">
        <header class="card-header">
          <h2 class="card-title">Danh sách khuyến mại</h2>
        </header>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-6">
              <div class="mb-3">
                <router-link to="/admin/promotions/create" class="btn btn-primary mx-1 text-2"
                             style="border: 1px solid #cccc">
                  Thêm mới khuyến mại <i class="bi bi-plus-circle-dotted"></i>
                </router-link>
                <button id="btn-search" class="btn btn-primary mx-1 text-2">Tìm kiếm <i
                    class="bi bi-search"></i></button>
              </div>
            </div>
          </div>
          <table class="table table-bordered table-striped mb-0" id="datatable-editable">
            <thead>
            <tr>
              <th width="15%">Mã khuyến mại</th>
              <th>Tên khuyến mại</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Giá trị</th>
              <th>Ngày hết hạn</th>
            </tr>
            <tr class="heading-search">
<!--              <form method="GET" id="search-form">-->
                <th>
                  <input type="text" name="code" id="code" class="form-control search-input">
                </th>
                <th>
                  <input type="text" name="name" id="name" class="form-control search-input">
                </th>
                <th>
                  <select name="publish" class="form-control search-select" id="publish">
                    <option value="">Tất cả</option>
                    <option value="0">Ẩn</option>
                    <option value="1">Công khai</option>
                  </select>
                </th>
                <th>
                  <select name="active" class="form-control search-select" id="active">
                    <option value="">Tất cả</option>
                    <option value="0">Vô hiệu hóa</option>
                    <option value="1">Kích hoạt</option>
                  </select>
                </th>
                <th></th>
                <th></th>
                <input type="hidden" name="page" id="page">
<!--              </form>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(promotion,index) in promotions" :key="index">
              <td>
                <router-link :to="{name: 'EditPromotion', params: {id: promotion.id}}">{{
                    promotion.couponCode
                  }}
                </router-link>
              </td>
              <td>{{ promotion.name }}</td>
              <td>
                <span v-if="promotion.public" class="badge badge-success">Công khai</span>
                <span v-else class="badge badge-danger">Ẩn</span>
              </td>
              <td>
                <span v-if="promotion.active" class="badge badge-success">Kích hoạt</span>
                <span v-else class="badge badge-danger">Vô hiệu hóa</span>
              </td>
              <td>
                <span v-if="promotion.discountType === 1">{{ promotion.discountValue }} %</span>
                <span v-if="promotion.discountType === 2">{{ formattedPrice(promotion.discountValue) }}</span>
              </td>
              <td>
                <span>{{ formattedDate(promotion.expiredAt) }}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <br>
          <!-- Pagination -->
          <!--          <nav aria-label="Page navigation">-->
          <!--            <ul class="pagination" id="pagination"></ul>-->
          <!--          </nav>-->
        </div>
      </section>

    </section>
  </LayoutView>
</template>

<style scoped>

</style>