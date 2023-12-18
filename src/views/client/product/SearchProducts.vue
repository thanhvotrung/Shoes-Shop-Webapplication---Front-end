<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import ModalAddToCart from "@/components/client/ModalAddToCart.vue";
import {mapMutations} from "vuex";

export default {
  name: "SearchProducts",
  components: {LayoutView, ModalAddToCart},

  watch: {
    '$route.query': {
      immediate: true,
      handler() {
        this.handleQueryChange();
      }
    },
  },

  data() {
    return {
      productId: null,

      products: [],
      totalPages: null,
      currentPage: null,
      totalItems: null
    }
  },

  methods: {
    async handleQueryChange() {
      await axios.get("http://localhost:3030/api/client/search", {params: this.$route.query}).then(res => {
        const response = res.data
        this.products = response.items
        this.totalItems = response.totalItems
        this.totalPages = response.totalPages
        this.currentPage = response.currentPage
      })
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    async fetchData() {
      await axios.get("http://localhost:3030/api/client/search", {params: this.$route.query}).then(res => {
        const response = res.data
        this.products = response.items
        this.totalItems = response.totalItems
        this.totalPages = response.totalPages
        this.currentPage = response.currentPage
      })
    },

    handleAddToWishlist(id) {
      const wishlist = JSON.parse(localStorage.getItem('w_ls')) || [];
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem('w_ls', JSON.stringify(wishlist));
        this.products = this.products.slice();
        this.handleUpdateCountWlsItem()
      }
    },

    // use vuex store to update count wishlist and cartlist
    ...mapMutations(['setCountWlsItem']),

    handleUpdateCountWlsItem() {
      let wls = JSON.parse(localStorage.getItem('w_ls')) || [];
      // Lấy giá trị mới từ computed property của component hiện tại
      const newCountWlsItem = wls.length;
      // Cập nhật giá trị trong store Vuex
      this.setCountWlsItem(newCountWlsItem);
    },
  },

  computed: {
    fetchProductsOfWishlist() {
      return this.products.map(product => ({
        ...product,
        wishlist: (JSON.parse(localStorage.getItem('w_ls')) || []).includes(product.id),
      }));
    },
  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.fetchData()
  }
}
</script>

<template>
  <LayoutView>
    <main id="mt-main">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 mt-heading text-uppercase text-center py-5">
            <h2 class="heading">{{ totalItems }} Kết quả tìm kiếm cho: " {{ this.$route.query.keyword }} "</h2>
          </div>
        </div>
        <div class="row">
          <!-- sidebar of the Page start here -->
          <div class="col-xs-12 col-sm-8 col-md-12 wow fadeInRight" data-wow-delay="0.4s">
            <!-- mt shoplist header start here -->
            <!-- mt productlisthold start here -->
            <ul v-if="products" class="mt-productlisthold list-inline d-flex flex-wrap justify-content-start">
              <li v-for="product in fetchProductsOfWishlist" :key="product.id" style="width:25%">
                <!-- mt product1 large start here -->
                <div class="mt-product1">
                  <div class="box">
                    <div class="b1">
                      <div class="b2">
                        <img v-if="product.images" :src="product.images"
                             alt="image description">
                        <img v-else src="http://placehold.it/276x286"
                             alt="image description">
                        <ul class="links add">
                          <li><a href="#" data-bs-toggle="modal" @click="productId = product.id"
                                 data-bs-target="#modal-add-to-cart"><i class="bi bi-handbag"></i></a></li>
                          <li v-if="product.wishlist == false"><a href="#"
                                                                  @click.prevent="handleAddToWishlist(product.id)">
                            <i class="bi bi-suit-heart"></i>
                          </a>
                          </li>
                          <li v-if="product.wishlist == true">
                            <router-link to="/wishlist"><i
                                style="color: red"
                                class="bi bi-suit-heart-fill"></i></router-link>
                          </li>
                          <li>
                            <router-link
                                :to="{name: 'ProductDetails', params: {slug: product.slug, id: product.id}}">
                              <i class="bi bi-eye"></i></router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="txt">
                    <strong class="title">
                      <router-link
                          :to="{name: 'ProductDetails', params: {slug: product.slug, id: product.id}}">
                        {{
                          product.name
                        }}
                      </router-link>
                    </strong>
                    <span v-if="product.promotionPrice > 0" class="price"><span
                        style="text-decoration: line-through; font-size: 12px; color: #757575">{{
                        formattedPrice(product.price)
                      }}</span> <span>{{ formattedPrice(product.promotionPrice) }}</span></span>
                    <span v-else class="price"><span>{{ formattedPrice(product.price) }}</span></span>
                  </div>
                  <br>
                </div><!-- mt product1 center end here -->
              </li>

            </ul><!-- mt productlisthold end here -->
            <section v-if="products <= 0" class="mt-error-sec dark">
              <div class="container">
                <div class="row">
                  <div class="col-xs-12 text-center">
                    <h1 class="text-uppercase montserrat">Không tìm thấy sản phẩm nào.</h1>
                    <ul class="list-unstyled btn-list">
                      <li class="d-flex flex-column align-items-center w-100">
                        <router-link to="/" class="btn-back text-uppercase" style="width:300px">Quay về trang chủ
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <!-- mt pagination start here -->
            <nav class="mt-pagination">
              <ul v-if="totalPages" class="list-inline">
                <li class="mb-2" v-if="currentPage != 1">
                  <router-link :to="{query: {...this.$route.query, page: 1}}"><i class="bi bi-chevron-bar-left"></i>
                  </router-link>
                </li>
                <li class="mb-2" v-if="currentPage != 1">
                  <router-link :to="{query: {...this.$route.query, page: currentPage - 1}}">
                    <i class="bi bi-chevron-left"></i>
                  </router-link>
                </li>
                <li class="mb-2" v-for="page in totalPages" :key="page">
                  <router-link v-if="page == currentPage" style="background-color: #ff6060; color: #fff"
                               :to="{query: {...this.$route.query, page: page}}">{{ page }}
                  </router-link>
                  <router-link v-else :to="{query: {...this.$route.query, page: page}}">{{ page }}
                  </router-link>
                </li>
                <li class="mb-2" v-if="currentPage != totalPages">
                  <router-link :to="{query: {...this.$route.query, page: currentPage + 1}}">
                    <i class="bi bi-chevron-right"></i>
                  </router-link>
                </li>
                <li class="mb-2" v-if="currentPage != totalPages">
                  <router-link :to="{query: {...this.$route.query, page: totalPages}}"><i
                      class="bi bi-chevron-bar-right"></i>
                  </router-link>
                </li>

              </ul>
            </nav><!-- mt pagination end here -->
          </div>
        </div>
      </div>
    </main>
    <div>
      <ModalAddToCart :id="productId"/>
    </div>
  </LayoutView>
</template>

<style scoped>
.mt-pagination .bi {
  -webkit-text-stroke: 1px;
}
</style>