<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Form, Field} from "vee-validate";
import * as Yup from 'yup';
import {useToast} from "vue-toastification";
import Popper from "vue3-popper";

export default {
  name: "CartView",
  props: [],
  components: {LayoutView, Form, Field, Popper},
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

      publicPromotionName: null,
      publicDiscountType: null,
      publicDiscountValue: null,
      publicMaximumDiscountValue: null,

      subtotal: 0,
      total: 0,
      discount: 0,
      publicDiscount: 0,

      note: null,
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
              id: item.id,
              name: item.name,
              images: item.productImages[0] || '',
              couponCode: item.couponCode,
              price: item.price,
              promotionPrice: item.promotionPrice,
              size: this.cartsLocal[i].size,
              quantity: quantity,
            }
            this.cartList.push(item2)
          }).catch(err => {
            console.log(err)
          })
        }
        // this.promotionName = couponCode
        // this.promotion = couponCode
        //  this.calculateTotal()
        await this.checkPublicPromotion(couponCode)

      }
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },


    deleteItem(i) {
      this.cartsLocal = this.cartsLocal.filter((item, index) => index != i)
      this.cartList = this.cartList.filter((item, index) => index != i)

      this.checkAfterHandleItem(this.promotionName)
      localStorage.setItem('cartList', JSON.stringify(this.cartsLocal));
    },

    handleUpdateQuantity(index, quantity) {
      const indexToUpdate = this.cartList.findIndex((item, i) => i === index);
      if (indexToUpdate !== -1) {
        this.cartList[indexToUpdate].quantity = quantity;
        this.cartsLocal[indexToUpdate].quantity = quantity;
        this.checkAfterHandleItem(this.promotionName);
        localStorage.setItem('cartList', JSON.stringify(this.cartsLocal));
        this.$emit('fetchCartData')
      }
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

    async getUser() {
      if (this.email) {
        await axios.get(`http://localhost:3030/user/${this.email}`).then(res => {
          this.user = res.data
          // console.log(this.order)
        }).catch(err => {
          console.log(err)
        })
      }
    },

    async checkAfterHandleItem(promotion) {
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

    async checkPublicPromotion(promotion) {
      if (!promotion) {
        // Handle the case where promotion is not provided
        this.calculateTotal();
        return;
      }

      await axios.get(`http://localhost:3030/api/check-hidden-promotion?code=${promotion}`).then(res => {
        const response = res.data
        this.publicPromotionName = this.promotion;
        this.publicDiscountType = response.discountType;
        this.publicDiscountValue = response.discountValue;
        this.publicMaximumDiscountValue = response.maximumDiscountValue;

        this.calculateDiscount(response);
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

    async handleOrder() {
      let orderDetailsList = []
      for (let i = 0; i < this.cartList.length; i++) {
        let obj = {
          product_id: this.cartList[i].id,
          size: this.cartList[i].size,
          quantity: this.cartList[i].quantity,
          product_price: this.cartList[i].price
        }
        orderDetailsList.push(obj)
      }
      const obj = {
        email: this.email,
        receiver_name: this.user.fullName,
        receiver_phone: this.user.phone,
        receiver_address: this.user.address,
        coupon_code: this.promotionName,
        total_price: this.total,
        subtotal_price: this.subtotal,
        note: this.note,
        products: orderDetailsList
      }
      await axios.post(`http://localhost:3030/api/orders`, obj)
          .then(res => {
            console.log(res.data)
            this.toast.success("Đặt hàng thành công.")
            setTimeout(() => {
              this.$router.push({name: 'OrderDetails', params: {id: res.data}});
            }, 1000);
          }).catch(err => {
            if (err.response.status === 400) {
              this.toast.warning(err.response.data.message)
            }
            console.log(err)
          })

    },

    handleTest(){
      let data = {
        total: this.total,
        subtotal: this.subtotal,
        discount: this.discount,
        items: this.cartList,
        user: this.user,
        note: this.note,
        promotionName: this.promotionName


      };
      this.$cookies.set("checkout_data", data, '30min')
      this.$router.push({name: 'Checkout'})

    }
  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
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
                        <div style="color: #999" class="pt-2"><i @click="deleteItem(index)"

                                                                 class="bi bi-trash btn-del-cart-item"></i>
                        </div>
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

                    <button v-if="item.quantity == 1" @click="deleteItem(index)"><i class="bi bi-trash text-2"></i>
                    </button>
                    <button v-if="item.quantity > 1" @click="handleUpdateQuantity(index, item.quantity - 1)"><i
                        class="bi bi-dash"></i></button>
                    <input type="number" v-model="item.quantity">
                    <button @click="handleUpdateQuantity(index, item.quantity + 1)"><i class="bi bi-plus"></i>
                    </button>
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
                    <Field style="height: 100px" as="textarea" v-model="note" name="note" id="note"
                           class="form-control text-3" rows="3"></Field>
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
                <button v-if="user" class="btn process-btn" @submit="handleOrder()">Đặt hàng
                </button>
<<<<<<< HEAD
<!--                <router-link to="/checkout" class="full-details">thanh toán</router-link>-->
                <button @click="handleTest" class="full-details">thanh toán</button>
=======
>>>>>>> origin/master
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