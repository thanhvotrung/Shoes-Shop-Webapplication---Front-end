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
                  <li><a href="#"><i class="fa fa-heart"></i>THÊM VÀO DANH SÁCH YÊU THÍCH</a></li>
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
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-uppercase font-weight-500" id="profile-tab" data-bs-toggle="tab"
                          data-bs-target="#profile" type="button"
                          role="tab" aria-controls="profile" aria-selected="false">Hình ảnh feedback
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-uppercase font-weight-500" id="contact-tab" data-bs-toggle="tab"
                          data-bs-target="#contact" type="button"
                          role="tab" aria-controls="contact" aria-selected="false">Đánh giá sản phẩm
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div ref="utextDesc">
                  </div>
                </div>
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                  <p>Koila is a chair designed for restaurants and food lovers in general. Designed in collaboration
                    with restaurant professionals, it ensures comfort and an ideal posture, as there are armrests on
                    both sides of the chair. </p>
                  <p>Koila is a seat designed for restaurants and gastronomic places in general. Designed in
                    collaboration with professional of restaurants and hotels field, this armchair is composed of a
                    curved shell with a base in oak who has pinched the back upholstered in fabric or leather. It
                    provides comfort and holds for ideal sitting position,the arms may rest on the sides ofthe armchair.
                    <br>Solid oak construction.<br> Back in plywood (2 faces oak veneer) or upholstered in fabric,
                    leather or eco-leather.<br> Seat upholstered in fabric, leather or eco-leather. <br> H 830 x L 585 x
                    P 540 mm.</p>
                </div>
                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                  <div class="product-comment">
                    <div class="mt-box">
                      <div class="mt-hold">
                        <ul class="mt-star">
                          <li><i class="fa fa-star"></i></li>
                          <li><i class="fa fa-star"></i></li>
                          <li><i class="fa fa-star"></i></li>
                          <li><i class="fa fa-star-o"></i></li>
                        </ul>
                        <span class="name">John Wick</span>
                        <time datetime="2016-01-01">09:10 Nov, 19 2016</time>
                      </div>
                      <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit sse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non</p>
                    </div>
                    <div class="mt-box">
                      <div class="mt-hold">
                        <ul class="mt-star">
                          <li><i class="fa fa-star"></i></li>
                          <li><i class="fa fa-star"></i></li>
                          <li><i class="fa fa-star-o"></i></li>
                          <li><i class="fa fa-star-o"></i></li>
                        </ul>
                        <span class="name">John Wick</span>
                        <time datetime="2016-01-01">09:10 Nov, 19 2016</time>
                      </div>
                      <p>Usmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit sse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non</p>
                    </div>
                    <form action="#" class="p-commentform">
                      <fieldset>
                        <h2>Add Comment</h2>
                        <div class="mt-row">
                          <label>Rating</label>
                          <ul class="mt-star">
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star-o"></i></li>
                            <li><i class="fa fa-star-o"></i></li>
                          </ul>
                        </div>
                        <div class="mt-row">
                          <label>Name</label>
                          <input type="text" class="form-control">
                        </div>
                        <div class="mt-row">
                          <label>E-Mail</label>
                          <input type="text" class="form-control">
                        </div>
                        <div class="mt-row">
                          <label>Review</label>
                          <textarea class="form-control"></textarea>
                        </div>
                        <button type="submit" class="btn-type4">ADD REVIEW</button>
                      </fieldset>
                    </form>
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
                  <Slide v-for="(product) in relatedProducts" :key="product.id" class="slide">
                    <div class="mt-product1" style="width: 95%">
                      <div class="box">
                        <div class="b1">
                          <div class="b2">
                            <img style="width: 100%" v-if="product.images" :src="product.images"
                                 alt="image description">
                            <img v-else src="http://placehold.it/275x285" alt="image description">
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


</style>