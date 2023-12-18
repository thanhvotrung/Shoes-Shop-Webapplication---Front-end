<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import {Carousel, Navigation, Slide} from 'vue3-carousel'
import {useToast} from "vue-toastification";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';
import ModalAddToCart from "@/components/client/ModalAddToCart.vue";

export default {
  name: "ProductDetails",
  components: {ModalAddToCart, Navigation, LayoutView, Carousel, Slide, Form, Field},

  watch: {
    "$route.params"(){
      this.id = this.$route.params.id;
      this.slug = this.$route.params.slug;
      this.fetchData()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },

  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    const schemaQuantity = Yup.object().shape({
      quantity: Yup.number().required("Số lượng phải lớn hơn 0")
          .typeError("Không đúng định dạng.")
          .positive("Số lượng phải dương")
          .min(1, "Số lượng phải lớn hơn 0")
          .max(10, "Số lượng phải nhỏ hơn 10")

    })
    return {
      schemaQuantity,
      currentSlide: 0,

      productId: null,

      id: null,
      slug: null,
      product: null,
      isFavorite: false,
      relatedProducts: null,

      sizesVN: [35, 36, 37, 38, 39, 40, 41, 42],
      sizesProduct: [],
      size: null,
      quantity: 1,

      settings: {
        itemsToShow: 1,
        snapAlign: 'start',
        wrapAround: true,
        autoplay: 4000,
        transition: 800,
        pauseAutoplayOnHover: true
      },
      breakpoints: {
        400: {
          itemsToShow: 2,
          snapAlign: 'start',
        },
        // 700px and up
        700: {
          itemsToShow: 3,
          snapAlign: 'start',
        },
        // 1024 and up
        1024: {
          itemsToShow: 5,
          snapAlign: 'start',
        },
      },
    }
  },

  computed: {

    fetchRelatedProductsOfWishlist() {
      return this.relatedProducts.map(product => ({
        ...product,
        wishlist: (JSON.parse(localStorage.getItem('w_ls')) || []).includes(product.id),
      }));
    },

    filteredSizes() {
      return this.sizesVN.map(sizeVN => {
        const outStock = !this.sizesProduct.includes(sizeVN);
        return {
          size: sizeVN,
          outStock: outStock
        };
      });
    },
  },

  methods: {

    handleDeleteItemInWls(id) {
      const wishlist = JSON.parse(localStorage.getItem('w_ls')) || [];
      if (wishlist.includes(id)) {
        wishlist.splice(wishlist.findIndex(item => item === id), 1);
        localStorage.setItem('w_ls', JSON.stringify(wishlist));
        this.isFavorite = false
      }
    },

    handleAddToWishlist(id) {
      const wishlist = JSON.parse(localStorage.getItem('w_ls')) || [];
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem('w_ls', JSON.stringify(wishlist));
        this.relatedProducts = this.relatedProducts.slice();
      }
    },

    // xử lý cho sản phẩm chính
    handleAddToWishlist2(id) {
      const wishlist = JSON.parse(localStorage.getItem('w_ls')) || [];
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem('w_ls', JSON.stringify(wishlist));
        this.isFavorite = true
      }
    },

    slideTo(val) {
      this.currentSlide = val
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
    async fetchData() {
      let temp;
      await axios.get(`http://localhost:3030/api/${this.slug}/${this.id}`).then(res => {
        const product = res.data
        this.product = product
        document.title = product.name
        temp = product.description
      }).catch(err => {
        console.log(err)
      })
      this.$refs.utextDesc.innerHTML = temp

      await axios.get(`http://localhost:3030/api/product/sizes/${this.id}`).then(res => {
        this.sizesProduct = res.data
      }).catch(err => {
        console.log(err)
      })

      await axios.get(`http://localhost:3030/api/product/related-products/${this.id}`).then(res => {
        this.relatedProducts = res.data

      }).catch(err => {
        console.log(err)
      })
      this.isFavorite = (JSON.parse(localStorage.getItem('w_ls')) || []).includes(this.product.id)

    },

    handleTest() {
      if (!this.size) {
        this.toast.warning("Chọn kích cỡ giày.");
        return;
      }

      const cartList = JSON.parse(localStorage.getItem('cartList')) || [];

      const foundItem = cartList.find(item => item.product_id === this.id && item.size === this.size);

      if (foundItem) {
        foundItem.quantity += this.quantity;
      } else {
        const cartItem = {
          product_id: this.id,
          size: this.size,
          quantity: this.quantity,
        };
        cartList.push(cartItem);
      }

      localStorage.setItem('cartList', JSON.stringify(cartList));
      this.toast.success("Đã thêm vào giỏ hàng.")
      setTimeout(() => {
        this.$router.push("/cart")
      },1000)
    },
  },


  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.id = this.$route.params.id;
    this.slug = this.$route.params.slug;
    this.fetchData();
  }
}
</script>

<template>
  <LayoutView>
    <main v-if="product" id="mt-main">
      <!-- Mt Product Detial of the Page -->
      <section class="mt-product-detial wow fadeInUp" data-wow-delay="0.4s">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <!-- Slider of the Page -->
              <div class="slider">
                <Carousel style="width: 500px" id="gallery" :items-to-show="1" :transition="1000" :wrap-around="true"
                          v-model="currentSlide">
                  <Slide v-for="slide in product.productImages" :key="slide">
                    <div class="carousel__item">
                      <img :src="slide" alt="Slide">
                    </div>
                  </Slide>
                  <template #addons="{slidesCount}">
                    <Navigation v-if="slidesCount > 1"/>
                  </template>
                </Carousel>

                <Carousel style="width: 500px"
                          id="thumbnails"
                          :items-to-show="6"
                          v-model="currentSlide"
                          ref="carousel"
                          snapAlign="start"
                >
                  <Slide v-for="(slide,index) in product.productImages" :key="slide">
                    <div class="carousel__item" @click="slideTo(index)">
                      <img :src="slide" alt="slide">
                    </div>
                  </Slide>
                  <!--                  <template #addons="{slidesCount}">-->
                  <!--                    <Navigation v-if="slidesCount > 4"/>-->
                  <!--                  </template>-->
                </Carousel>
              </div>
              <!-- Slider of the Page end -->
              <!-- Detail Holder of the Page -->
              <div class="detial-holder">
                <!-- Breadcrumbs of the Page -->
                <ul class="list-unstyled breadcrumbs">
                  <li>
                    <router-link to="/">Trang chủ<i class="fa fa-angle-right"></i></router-link>
                  </li>
                  <li>
                    <router-link to="/products">Danh sách sản phẩm<i class="fa fa-angle-right"></i></router-link>
                  </li>
                  <li>{{ product.name }}</li>
                </ul>
                <!-- Breadcrumbs of the Page end -->
                <h2>{{ product.name }}</h2>
                <ul class="list-unstyled list">
                  <li v-if="isFavorite"><a style="color: red" href="#" @click.prevent="handleDeleteItemInWls(product.id)"><i class="bi bi-suit-heart-fill"></i> SẢN PHẨM YÊU THÍCH</a></li>
                  <li v-else ><a href="#" @click.prevent="handleAddToWishlist2(product.id)"><i class="bi bi-suit-heart-fill"></i> THÊM VÀO DANH SÁCH YÊU THÍCH</a></li>
                </ul>
                <div class="text-holder list">
                  <span v-if="product.promotionPrice > 0" class="price">{{ formattedPrice(product.promotionPrice) }}<del>{{
                      formattedPrice(product.price)
                    }}</del></span>
                  <span v-else class="price">{{ formattedPrice(product.price) }}</span>
                </div>
                <ul class="list">
                  <li>TÌNH TRẠNG:
                    <span class="text-success" v-if="sizesProduct.length > 0"> Còn hàng</span>
                    <span class="text-danger" v-else>Hết hàng</span>
                  </li>
                </ul>

                <div class="list d-flex justify-content flex-wrap">
                  <div v-for="(size2, index) in filteredSizes" :key="index" class="mr-2 mb-2 rounded">
                    <div v-if="size2.outStock">
                      <input disabled type="radio" class="btn-check" name="options-size" :id="index" :value="size2.size"
                             v-model="size">
                      <label style="width:90px" class="btn btn-outline-secondary text-5 text-decoration-line-through"
                             :for="index">EU {{ size2.size }}</label>
                    </div>
                    <div v-else>
                      <input type="radio" class="btn-check" name="options-size" :id="index" :value="size2.size"
                             v-model="size">
                      <label style="width:90px" class="btn btn-outline-secondary text-5" :for="index">EU {{
                          size2.size
                        }}</label>
                    </div>
                  </div>
                </div>
                <!-- Product Form of the Page -->
                <Form @submit="handleTest" class="product-form" :validation-schema="schemaQuantity" v-slot="{ errors }">
                  <fieldset>
                    <div class="row-val">
<!--                      <label for="qty">Số lượng</label>-->
                        <div class="item-quantity d-flex">
                          <button type="button" v-if="quantity < 1 ? quantity = 1: quantity" @click="quantity -= 1"><i
                              class="bi bi-dash"></i></button>
                          <Field :class="{'is-invalid': errors.quantity}" name="quantity" type="number" v-model="quantity"/>
                          <button type="button" v-if="quantity > 10 ? quantity = 10: quantity" @click="quantity += 1"><i class="bi bi-plus"></i>
                          </button>
                        </div>
                    </div>
                    <div class="row-val">
                      <button v-if="sizesProduct.length > 0" type="submit" style="width:100%">Thêm vào giỏ hàng</button>
                      <button disabled style="background-color: rgb(120, 120, 120); width:100%" v-else>Hết hàng</button>
                    </div>
                  </fieldset>
                  <div class="text-danger font-italic text-1">{{ errors.quantity }}</div>
                </Form>
                <!-- Product Form of the Page end -->
              </div>
              <!-- Detail Holder of the Page end -->
            </div>
          </div>
        </div>
      </section><!-- Mt Product Detial of the Page end -->
      <div class="product-detail-tab wow fadeInUp" data-wow-delay="0.4s">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active text-uppercase font-weight-500" id="home-tab" data-bs-toggle="tab"
                          data-bs-target="#home"
                          type="button" role="tab" aria-controls="home" aria-selected="true">Mô tả chi tiết sản phẩm
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div ref="utextDesc">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- related products start here -->
      <div class="mt-bestseller bg-grey text-center wow fadeInUp" data-wow-delay="0.4s">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 mt-heading text-uppercase">
              <h2 class="heading">Bạn cũng có thể thích</h2>
            </div>
          </div>
          <div class="row" v-if="relatedProducts">
            <div class="col-xs-12">
              <div class="">
                <Carousel v-bind="settings" :breakpoints="breakpoints">
                  <Slide v-for="(product) in fetchRelatedProductsOfWishlist" :key="product.id" class="slide">
                    <div class="mt-product1" style="width: 95%">
                      <div class="box">
                        <div class="b1">
                          <div class="b2">
                            <img style="width: 100%" v-if="product.images" :src="product.images"
                                 alt="image description">
                            <img v-else src="http://placehold.it/275x285" alt="image description">
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
                              </li>                              <li>
                                <router-link
                                    :to="{name: 'ProductDetails', params: {slug: product.slug, id: product.id}}">
                                  <i class="bi bi-eye"></i></router-link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="txt">
                        <strong class="title" style="width:100%">
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
    </main>
    <div><ModalAddToCart :id="productId"/></div>
  </LayoutView>
</template>

<style scoped>
.mt-product-detial h2 {
  font-size: 31px;
  line-height: 46px;
  font-weight: 500;
  letter-spacing: normal;
  word-spacing: normal;
  margin: 0 0 15px;
  color: #000;
}

.item-quantity {
  border: 1px solid #fff;
  border-radius: 50px;
  background-color: #fff;
}

.item-quantity button{
  border-radius: 5px;
  width: 4rem;
}

.item-quantity input {
  text-align: center;
  padding: 0;
  width: 4rem;
}



.item-quantity input::-webkit-outer-spin-button,
.item-quantity input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-quantity .bi {
  -webkit-text-stroke: 1px;
}
</style>