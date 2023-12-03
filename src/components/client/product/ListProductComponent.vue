<script>
import {ref} from 'vue'
import axios from "axios";
import Slider from '@vueform/slider'
import "@vueform/slider/themes/default.css"
import ModalAddToCart from "@/components/client/ModalAddToCart.vue";
import {useRoute} from "vue-router";

export default {
  name: "ListProductComponent",
  components: {ModalAddToCart, Slider},

  async setup() {

    const route = useRoute()
    const products = ref(null)
    const categories = ref(null)
    const brands = ref(null)

    const sortingOption = ref('')
    const name = ref('')
    const sizes = ref([35, 36, 37, 38, 39, 40, 41, 42])
    const brandsCheck = ref([])
    const categoriesCheck = ref([])
    const sizesCheck = ref([])
    const totalPages = ref(null)
    const currentPage = ref(null)

    const rangePriceValue = ref([0, 100])


    await axios.get("http://localhost:3030/api/client/categories").then(res => {
      categories.value = res.data
    })
    await axios.get("http://localhost:3030/api/client/brands").then(res => {
      brands.value = res.data
    })

    const newQuery = {
      name: name.value,
      brands: brandsCheck.value,
      categories: categoriesCheck.value,
      sizes: sizesCheck.value,
      min_price: rangePriceValue.value[0] * 100000 || 0,
      max_price: rangePriceValue.value[1] * 100000 || 10000000,
      page: route.query.page || 1,
      sorting_option: sortingOption.value
    }

    await axios.post("http://localhost:3030/api/client/products", newQuery).then(res => {
      const response = res.data
      products.value = response.items
      totalPages.value = response.totalPages
      currentPage.value = response.currentPage
    })
    await new Promise(resolve => setTimeout(resolve, 500)); // 1000 milliseconds = 1 giây

    return {
      products, categories, brands,
      sortingOption,
      name,
      sizes,
      brandsCheck,
      categoriesCheck,
      sizesCheck,
      totalPages,
      currentPage,
      rangePriceValue,
    }
  },

  data() {
    return {
      productId: null,
      format: function (rangePriceValue) {
        return `${Math.round(rangePriceValue * 100000)} VND`
      }
    }
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler() {
        this.handleQueryChange();
        // window.scrollTo({ top: 0, behavior: 'smooth' })
        // this.scrollToTop()
      }
    },
    'sizesCheck': {
      immediate: true,
      handler(val) {
        this.$router.push({query: {...this.$route.query, page: 1, sizes_filter: val}})
      }
    },
    name(val) {
      this.$router.push({query: {...this.$route.query, page: 1, name_filter: val}})
    },
    sortingOption(val) {
      this.$router.push({query: {...this.$route.query, page: 1, sorting_option: val}})
    },
    brandsCheck(val) {
      this.$router.push({query: {...this.$route.query, page: 1, brands_filter: val}})
    },
    categoriesCheck(val) {
      this.$router.push({query: {...this.$route.query, page: 1, categories_filter: val}})
    },
    rangePriceValue(val) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1,
          min_price: Math.round(val[0] * 100000),
          max_price: Math.round(val[1] * 100000)
        }
      })
    },
  },

  methods: {
    async handleQueryChange() {
      const newQuery = {
        name: this.name,
        brands: this.brandsCheck,
        categories: this.categoriesCheck,
        sizes: this.sizesCheck,
        min_price: this.rangePriceValue[0] * 100000 || 0,
        max_price: this.rangePriceValue[1] * 100000 || 10000000,
        page: this.$route.query.page || 1,
        sorting_option: this.sortingOption
      }
      // await new Promise(resolve => setTimeout(resolve, 500)); // 1000 milliseconds = 1 giây
      await axios.post("http://localhost:3030/api/client/products", newQuery).then(res => {
        const response = res.data
        this.products = response.items
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
  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.$router.push({query: {}})
  }
}
</script>

<template>
  <main id="mt-main">
    <div class="container">
      <div class="row">
        <!-- sidebar of the Page start here -->
        <aside id="sidebar" class="col-xs-12 col-sm-4 col-md-3 wow fadeInLeft" data-wow-delay="0.4s">
          <nav class="breadcrumbs">
            <ul class="list-unstyled d-flex">
              <li>
                <router-link to="/">Trang chủ</router-link>&ensp;<i class="fa fa-angle-right"></i>&ensp;
              </li>
              <li>Danh sách sản phẩm</li>
            </ul>
          </nav>
          <!-- shop-widget filter-widget of the Page start here -->
          <section class="shop-widget filter-widget bg-grey">
            <h2 class="text-5">Bộ lọc sản phẩm</h2>
            <!--              <div class="nice-form search-title">-->
            <!--                <button @click="this.$router.replace({'query': null});">Hủy lọc</button>-->
            <!--              </div>-->
            <div>
              <span class="sub-title">Lọc theo tên</span>
              <div class="nice-form search-title">
                <input v-model="name" class="search-title-item" type="text" placeholder="Tìm kiếm theo tên">
              </div>
              <!-- nice-form end here -->
            </div>

            <div>
              <span class="sub-title">Lọc theo thương hiệu</span>
              <!-- nice-form start here -->
              <ul v-if="brands" class="list-unstyled nice-form">
                <li v-for="(brand) in brands" :key="brand.id">
                  <label :for="brand.name">
                    <input v-model="brandsCheck" :value="brand.id" :id="brand.name"
                           type="checkbox">
                    <span class="fake-input"></span>
                    <span class="fake-label">{{ brand.name }}</span>
                  </label>
                </li>
              </ul><!-- nice-form end here -->
            </div>

            <div>
              <span class="sub-title">Lọc theo loại giày</span>
              <!-- nice-form start here -->
              <ul v-if="categories" class="list-unstyled nice-form">
                <li v-for="(category) in categories" :key="category.id">
                  <label :for="category.name">
                    <input v-model="categoriesCheck" :id="category.name" :value="category.id"
                           type="checkbox">
                    <span class="fake-input"></span>
                    <span class="fake-label">{{ category.name }}</span>
                  </label>
                </li>
              </ul><!-- nice-form end here -->
            </div>

            <div>
              <span class="sub-title">Lọc theo kích thước</span>
              <div class="nice-form d-flex flex-wrap">
                <div v-for="(size2) in sizes" :key="size2" class="mr-2 mb-2 rounded">
                  <input v-model="sizesCheck" type="checkbox" class="btn-check" name="options-size"
                         :id="size2" :value="size2">
                  <label style="width:100%" class="btn btn-outline-secondary text-5" :for="size2">{{
                      size2
                    }}</label>
                </div>
              </div>
            </div>

            <div>
              <span class="sub-title" style="margin-bottom: 40px">Lọc theo giá tiền</span>
              <div class="mt-3">
                <Slider v-model="rangePriceValue" :format="format"/>
              </div>
              <div class="price-range mt-3">
                <span class="price">Giá tiền &nbsp;   {{ formattedPrice(rangePriceValue[0] * 100000) }}  &nbsp;  -  &nbsp;   {{
                    formattedPrice(rangePriceValue[1] * 100000)
                  }}</span>
              </div>
            </div>

          </section><!-- shop-widget filter-widget of the Page end here -->
        </aside><!-- sidebar of the Page end here -->
        <div class="col-xs-12 col-sm-8 col-md-9 wow fadeInRight" data-wow-delay="0.4s">
          <!-- mt shoplist header start here -->
          <header class="mt-shoplist-header">
            <!--               btn-box start here -->
            <div class="btn-box">
              <ul class="list-inline">
                <li>
                  <a style="width: 18rem; text-align: center" href="#" class="drop-link">
                    <span v-if="sortingOption == ''">Mặc định</span>
                    <span v-else-if="sortingOption == 'asc'">Giá từ thấp đến cao</span>
                    <span v-else>Giá từ cao đến thấp</span>
                    &ensp;<i aria-hidden="true" class="fa fa-angle-down"></i>
                  </a>
                  <div class="drop">
                    <ul class="list-unstyled">
                      <li><a @click="sortingOption = ''" href="#">Mặc định</a></li>
                      <li><a @click="sortingOption = 'asc'" href="#">Giá từ thấp đến cao</a></li>
                      <li><a @click="sortingOption = 'desc'" href="#">Giá từ cao đến thấp</a></li>

                    </ul>
                  </div>
                </li>
              </ul>
              <!--                <select v-model="sortingOption">-->
              <!--                  <option value="">Mặc định</option>-->
              <!--                  <option value="asc">Giá từ thấp đến cao</option>-->
              <!--                  <option value="desc">Giá từ cao đến thấp</option>-->
              <!--                </select>-->

            </div>
            <!--               btn-box end here -->
            <!--               mt-textbox start here -->
            <!--                            <div class="mt-textbox">-->
            <!--                              <p>Showing <strong>1–9</strong> of <strong>65</strong> results</p>-->
            <!--                            </div>-->
            <!--               mt-textbox end here -->
          </header>
          <!-- mt shoplist header end here -->
          <!-- mt productlisthold start here -->

          <ul class="mt-productlisthold list-inline d-flex flex-wrap justify-content-start">
            <li v-for="product in products" :key="product.id">
              <!-- mt product1 large start here -->
              <div class="mt-product1">
                <div class="box">
                  <div class="b1">
                    <div class="b2">
                      <img style="min-height: 38rem" v-if="product.images" :src="product.images"
                           alt="image description">
                      <img v-else src="http://placehold.it/276x286"
                           alt="image description">
                      <ul class="links add">
                        <li><a href="#" data-bs-toggle="modal" @click="productId = product.id"
                               data-bs-target="#modal-add-to-cart"><i class="icon-handbag"></i></a></li>
                        <li><a href="#"><i class="icomoon icon-heart-empty"></i></a></li>
                        <li>
                          <router-link
                              :to="{name: 'ProductDetails', params: {slug: product.slug, id: product.id}}">
                            <i class="icomoon fa fa-eye"></i></router-link>
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
          </ul>
          <!-- mt productlisthold end here -->

          <section v-if="products <= 0" class="mt-error-sec dark vh-100">
            <div class="container">
              <div class="row">
                <div class="col-xs-12 text-center">
                  <h1 class="text-uppercase montserrat">Không tìm thấy sản phẩm nào.</h1>
                </div>
              </div>
            </div>
          </section>

          <!-- mt pagination start here -->
          <nav v-else class="mt-pagination">
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
</template>

<style scoped>
.btn {
  border-color: #d0d0d0;
}

.btn-check:checked + .btn {
  background-color: #f4f2f2;
  color: #000000;
  border: 1px solid #4b4b4b;
}

.mt-pagination ul a {
  padding: 5px 15px;
}

.search-title input {
  padding: 3px 9px;
  border: 2px solid #777676;
  border-radius: 5px;
  outline: none;
}

</style>