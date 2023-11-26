<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import jwtDecode from "jwt-decode";

export default {
  name: "ListOrder",
  components: {LayoutView},
  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        console.log('Query parameters changed:', newQuery);
        this.handleQueryChange(newQuery);
      }
    },
  },

  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    return {
      orders: null,
      currentPage: null,
      totalPages: null,

      id: null,
      name: null,
      phone: null,
      status: "",

      email: null,
      token: null,

    }
  },
  methods: {
    decodeJwt() {
      const token = this.token;
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.email = decodedToken.sub;
        } catch (error) {
          console.error('JWT Decoding Error:', error);
        }
      }
    },

    async handleQueryChange(query) {
      await axios.get(`http://localhost:3030/api/admin/orders`, {params: query}).then(res => {
        const response = res.data
        this.orders = response.content
        this.totalPages = response.totalPages
        this.currentPage = response.number +1
      }).catch(err => {
        console.log(err)
      })
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/orders`).then(res => {
        const response = res.data
        this.orders = response.content
        this.currentPage = response.number + 1
        this.totalPages = response.totalPages
      })
    },

    async handleUpdateDelivery(id){
      await axios.put(`http://localhost:3030/api/admin/orders/update-delivery/${id}`,  this.email)
          .then(res => {
            console.log(res)
            this.toast.success("Cập nhật trạng thái thành công!")
            this.fetchData()
          }).catch(err => {
            console.log(err)
          })

    },

    async handleUpdateCompleted(id){
      await axios.put(`http://localhost:3030/api/admin/orders/update-completed/${id}`, this.email).then(res => {
        console.log(res)
        this.toast.success("Cập nhật trạng thái thành công!")
        this.fetchData()
      }).catch(err => {
        console.log(err)
      })
    },

    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleString('vi-VN', options);
    },
  },
  mounted() {
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.fetchData()
  }
}
</script>

<template>
  <LayoutView>
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách đơn hàng</h2>
      </header>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-6">
            <div class="mb-3">
              <router-link to="/admin/orders-list/create" class="btn btn-primary mx-1 text-2"
                           style="border: 1px solid #cccc">
                Thêm mới đơn hàng <i class="bi bi-plus-circle-dotted"></i>
              </router-link>
            </div>
          </div>
        </div>
        <table class="table table-bordered table-striped mb-0" id="datatable-editable">
          <thead>
          <tr>
            <th width="8%">Mã đơn hàng</th>
            <th>Người nhận</th>
            <th>Điện thoại</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Ngày sửa</th>
            <th>Xác nhận</th>
          </tr>
            <tr class="heading-search">
<!--              <form method="GET" id="search-form">-->
                <th>
                  <input v-model="id" type="text" name="id" id="id" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, id: this.id}})">
                </th>
                <th>
                  <input v-model="name" type="text" name="name" id="name" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, name: this.name}})">
                </th>
                <th>
                  <input v-model="phone" type="text" name="phone" id="phone" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, phone: this.phone}})">
                </th>
                <th>
                  <select v-model="status" name="status" class="form-control search-select" id="status" @change="this.$router.push({query: {...this.$route.query, status: this.status}})">
                    <option value="">Tất cả</option>
                    <option value="1">Chờ lấy hàng</option>
                    <option value="2">Đang giao hàng</option>
                    <option value="3">Đã giao hàng</option>
                    <option value="4">Đơn hàng bị trả lại</option>
                    <option value="5">Đơn hàng bị hủy</option>
                  </select>
                </th>
                <th></th>
                <th></th>
                <input type="hidden" name="page" id="page">
<!--              </form>-->
            </tr>
          </thead>
          <tbody v-if="orders">
            <tr v-for="order in orders" :key="order.id">
              <td>
                <a href="/admin/orders/update/{id}" >{{order.id}}</a>
              </td>
              <td>{{order.receiverName}}</td>
              <td>{{order.receiverPhone}}</td>
              <td>
                <span v-if="order.status == 1" class="badge badge-warning">Chờ lấy hàng</span>
                <span v-if="order.status == 2" class="badge badge-primary">Đang giao hàng</span>
                <span v-if="order.status == 3" class="badge badge-success">Đã giao hàng</span>
                <span v-if="order.status == 4" class="badge badge-danger">Đơn hàng bị trả lại</span>
                <span v-if="order.status == 5" class="badge badge-light">Đơn hàng bị hủy</span>
              </td>
              <td>
                <span>{{formattedDate(order.createdAt)}}</span>
              </td>
              <td>
                <span v-if="order.modifiedAt">{{formattedDate(order.modifiedAt)}}</span>
              </td>
              <td>
                <button v-if="order.status == 1" class="btn btn-warning updateButton"  @click="handleUpdateDelivery(order.id)">Đã giao cho đơn vị vận chuyển</button>
                <button v-if="order.status == 2" class="btn btn-secondary updateButton"  @click="handleUpdateCompleted(order.id)">Đã giao cho khách hàng</button>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <!-- Pagination -->
        <nav aria-label="Page navigation">
          <ul class="pagination" id="pagination"></ul>
        </nav>
      </div>
    </section>

<!--  </section>-->
  </LayoutView>
</template>

<style scoped>

</style>