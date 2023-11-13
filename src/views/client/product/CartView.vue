<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import {Carousel, Slide} from 'vue3-carousel'
import jwtDecode from "jwt-decode";
import {Form, Field} from "vee-validate";
import * as Yup from 'yup';
import {useToast} from "vue-toastification";
import Popper from "vue3-popper";

export default {
  name: "CartView",
  components: {LayoutView, Carousel, Slide, Form, Field, Popper},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    // Validate form
    const schema = Yup.object().shape({
      name: Yup.string().required("Tên người nhận không được trống."),
      phone: Yup.string().required("Số điện thoại không được trống.")
          .typeError("Không đúng định dạng."),
      address: Yup.string().required("Địa chỉ không được trống."),
    })
    return {
      schema,
      cartsLocal: [],
      cartList: [],

      token: null,
      user: null,
      email: null,

      promotion: null,
      promotionName: null,
      discountType: null,
      discountValue: null,
      maximumDiscountValue: null,

      subtotal: 0,
      total: 0,
      discount: 0,
    }
  },
  computed: {},

  methods: {
    async fetchData() {
      let couponCode = null
      this.cartsLocal = JSON.parse(localStorage.getItem('cartList')) || [];
      if (this.cartsLocal.length > 0) {
        for (let i = 0; i < this.cartsLocal.length; i++) {
          await axios.get(`http://localhost:3030/api/${this.cartsLocal[i].product_id}`).then(res => {
            let item = res.data;
            let quantity = this.cartsLocal[i].quantity;
            couponCode = item.couponCode
            const item2 = {
              name: item.name,
              images: item.productImages || [],
              couponCode: item.couponCode,
              price: item.price,
              promotionPrice: item.promotionPrice,
              size: this.cartsLocal[i].size,
              quantity: quantity,
              total: item.price * quantity
            }
            this.cartList.push(item2)
          }).catch(err => {
            console.log(err)
          })
        }
        this.promotionName = couponCode
        this.promotion = couponCode
        await this.checkPromotion(couponCode)

      }
      // console.log(this.cartList)
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    deleteItem(index) {
      this.cartsLocal.splice(index, 1)
      this.cartList.splice(index, 1)
      this.checkAfterDeleteItem(this.promotionName)
      localStorage.setItem('cartList', JSON.stringify(this.cartsLocal));
    },

    // Giải mã JWT token sang object User
    decodeJwt() {
      const token = this.token;
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.email = decodedToken.sub;
          console.log('Decoded JWT Claims:', decodedToken);
        } catch (error) {
          console.error('JWT Decoding Error:', error);
        }
      }
    },

    async getUser() {
      if (this.email) {
        await axios.get(`http://localhost:3030/user/${this.email}`).then(res => {
          this.user = res.data
          console.log(this.user)
        }).catch(err => {
          console.log(err)
        })
      }
    },

    async checkAfterDeleteItem(promotion) {
      if (!promotion) {
        // Handle the case where promotion is not provided
        this.calculateTotal();
        return;
      }

      await axios.get(`http://localhost:3030/api/check-hidden-promotion?code=${promotion}`).then(res => {
        const response = res.data
        this.promotionName = this.promotion;
        this.discountType = response.discountType;
        this.discountValue = response.discountValue;
        this.maximumDiscountValue = response.maximumDiscountValue;

        this.calculateDiscount(response);
      }).catch(err => {
        if (err.response.status === 400) {
          this.handleInvalidPromotion(err);
        }
      })
    },

    async checkPromotion(promotion) {
      if (!promotion) {
        // Handle the case where promotion is not provided
        this.calculateTotal();
        return;
      }

      await axios.get(`http://localhost:3030/api/check-hidden-promotion?code=${promotion}`).then(res => {
        const response = res.data
        this.promotionName = this.promotion;
        this.discountType = response.discountType;
        this.discountValue = response.discountValue;
        this.maximumDiscountValue = response.maximumDiscountValue;

        this.calculateDiscount(response);
        this.toast.success("Áp dụng mã khuyến mãi thành công.");
      }).catch(err => {
        if (err.response.status === 400) {
          this.handleInvalidPromotion(err);
        }
      })
    },

    calculateDiscount(response) {
      let discount = 0;
      let subtotal = 0;

      for (let i = 0; i < this.cartList.length; i++) {
        subtotal += this.cartList[i].price * this.cartList[i].quantity;
        let tmp = response.discountValue;

        if (response.discountType === 1) {
          tmp = this.cartList[i].price * response.discountValue / 100;
          if (tmp < response.maximumDiscountValue) {
            discount += tmp * this.cartList[i].quantity;
          } else {
            discount += response.maximumDiscountValue * this.cartList[i].quantity;
          }
        }

        if (response.discountType === 2) {
          discount += tmp * this.cartList[i].quantity;
        }
      }

      this.subtotal = subtotal;
      this.discount = discount;
      this.total = subtotal - discount;
    },

    handleInvalidPromotion(err) {
      // Handle the case where the promotion is invalid
      this.calculateTotal();
      this.toast.warning(err.response.data.message);
    },

    calculateTotal() {
      this.promotionName = null
      this.discountType = null
      this.discountValue = null
      this.maximumDiscountValue = null
      let subtotal = 0;
      let discount = 0;

      for (let i = 0; i < this.cartList.length; i++) {
        subtotal += this.cartList[i].price * this.cartList[i].quantity;
      }

      this.subtotal = subtotal;
      this.discount = discount;
      this.total = subtotal - discount;
    },

    handleOrder() {
      console.log(1)
    }
  },

  mounted() {
    this.fetchData()
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.getUser()

  }
}
</script>

<template>
  <LayoutView>
    <main id="mt-main" v-if="cartList.length > 0" style="background-color: #f2f2f2">
      <!-- Mt Product Table of the Page -->
      <div class="mt-product-table ">
        <div class="container" style="border-radius: 7px;background-color: #fff">
          <table class="table table-cart">
            <thead class="text-center">
            <tr class="">
              <th class="text-start" style="border: 0;">SẢN PHẨM</th>
              <th style="border: 0">GIÁ TIỀN</th>
              <th style="border: 0">SỐ LƯỢNG</th>
              <th style="border: 0">TỔNG TIỀN</th>
            </tr>
            </thead>
            <tbody class="text-center">
            <tr v-for="(item, index) in cartList" :key="index">
              <td class="d-flex align-items-center">
                <Carousel style="width: 120px" id="gallery" :items-to-show="1" :transition="1000" :wrap-around="true">
                  <Slide v-for="slide in item.images" :key="slide">
                    <div class="carousel__item">
                      <img :src="slide" alt="Slide">
                    </div>
                  </Slide>
                </Carousel>
                <div class="text-start px-5">
                  <div class="">
                    <div class="font-weight-bold py-2 cart-name">{{ item.name }}</div>
                    <div class="cart-description">Kích thước: <span class="font-weight-bold">{{ item.size }}</span>
                      <div style="color: #999" class="pt-2"><i @click="deleteItem(index)"
                                                               class="bi bi-trash btn-del-cart-item"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="cart-price" style="position: relative">
                <div class="text-row-center">{{ formattedPrice(item.price) }}</div>
              </td>
              <td class="cart-quantity" style="position: relative">
                <div class="text-row-center">{{ item.quantity }}</div>
              </td>
              <td class="cart-price" style="position: relative">
                <div class="text-row-center">{{ formattedPrice(item.total) }}</div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-xs-12">
              <Form @submit="checkPromotion(promotion)" class="coupon-form">
                <fieldset>
                  <div class="mt-holder">
                    <input v-model="promotion" type="text" class="form-control text-3 text-uppercase"
                           placeholder="Nhập mã khuyến mãi">
                    <button type="submit">Áp dụng</button>
                  </div>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div><!-- Mt Product Table of the Page end -->
      <!-- Mt Detail Section of the Page -->
      <section class="mt-detail-sec" style="padding: 0 0 40px 0">
        <div class="container" style="border-radius: 7px;background-color: #fff">
          <Form @submit="handleOrder" class="bill-detail" :validation-schema="schema" v-slot="{ errors }">
            <div class="row py-5">
              <div class="col-xs-12 col-sm-6">
                <h2>Thông tin nhận hàng</h2>
                <div v-if="user">

                  <div class="form-group">
                    <div><label for="name" class="form-label">Tên người nhận<span
                        class="text-danger">*</span></label><span
                        class="text-danger font-italic text-1 float-end">{{ errors.name }}</span></div>
                    <Field v-model="user.fullName" name="name" id="name" type="text" class="form-control text-3"/>
                  </div>
                  <div class="form-group">
                    <label for="phone" class="form-label">Số điện thoại<span class="text-danger">*</span></label><span
                      class="text-danger font-italic text-1 float-end">{{ errors.phone }}</span>
                    <Field v-model="user.phone" name="phone" id="phone" type="text" class="form-control text-3"/>
                  </div>
                  <div class="form-group">
                    <label for="address" class="form-label">Địa chỉ nhận hàng<span
                        class="text-danger">*</span></label><span
                      class="text-danger font-italic text-1 float-end">{{ errors.address }}</span>
                    <Field as="textarea" v-model="user.address" name="address" id="address" class="form-control text-3"
                           rows="3"></Field>
                  </div>
                  <div class="form-group">
                    <label for="note" class="form-label">Ghi chú</label>
                    <Field style="height: 100px" as="textarea" v-model="user.note" name="note" id="note" class="form-control text-3" rows="3"></Field>
                  </div>

                </div>
                <div v-else>
                <span class="account">
                  <router-link to="/signin">Đăng nhập</router-link> hoặc <router-link
                    to="/signup">Đăng ký</router-link> để tiếp tục mua hàng
                </span>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <h2>Tổng tiền thanh toán</h2>
                <ul class="list-unstyled block ">
                  <li>
                    <div class="txt-holder">
                      <strong class="title sub-title pull-left">Tạm tính</strong>
                      <div class="txt pull-right">
                        <span>{{ formattedPrice(subtotal) }}</span>
                      </div>
                    </div>
                  </li>
                  <li class="py-4">
                    <div class="txt-holder">
                      <strong class="title sub-title pull-left">Khuyến mãi </strong><i v-if="promotionName"
                                                                                       class="text-uppercase">:
                      {{ promotionName }} </i>
                      <Popper v-if="discountType" placement="right">
                        <button class="popper-promotion">i</button>
                        <template #content>
                          <div>Mã khuyến mãi: {{ promotionName }}</div>
                          <div v-if="discountType == 1">
                            <div>Giá trị khuyến mãi: {{ discountValue }} %</div>
                            <div>Tối đa: {{ formattedPrice(maximumDiscountValue) }}</div>
                          </div>
                          <div v-if="discountType == 2">
                            <div>Giá trị khuyến mãi: {{ formattedPrice(discountValue) }}</div>
                          </div>
                          <div class="font-italic">Lưu ý: Giá trị khuyến mãi được áp dụng cho mỗi sản phẩm</div>
                        </template>
                      </Popper>
                      <div class="txt pull-right">
                        <strong>{{ formattedPrice(discount) }}</strong>
                      </div>
                    </div>
                  </li>
                  <li style="border-bottom: none;">
                    <div class="txt-holder">
                      <strong class="title sub-title pull-left">Tổng tiền</strong>
                      <div class="txt pull-right">
                        <span>{{ formattedPrice(total) }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <button v-if="user" class="btn process-btn" @submit="handleOrder()">Đặt hàng<i class="fa fa-check"></i>
                </button>
              </div>
            </div>
          </Form>
        </div>
      </section>
      <!-- Mt Detail Section of the Page end -->
    </main>
    <section v-else class="mt-error-sec dark">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <h1 class="text-uppercase montserrat">Chưa có sản phẩm nào trong giỏ hàng</h1>
            <div class="txt">
              <p>Thêm sản phẩm vào giỏ hàng đi rồi quay lại!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LayoutView>
</template>

<style>
.popper-promotion {
  border: 1px solid #fff;
  border-radius: 50px;
  padding: 0px 10px;
  background-color: #fff;
  margin-left: 10px;
  font-size: x-small;
  font-style: italic;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
}

:root {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 32px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.btn-del-cart-item:hover {
  color: #ff6060;
  cursor: pointer;
}

.table-cart thead {
  font-size: 15px;
}

.table-cart tbody .cart-name {
  font-size: 14px;
}

.table-cart tbody .cart-description {
  font-size: 13px;
}

.table-cart tbody .cart-price {
  font-size: 15px;
}

.table-cart tbody .cart-quantity {
  font-size: 16px;
}

.text-row-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.account, .account a {
  color: #a1a1a1;
}

.account a:hover {
  color: #ff6060;
}

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');

</style>