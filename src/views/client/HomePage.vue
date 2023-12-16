<template>
  <LayoutView>
    <div class="mt-main-slider">
      <Carousel :autoplay="3000" :wrap-around="true" :transition="1000">
        <Slide v-for="(slide,index) in this.imageSlideList" :key="index">
          <div class="slider" style="width: 100%">
            <img style="width: 100%; height: 110vh; object-fit: cover" :src="slide.url" :alt="slide.url">
          </div>
        </Slide>
        <template #addons>
          <Pagination/>
        </template>
      </Carousel>
    </div>
    <main id="mt-main">
      <!-- mt new product start here -->
      <div class="mt-bestseller bg-grey text-center wow fadeInUp" data-wow-delay="0.4s">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 mt-heading text-uppercase">
              <h2 class="heading">Sản phẩm mới</h2>
              <!--              <p>Sản phẩm này mới ga đó ba</p>-->
            </div>
          </div>
          <div class="row" v-if="newProducts">
            <div class="col-xs-12">
              <div class="">
                <Carousel v-bind="settings" :breakpoints="breakpoints">
                  <Slide v-for="(product) in fetchNewProductAndWishlist" :key="product.id" class="slide">
                    <div class="mt-product1 large">
                      <div class="box">
                        <div class="b1">
                          <div class="b2">

                            <img style="width: 95%; min-height: 38rem" v-if="product.images" :src="product.images"
                                 alt="image description">
                            <img v-else src="http://placehold.it/275x285" alt="image description">
                            <span class="caption">
															<span class="new">NEW</span>
														</span>
                            <ul class="links add">
                              <li><a href="#" data-bs-toggle="modal" @click="productId = product.id"
                                     data-bs-target="#modal-add-to-cart"><i class="icon-handbag"></i></a></li>
                              <li v-if="product.wishlist == false"><a href="#"
                                                                      @click.prevent="handleAddToWishlist(product.id)"><i
                                  class="icomoon icon-heart-empty"></i></a>
                              </li>
                              <li v-else>
                                <router-link to="/wishlist"><i
                                    style="color: red"
                                    class="icomoon icon-heart-empty"></i></router-link>
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
                        <strong class="title text-overflow" style="width:100%">
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
                    </div><!-- mt product1 center end here -->
                  </Slide>
                  <template #addons="{slidesCount}">
                    <Navigation v-if="slidesCount > 4"/>
                  </template>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- mt new product end -->

      <!-- mt top view start here -->
      <div class="mt-bestseller bg-grey text-center wow fadeInUp" data-wow-delay="0.4s">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 mt-heading text-uppercase">
              <h2 class="heading">Sản Phẩm được quan tâm</h2>
              <!--              <p>...</p>-->
            </div>
          </div>
          <div class="row" v-if="topViewProducts">
            <div class="col-xs-12">
              <div class="">
                <Carousel v-bind="settingsTopView" :breakpoints="breakpointsTopView">
                  <Slide v-for="(product) in fetchTopProductAndWishlist" :key="product.id" class="slide">
                    <div class="mt-product1 large">
                      <div class="box">
                        <div class="b1">
                          <div class="b2">
                            <a>

                              <img style="width: 95%; min-height: 38rem" v-if="product.images" :src="product.images"
                                   alt="image description">
                              <img v-else src="http://placehold.it/275x285" alt="image description">
                            </a>
                            <span class="caption">
														</span>
                            <ul class="links add">
                              <li><a href="#" data-bs-toggle="modal" @click="productId = product.id"
                                     data-bs-target="#modal-add-to-cart"><i class="icon-handbag"></i></a></li>
                              <li v-if="product.wishlist == false"><a href="#"
                                                                      @click.prevent="handleAddToWishlist(product.id)"><i
                                  class="icomoon icon-heart-empty"></i></a>
                              </li>
                              <li v-else>
                                <router-link to="/wishlist"><i
                                    style="color: red"
                                    class="icomoon icon-heart-empty"></i></router-link>
                              </li>
                              <li>
                                <router-link class=""
                                             :to="{name: 'ProductDetails', params: {slug: product.slug, id: product.id}}">
                                  <i class="icomoon fa fa-eye"></i></router-link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="txt">
                        <strong class="title text-overflow" style="width: 100%">
                          <router-link class=""
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
                        <span>Lượt xem: <span>{{ product.views }}</span></span>
                      </div>
                    </div><!-- mt product1 center end here -->
                  </Slide>
                  <template #addons="{slidesCount}">
                    <Navigation v-if="slidesCount > 4"/>
                  </template>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- mt top view end  -->

    </main>
    <div>
      <ModalAddToCart :id="productId"/>
    </div>
  </LayoutView>
</template>

<style scoped>
.text-overflow {
  font-size: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>

<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import ModalAddToCart from "@/components/client/ModalAddToCart.vue";

import {mapState} from 'vuex';


import {Carousel, Navigation, Slide, Pagination} from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default {
  name: 'HomeView',
  components: {
    ModalAddToCart,
    LayoutView,
    Carousel,
    Slide,
    Navigation,
    Pagination,
  },

  computed: {
    ...mapState({
      name: state => state.name,
    }),

    fetchNewProductAndWishlist() {
      const products = this.newProducts.map(product => ({
        ...product,
        wishlist: (JSON.parse(localStorage.getItem('w_ls')) || []).includes(product.id),
      }));

      return products;
    },

    fetchTopProductAndWishlist() {
      const products = this.topViewProducts.map(product => ({
        ...product,
        wishlist: (JSON.parse(localStorage.getItem('w_ls')) || []).includes(product.id),
      }));

      return products;
    }
  },

  data() {
    return {
      newProducts: null,
      topViewProducts: null,

      imageSlideList: [
        {url: 'https://images.pexels.com/photos/457445/pexels-photo-457445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'},
        {url: 'https://static.nike.com/a/images/f_auto/dpr_1.4,cs_srgb/w_1280,c_limit/e17ae72a-3158-428d-a211-10a1aa161117/nike-just-do-it.png'},
        {url: 'https://images.pexels.com/photos/9892919/pexels-photo-9892919.jpeg'},
        {url: 'https://images.pexels.com/photos/7311610/pexels-photo-7311610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
        {url: 'https://images.pexels.com/photos/12628402/pexels-photo-12628402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'},
      ],
      settings: {
        itemsToShow: 1,
        snapAlign: 'center',
        wrapAround: true,
        autoplay: 4000,
        transition: 800,
        pauseAutoplayOnHover: true
      },
      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: 3.5,
          snapAlign: 'center',
        },
        // 1024 and up
        1024: {
          itemsToShow: 3.5,
          snapAlign: 'center',
        },
      },

      settingsTopView: {
        itemsToShow: 1,
        snapAlign: 'start',
        wrapAround: true,
        autoplay: 4000,
        transition: 800,
        pauseAutoplayOnHover: true
      },
      breakpointsTopView: {
        // 700px and up
        700: {
          itemsToShow: 3,
          snapAlign: 'start',
        },
        // 1024 and up
        1024: {
          itemsToShow: 3,
          snapAlign: 'start',
        },
      },

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
    async fetchData() {
      await axios.get(`http://localhost:3030/api/product/new-products`).then(res => {
        this.newProducts = res.data
      }).catch(err => {
        console.log(err)
      })

      await axios.get(`http://localhost:3030/api/product/top-view-products`).then(res => {
        this.topViewProducts = res.data
      }).catch(err => {
        console.log(err)
      })
    },

    handleAddToWishlist(id) {
      const wishlist = JSON.parse(localStorage.getItem('w_ls')) || [];
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem('w_ls', JSON.stringify(wishlist));
        this.newProducts = this.newProducts.slice();
        this.topViewProducts = this.topViewProducts.slice();
        // const updateWishlist = products => {
        //   const index = products.findIndex(item => item.id === id);
        //   if (index !== -1) {
        //     products[index].wishlist = true;
        //   }
        // };
        //
        // updateWishlist(this.fetchNewProductAndWishlist);
        // updateWishlist(this.fetchTopProductAndWishlist);
      }
    }
  },


  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.fetchData()
  }
}
</script>
