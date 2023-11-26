<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios";
import {useToast} from "vue-toastification";

export default {
  name: "AdminProducts",
  components: {LayoutView},

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
      brands: null,
      categories: null,
      products: null,
      totalPages: null,
      currentPage: null,

      id: null,
      name: null,
      category: null,
      brand: null,
    }
  },

  methods: {
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

    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/products`, {params: this.$route.query}).then(res => {

        const response = res.data
        this.products = response.content
        this.totalPages = response.totalPages
        this.currentPage = response.number + 1
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
      })

      await axios.get(`http://localhost:3030/api/admin/categories`).then(res => {
        this.categories = res.data.content
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
      })

      await axios.get(`http://localhost:3030/api/admin/brands`).then(res => {
        this.brands = res.data.content
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
      })
    },

    async deleteProduct(id) {
      await axios.delete(`http://localhost:3030/api/admin/products/${id}`)
          .then(res => {
            this.toast.success(res.data)
            this.fetchData()
            console.log(res)
          }).catch(err => {
            console.log(err)
            this.toast.warning(err.response.data.message)
          })
    },

    async handleQueryChange(query) {
      await axios.get(`http://localhost:3030/api/admin/products`, {params: query}).then(res => {
        const response = res.data
        this.products = response.content
        this.totalPages = response.totalPages
        this.currentPage = response.number +1
      }).catch(err => {
        console.log(err)
      })
    },
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<template>
  <LayoutView>
    <!--    <section role="main" class="content-body" id="main-content">-->
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách sản phẩm</h2>
      </header>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-6">
            <div class="mb-3">
              <router-link style="border: 1px solid #cccc" class="btn btn-primary mx-1 text-2" to="/admin/products/create">Thêm mới sản phẩm <i
                  class="bi bi-plus-circle-dotted"></i>
              </router-link>
            </div>
          </div>
        </div>
        <table class="table table-bordered table-striped mb-0" id="datatable-editable">
          <thead>
          <tr>
            <th style="width:8%">Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Ảnh</th>
            <th>Nhãn hiệu</th>
            <th>Danh mục</th>
            <th>Giá nhập</th>
            <th>Giá bán</th>
            <th>Ngày tạo</th>
            <th>Ngày sửa</th>
            <th>Đã bán</th>
            <th>Thao tác</th>
          </tr>
          <tr>
            <!--            <form method="GET" id="search-form">-->
            <!--                        <th></th>-->
            <th>
              <input v-model="id" type="text" name="id" id="id" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, id: this.id}})">
            </th>
            <th>
              <input v-model="name" type="text" name="name" id="name" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, name: this.name}})">
            </th>
            <th></th>
            <th>
              <select v-model="brand" name="brand" class="form-control search-select" id="brand" @change="this.$router.push({query: {...this.$route.query, brand: this.brand}})">
                <option value="">Tất cả</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id" >{{ brand.name }}</option>
              </select>
            </th>
            <th>
              <select v-model="category" name="category" class="form-control search-select" id="category" @change="this.$router.push({query: {...this.$route.query, category: this.category}})">
                <option value="">Tất cả</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <input type="hidden" name="page" id="page">
            <!--            </form>-->
          </tr>
          </thead>
          <tbody v-if="products">
          <tr v-for="product in products" :key="product.id" data-item-id="1">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td><img style="width: 100px" :src="product.images[0]" alt="alt"></td>
            <td>{{ product.brand.name }}</td>
            <td v-if="product.categories">
              <div v-for="category in product.categories" :key="category.id">
                <span>{{ category.name }}</span>
              </div>
            </td>
            <td class="money">{{ formattedPrice(product.price) }}</td>
            <td class="money">{{ formattedPrice(product.salePrice) }}</td>
            <td>{{ formattedDate(product.createdAt) }}</td>
            <td>{{ formattedDate(product.modifiedAt) }}</td>
            <td>{{ product.totalSold }}</td>
            <td class="actions">
              <button class="btn text-4 ">
                <router-link :to="{name: 'EditProduct', params: {id: product.id}}">
                  <i class="btn-update bi bi-pencil-square"></i>
                </router-link>
              </button>
<!--              <button @click="deleteProduct(product.id)" class="btn text-4 btn-delete"><i class="bi bi-trash3"></i></button>-->
            </td>
          </tr>
          </tbody>
        </table>
        <br>
        <!-- mt pagination start here -->
        <nav class="mt-pagination">
          <ul v-if="totalPages" class="list-inline">
            <li v-if="currentPage != 1">
              <router-link :to="{query: {page: 1}}"><i class="bi bi-chevron-bar-left"></i>
              </router-link>
            </li>
            <li v-if="currentPage != 1">
              <router-link :to="{query: {page: currentPage - 1}}">
                <i class="bi bi-chevron-left"></i>
              </router-link>
            </li>
            <li v-for="page in totalPages" :key="page">
              <router-link v-if="page == currentPage" style="background-color: #ff6060; color: #fff"
                           :to="{query: {page: page}}">{{ page }}
              </router-link>
              <router-link v-else :to="{query: {page: page}}">{{ page }}
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {page: currentPage + 1}}">
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {page: totalPages}}"><i class="bi bi-chevron-bar-right"></i>
              </router-link>
            </li>

          </ul>
        </nav><!-- mt pagination end here -->
      </div>
    </section>
    <!--    </section>-->
  </LayoutView>
</template>

<style>
@import 'bootstrap-icons/font/bootstrap-icons.css';

.actions {
  display: flex;
  border: none !important;
}

.btn-delete:hover {
  color: orangered;
}

.btn-update:hover {
  color: lightgreen;
}
</style>