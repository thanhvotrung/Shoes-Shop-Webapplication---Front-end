<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios";

export default {
  name: "ListPromotion",
  components: {LayoutView,},
  data() {
    return {
      code: null,
      name:null,
      publish: "",
      active: "",

      promotions: null,
      totalPages: null,
      currentPage: null,
    }
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        this.handleQueryChange(newQuery);
      }
    },
  },

  methods: {
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/promotions`)
          .then(res => {
            const response = res.data
            this.promotions = response.content
            this.totalPages = response.totalPages
            this.currentPage = response.number +1
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

    async handleQueryChange(query) {
      await axios.get(`http://localhost:3030/api/admin/promotions`, {params: query}).then(res => {
        const response = res.data
        this.promotions = response.content
        this.totalPages = response.totalPages
        this.currentPage = response.number +1
      }).catch(err => {
        console.log(err)
      })
    },
  },

  mounted() {
    this.$router.push({query: {}})
    this.fetchData()
  }

}
</script>

<template>
  <LayoutView>
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
              <input v-model="code" @change="this.$router.push({query: {...this.$route.query, code: this.code}})" type="text" name="code" id="code" class="form-control search-input">
            </th>
            <th>
              <input v-model="name" @change="this.$router.push({query: {...this.$route.query, name: this.name}})" type="text" name="name" id="name" class="form-control search-input">
            </th>
            <th>
              <select v-model="publish" @change="this.$router.push({query: {...this.$route.query, publish: this.publish}})" name="publish" class="form-control search-select" id="publish">
                <option value="">Tất cả</option>
                <option value="0">Ẩn</option>
                <option value="1">Công khai</option>
              </select>
            </th>
            <th>
              <select v-model="active" @change="this.$router.push({query: {...this.$route.query, active: this.active}})" name="active" class="form-control search-select" id="active">
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
        <!-- mt pagination start here -->
        <nav class="mt-pagination">
          <ul v-if="totalPages" class="list-inline">
            <li v-if="currentPage != 1">
              <router-link :to="{query: {...this.$route.query, page: 1}}"><i class="bi bi-chevron-bar-left"></i>
              </router-link>
            </li>
            <li v-if="currentPage != 1">
              <router-link :to="{query: {...this.$route.query, page: currentPage - 1}}">
                <i class="bi bi-chevron-left"></i>
              </router-link>
            </li>
            <li v-for="page in totalPages" :key="page">
              <router-link v-if="page == currentPage" style="background-color: #ff6060; color: #fff"
                           :to="{query: {...this.$route.query, page: page}}">{{ page }}
              </router-link>
              <router-link v-else :to="{query: {...this.$route.query, page: page}}">{{ page }}
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {...this.$route.query, page: currentPage + 1}}">
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {...this.$route.query, page: totalPages}}"><i
                  class="bi bi-chevron-bar-right"></i>
              </router-link>
            </li>

          </ul>
        </nav>
        <!-- mt pagination end here -->
      </div>
    </section>
  </LayoutView>
</template>

<style scoped>

</style>