<script>
import {reactive} from 'vue'
import ModalAddToCart from "@/components/client/ModalAddToCart.vue";
import axios from "axios";
import {useStore} from "vuex";


export default {
  name: "WishlistComponent",
  components: {ModalAddToCart},

  async setup() {
    const store = useStore()
    const wishlist2 = reactive(JSON.parse(localStorage.getItem('w_ls')) || [])
    const wishlist = reactive([])

    const fetchData = async () => {
      for (let i = 0; i < wishlist2.length; i++) {
        await axios.get(`http://localhost:3030/api/${wishlist2[i]}`).then(res => {
          let item = res.data;
          const item2 = {
            id: item.id,
            name: item.name,
            images: item.productImages[0] || '',
            price: item.price,
            promotionPrice: item.promotionPrice,
            slug: item.slug
          };
          wishlist.push(item2);
        });
      }
    };

    if (wishlist2.length > 0) {
      await fetchData();
    }

    // Thực hiện mutations để cập nhật countWlsItem
    const handleUpdateCountWlsItem = () => {
      let wls = JSON.parse(localStorage.getItem('w_ls')) || [];
      // Lấy giá trị mới từ computed property của component hiện tại
      const newCountWlsItem = wls.length;
      // Cập nhật giá trị trong store Vuex
      store.commit('setCountWlsItem', newCountWlsItem);
    };

    const handleDeleteItemInWls = (id) => {
      if (wishlist2.includes(id)) {
        // wishlist2.filter(item => item !== id);
        wishlist2.splice(wishlist2.findIndex(item => item === id), 1);
        localStorage.setItem('w_ls', JSON.stringify(wishlist2));
        wishlist.splice(wishlist.findIndex(item => item.id === id), 1);
        handleUpdateCountWlsItem()
      }
    };

    return {
      wishlist,
      handleDeleteItemInWls
    }
  },

  data() {
    return {
      productId: null,
    }
  },

  methods: {
    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
  },

}
</script>

<template>
  <main style="background-color: #f4f2f2" id="mt-main">
    <div class="banner-wls">
      <div>Danh sách sản phẩm yêu thích của bạn</div>
    </div>
    <div v-if="wishlist" class="container">
      <div class="row">
        <!-- sidebar of the Page start here -->
        <div class="col-xs-12 col-sm-12 col-md-12 wow fadeInRight" data-wow-delay="0.4s">
          <ul class="mt-productlisthold list-inline d-flex flex-wrap justify-content-start">
            <li v-for="product in wishlist" :key="product.id" style="width: 25%">

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
                        <li><a @click.prevent="handleDeleteItemInWls(product.id)" href="#"><i class="bi bi-trash3"></i></a>
                        </li>
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
              </div>

            </li>
          </ul>


          <section style="background-color: rgb(244, 242, 242)" v-if="wishlist <= 0" class="mt-error-sec dark vh-100">
            <div class="container">
              <div class="row">
                <div class="col-xs-12 text-center">
                  <h1 class="text-uppercase montserrat">Danh sách trống.</h1>
                </div>
              </div>
            </div>
          </section>

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

.banner-wls {
  background-color: #b4b4b4;
  color: #fff;
  text-align: center;
  height: 9rem;
  margin-bottom: 29px;
  font-size: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
}

</style>