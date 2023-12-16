<script>
import axios from "axios";
import {useToast} from "vue-toastification";
import jwtDecode from "jwt-decode";
import testComponent from "@/components/TestComponent.vue";

export default {
  name: "ListOrderComponent",
  components: {testComponent},
  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
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

      isPopupOpen: false,
      idOrder: null,
      statusOrder: null,
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
        this.currentPage = response.number + 1
      }).catch(err => {
        console.log(err)
      })
    },

    async fetchData() {
      // await new Promise(resolve => setTimeout(resolve, 1000)); // 1000 milliseconds = 1 giây
      await axios.get(`http://localhost:3030/api/admin/orders`).then(res => {
        const response = res.data
        this.orders = response.content
        this.currentPage = response.number + 1
        this.totalPages = response.totalPages
      })
    },

    async handleUpdateDelivery(id) {
      await axios.put(`http://localhost:3030/api/admin/orders/update-delivery/${id}`, this.email)
          .then(res => {
            console.log(res)
            this.toast.success("Cập nhật trạng thái thành công!")
            this.fetchData()
          }).catch(err => {
            console.log(err)
          })

    },

    async handleUpdateCompleted(id) {
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

    openPopup(id, status) {
      this.isPopupOpen = true
      this.idOrder = id
      this.statusOrder = status
    },
    handleYes() {
      if(this.statusOrder == 1){
        this.handleUpdateDelivery(this.idOrder)
      }
      if(this.statusOrder == 2){
        this.handleUpdateCompleted(this.idOrder)
      }
      // Handle 'Yes' button click
      console.log("User clicked Yes");
      this.isPopupOpen = false;
      this.idOrder = null
      this.statusOrder = null
    },
    handleNo() {
      // Handle 'No' button click
      console.log("User clicked No");
      this.isPopupOpen = false;
      this.idOrder = null
      this.statusOrder = null
    },
  },

  mounted() {
    this.$router.push({query: {}})
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.fetchData()
  }
}
</script>

<template>
  <section class="card">
    <header class="card-header">
      <h2 class="card-title">Danh sách đơn hàng</h2>
    </header>
    <div class="card-body">
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
            <input v-model="id" type="text" name="id" id="id" class="form-control search-input"
                   @change="this.$router.push({query: {...this.$route.query, id: this.id}})">
          </th>
          <th>
            <input v-model="name" type="text" name="name" id="name" class="form-control search-input"
                   @change="this.$router.push({query: {...this.$route.query, name: this.name}})">
          </th>
          <th>
            <input v-model="phone" type="text" name="phone" id="phone" class="form-control search-input"
                   @change="this.$router.push({query: {...this.$route.query, phone: this.phone}})">
          </th>
          <th>
            <select v-model="status" name="status" class="form-control search-select" id="status"
                    @change="this.$router.push({query: {...this.$route.query, status: this.status}})">
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
            <router-link :to="{name: 'EditOrder', params: {id: order.id}}">{{ order.id }}</router-link>
          </td>
          <td>{{ order.receiverName }}</td>
          <td>{{ order.receiverPhone }}</td>
          <td>
            <span v-if="order.status == 1" class="badge badge-warning">Chờ lấy hàng</span>
            <span v-if="order.status == 2" class="badge badge-primary">Đang giao hàng</span>
            <span v-if="order.status == 3" class="badge badge-success">Đã giao hàng</span>
            <span v-if="order.status == 4" class="badge badge-danger">Đơn hàng bị trả lại</span>
            <span v-if="order.status == 5" class="badge badge-light">Đơn hàng bị hủy</span>
          </td>
          <td>
            <span>{{ formattedDate(order.createdAt) }}</span>
          </td>
          <td>
            <span v-if="order.modifiedAt">{{ formattedDate(order.modifiedAt) }}</span>
          </td>
          <td>
            <button v-if="order.status == 1" class="btn btn-warning updateButton"
                    @click="openPopup(order.id, order.status)">Đã giao cho đơn vị vận chuyển
            </button>
            <button v-if="order.status == 2" class="btn btn-secondary updateButton"
                    @click="openPopup(order.id, order.status)">Đã giao cho khách hàng
            </button>

            <!--            <button v-if="order.status == 1" class="btn btn-warning updateButton"  @click="handleUpdateDelivery(order.id)">Đã giao cho đơn vị vận chuyển</button>-->
            <!--            <button v-if="order.status == 2" class="btn btn-secondary updateButton"  @click="handleUpdateCompleted(order.id)">Đã giao cho khách hàng</button>-->
          </td>
        </tr>
        </tbody>
      </table>
      <br>
      <!-- Pagination -->
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
            <router-link :to="{query: {...this.$route.query, page: totalPages}}"><i class="bi bi-chevron-bar-right"></i>
            </router-link>
          </li>

        </ul>
      </nav><!-- mt pagination end here -->
    </div>
  </section>

  <div>
    <!-- Other content of your component -->

    <!--    <button @click="openPopup(id)">Open Popup</button>-->

    <!-- Include the PopupYesNo component -->
    <testComponent
        v-if="isPopupOpen"
        :show="isPopupOpen"
        message="Xác nhận cập nhật đơn hàng?"
        @yes="handleYes"
        @no="handleNo"
    ></testComponent>
  </div>
</template>

<style scoped>
.btn-confirm {
  padding: 5px 10px;
  margin: 5px 5px;
  border: none;
  outline: none;
}
</style>