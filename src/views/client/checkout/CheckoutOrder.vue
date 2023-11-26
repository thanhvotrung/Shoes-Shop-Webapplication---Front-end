<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Form} from "vee-validate";

import {useToast} from "vue-toastification";
import Popper from "vue3-popper";

export default {
  name: "CheckoutOrder",
  props: [],
  components: {LayoutView, Form, Popper},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    // Validate form

    return {
      dataCheckout: null,

      cartList: [],
      user: null,

      promotionName: null,
      discountType: null,
      discountValue: null,
      maximumDiscountValue: null,

      subtotal: 0,
      total: 0,
      discount: 0,

      note: null,
    }
  },
  computed: {},

  methods: {
    async fetchData() {
      this.cartList = this.dataCheckout.items || []
      this.total = this.dataCheckout.total
      this.subtotal = this.dataCheckout.subtotal
      this.discount = this.dataCheckout.discount
      this.user = this.dataCheckout.user
      this.note = this.dataCheckout.note
      this.promotionName = this.dataCheckout.promotionName
    },

    async checkout(price) {
      this.$cookies.set("checkout_data", this.dataCheckout, '30min')
      await axios.get(`http://localhost:3030/pay?price=${price}&typeBank=NCB`)
          .then(res => {
            const redirectLink = res.data;
            console.log(res.data)
            window.location.href = redirectLink;
          }).catch(err => {
            if (err.response.status === 400) {
              this.toast.warning(err.response.data.message)
            }
            console.log(err)
          })
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    // Giải mã JWT token sang object User
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
  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.dataCheckout = this.$cookies.get("checkout_data")
    this.fetchData()
    console.log((this.dataCheckout))
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
            <tr v-for="(item, index) in cartList" :key="index" class="">
              <td class="align-items-center">
                <div class="d-flex">
                  <div style="width: 120px">
                    <img :src="item.images" alt="Slide">
                  </div>
                  <div class="text-start px-5">
                    <div class="">
                      <div class="font-weight-bold py-2 cart-name">{{ item.name }}</div>
                      <div class="cart-description">Kích thước: <span class="font-weight-bold">{{ item.size }}</span>

                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="cart-price" style="position: relative">
                <div v-if="item.promotionPrice > 0" class="text-row-center" style="width: 200px">
                  <span style="text-decoration: line-through; color: #757575">{{ formattedPrice(item.price) }}</span>&ensp;
                  <span>{{ formattedPrice(item.promotionPrice) }}</span>
                </div>
                <div v-else class="text-row-center">{{ formattedPrice(item.price) }}</div>
              </td>
              <td class="cart-quantity" style="position: relative">
                <div class="text-row-center">
                  <div class="item-quantity d-flex">
                    <div>{{item.quantity}}</div>
                  </div>
                </div>
              </td>
              <td class="cart-price" style="position: relative">
                <div v-if="item.promotionPrice > 0" class="text-row-center">
                  {{ formattedPrice(item.promotionPrice * item.quantity) }}
                </div>
                <div v-else class="text-row-center">{{ formattedPrice(item.price * item.quantity) }}</div>
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
          <Form class="bill-detail">
            <div class="row py-5">
              <div class="col-xs-12 col-sm-6">
              </div>
              <div class="col-xs-12 col-sm-6">
                <h2>Tổng tiền thanh toán</h2>
                <ul class="list-unstyled block ">
                  <li class="py-4">
                    <div class="txt-holder">
                      <Popper v-if="discountType" placement="right" class="light">
                        <div class="popper-promotion"><i class="bi bi-info-lg"></i></div>
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
                      <div v-if="publicDiscount > 0" class="txt pull-right">
                        <strong>{{ formattedPrice(publicDiscount) }}</strong>
                        <br>
                      </div>
                      <div v-if="discount > 0" class="txt pull-right">
                        <strong>{{ formattedPrice(discount) }}</strong>
                      </div>
                      <div v-else class="txt pull-right">
                        <strong>{{ formattedPrice(0) }}</strong>
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
                <button type="button" v-if="user" class="btn process-btn" @click="checkout(total)">Thanh toán
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

<style scoped>
* {
  font-family: "Montserrat", sans-serif;
}

.popper-promotion {
  border: 1px solid #fff;
  border-radius: 50px;
  padding: 0px 6px;
  background-color: #fff;
  margin-left: 10px;
  font-size: x-small;
  font-style: italic;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
}

.light {
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

.item-quantity {
  border: 1px solid #000000;
  border-radius: 50px;
  padding: 5px 10px;
}

.item-quantity input {
  width: 30px;
  text-align: center;
  border: none;
  outline: none;
}

.item-quantity input::-webkit-outer-spin-button,
.item-quantity input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-quantity button {
  outline: 0;
  border: none;
  background-color: #fff;
}

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');

</style>