<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Field, Form} from "vee-validate";

import {useToast} from "vue-toastification";
import * as Yup from "yup";

export default {
  name: "CheckoutOrder",
  props: [],
  components: {LayoutView, Form, Field},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    // Validate form
    const schema = Yup.object().shape({
      oldPassword: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự.."),
      newPassword: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự..")
          .notOneOf([Yup.ref('oldPassword'), null], 'Hai mật khẩu không được giống nhau.'),
      confirmPassword: Yup.string().required("Mật khẩu không được trống.")
          .oneOf([Yup.ref('newPassword'), null], 'Hai mật khẩu không giống nhau.'),

    })
    const phoneRegExp = /^((\+[1-9]{1,4})|(\([0-9]{2,3}\))|([0-9]{2,4}))?[0-9]{3,4}?[0-9]{3,4}?$/
    const schemaProfile = Yup.object().shape({
      fullName: Yup.string().required(" Tên không được để trống."),
      phone: Yup.string()
          .required("Số điện thoại không được trống")
          .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
          .min(10, "Số điện thoại không hợp lệ")
          .max(10, "Số điện thoại không hợp lệ")
    })
    return {
      schema,
      schemaProfile,
      user: null,
      token: null,
      email: null,

      dataCheckout: null,

      cartList: [],

      promotionName: null,
      discountType: null,
      discountValue: null,
      maximumDiscountValue: null,

      subtotal: 0,
      total: 0,
      discount: 0,
      publicDiscount: 0,

      note: null,
    }
  },
  computed: {},

  methods: {
    async updateProfile() {
      const obj = {
        phone: this.user.phone,
        full_name: this.user.fullName,
        address: this.user.address,
        email: this.email,
      }
      await axios.put(`http://localhost:3030/api/update-profile`, obj).then(res => {
        console.log(res)
        this.toast.success("Đổi thông tin thành công!")
      }).catch(err => {
            console.log(err)
            this.toast.error("Thông tin không đúng!")
          }
      )
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/users`).then(res => {
        console.log(res.data)
        this.user = res.data
      })

      this.cartList = this.dataCheckout.items || []
      this.total = this.dataCheckout.total
      this.subtotal = this.dataCheckout.subtotal
      this.discount = this.dataCheckout.discount
      this.user = this.dataCheckout.user
      this.note = this.dataCheckout.note
      this.promotionName = this.dataCheckout.promotionName
    },

    async getUser() {
      if (this.email) {
        await axios.get(`http://localhost:3030/user/${this.email}`).then(res => {
          this.user = res.data
        }).catch(err => {
          console.log(err)
        })
      }
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
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.getUser()

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

    <div id="wrapper">
      <!-- Page Loader -->
      <!--      <div id="pre-loader" class="loader-container">-->
      <!--        <div class="loader" style="width: 230px">-->
      <!--          <img src="https://img.idesign.vn/2018/10/23/id-loading-1.gif" alt="loader">-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="w1">
        <div class="mt-search-popup">
          <div class="mt-holder">
            <a href="#" class="search-close"><span></span><span></span></a>
            <div class="mt-frame">
              <form action="#">
                <fieldset>
                  <input type="text" placeholder="Search...">
                  <span class="icon-microphone"></span>
                  <button class="icon-magnifier" type="submit"></button>
                </fieldset>
              </form>
            </div>
          </div>
        </div><!-- mt search popup end here -->
        <!-- Main of the Page -->
        <main id="mt-main">
          <section class="mt-contact-banner mt-banner-22 wow fadeInUp" data-wow-delay="0.4s"
                   style="background-image: url(http://placehold.it/1920x325);">
            <div class="container">
              <div class="row">
                <div class="col-xs-12">
                  <h1 class="text-center">CHECK OUT</h1>
                  <!-- Breadcrumbs of the Page -->
                  <nav class="breadcrumbs">
                    <ul class="list-unstyled">
                      <li><a href="index.html">Home <i class="fa fa-angle-right"></i></a></li>
                      <li>Check Out</li>
                    </ul>
                  </nav>
                  <!-- Breadcrumbs of the Page end -->
                </div>
              </div>
            </div>
          </section>
          <!-- Mt Process Section of the Page -->
          <div class="mt-process-sec wow fadeInUp" data-wow-delay="0.4s">
            <div class="container">
              <div class="row">
                <div class="col-xs-12">
                  <!-- Process List of the Page -->
                  <ul class="list-unstyled process-list">
                    <li class="active">
                      <span class="counter">01</span>
                      <strong class="title">Mua sản phẩm</strong>
                    </li>
                    <li class="active">
                      <span class="counter">02</span>
                      <strong class="title">Giỏ hàng</strong>
                    </li>
                    <li>
                      <span class="counter">03</span>
                      <strong class="title">Thủ tục thanh toán</strong>
                    </li>
                  </ul>
                  <!-- Process List of the Page end -->
                </div>
              </div>
            </div>
          </div><!-- Mt Process Section of the Page end -->
          <!-- Mt Detail Section of the Page -->
          <div class="container" style="margin-top: 30px; max-width: 1360px !important;">
            <div class="row">
              <div class="col-xl-6">
                <div class="card">
                  <div class="card-body">
                    <ol class="activity-checkout mb-0 px-4 mt-3">
                      <li class="checkout-item">
                        <div class="avatar checkout-icon p-1">
                          <div class="avatar-title rounded-circle bg-primary">
                            <i class="bx bxs-receipt text-white font-size-20"></i>
                          </div>
                        </div>
                        <div class="feed-item-list">
                          <div>
                            <h5 class="font-size-16 mb-1">Billing Info</h5>
                            <p class="text-muted text-truncate mb-4">Sed ut perspiciatis unde omnis iste</p>
                            <div class="mb-3">
                              <Form v-if="user" @submit="updateProfile" :validation-schema="schemaProfile">
                                <div>
                                  <div class="row">
                                    <div class="col-lg-4">
                                      <div class="mb-3">
                                        <label class="form-label" for="billing-name">Name</label>
                                        <Field class="form-control" id="in-user-fullname" v-model=" user.fullName "
                                               name="fullName"/>
                                      </div>
                                    </div>
                                    <div class="col-lg-4">
                                      <div class="mb-3">
                                        <label class="form-label" for="billing-email-address">Email Address</label>
                                        <Field class="form-control" id="in-user-mail" v-model=" user.email "
                                               name="mail"/>
                                      </div>
                                    </div>
                                    <div class="col-lg-4">
                                      <div class="mb-3">
                                        <label class="form-label" for="billing-phone">Phone</label>
                                        <Field class="form-control" id="in-user-phone" v-model=" user.phone "
                                               name="phone"/>
                                      </div>
                                    </div>
                                  </div>

                                  <div class="mb-3">
                                    <label class="form-label" for="billing-address">Address</label>
                                    <textarea class="form-control" rows="2" id="in-user-address"
                                              v-model=" user.address "></textarea>
                                  </div>

                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li class="checkout-item">
                        <div class="avatar checkout-icon p-1">
                          <div class="avatar-title rounded-circle bg-primary">
                            <i class="bx bxs-wallet-alt text-white font-size-20"></i>
                          </div>
                        </div>
                        <div class="feed-item-list">
                          <div>
                            <h5 class="font-size-16 mb-1">Payment Info</h5>
                            <p class="text-muted text-truncate mb-4">Duis arcu tortor, suscipit eget</p>
                          </div>
                          <div>
                            <h5 class="font-size-14 mb-3">Payment method :</h5>
                            <div class="row">
                              <div class="col-lg-3 col-sm-6">
                                <div data-bs-toggle="collapse">
                                  <label class="card-radio-label">
                                    <input type="radio" name="pay-method" id="pay-methodoption1"
                                           class="card-radio-input">
                                    <span class="card-radio py-3 text-center text-truncate">
                                                        <i class="bx bx-credit-card d-block h2 mb-3"></i>
                                                        Credit / Debit Card
                                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div class="col-lg-3 col-sm-6">
                                <div>
                                  <label class="card-radio-label">
                                    <input type="radio" name="pay-method" id="pay-methodoption2"
                                           class="card-radio-input">
                                    <span class="card-radio py-3 text-center text-truncate">
                                                        <i class="bx bxl-paypal d-block h2 mb-3"></i>
                                                        Paypal
                                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div class="col-lg-3 col-sm-6">
                                <div>
                                  <label class="card-radio-label">
                                    <input type="radio" name="pay-method" id="pay-methodoption3"
                                           class="card-radio-input"
                                           checked="">

                                    <span class="card-radio py-3 text-center text-truncate">
                                                        <i class="bx bx-money d-block h2 mb-3"></i>
                                                        <span>Cash on Delivery</span>
                                                    </span>
                                  </label>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div class="col-xl-6">
                <div class="card checkout-order-summary">
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-centered mb-0 table-nowrap">
                        <thead>
                        <tr>
                          <th class="border-top-0" style="width: 222px;" scope="col">Hình ảnh</th>
                          <th class="border-top-0" style="width: 150px;" scope="col">Tên sản phẩm</th>
                          <th class="border-top-0" style="width: 100px;" scope="col">Giá</th>
                          <th class="border-top-0" style="width: 180px;" scope="col">Số lượng</th>
                          <th class="border-top-0" style="width: 50px;" scope="col">Tổng</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in cartList" :key="index">
                          <td scope="row"><img :src="item.images" alt="Slide"></td>
                          <td>
                            <h5 class="font-size-16 text-truncate"><a href="#" class="text-dark">Waterproof Mobile
                              Phone</a>
                            </h5>
                          </td>
                          <td>{{ formattedPrice(item.price) }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>
                            <div>{{ formattedPrice(item.price * item.quantity) }}</div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      <Form class="bill-detail">
                        <div class="col">
                          <h2 class="tieu-de">Tổng tiền thanh toán</h2>
                          <ul class="list-unstyled block ">
                            <li class="py-4">
                              <div class="txt-holder">
                                <strong class="sub-title pull-left title-style">Khuyến mãi</strong>
                                <div v-if="publicDiscount > 0" class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 18px;
    display: block;
    color: #494949;">{{ formattedPrice(publicDiscount) }}</strong>
                                  <br>
                                </div>
                                <div v-if="discount > 0" class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 18px;
    display: block;
    color: #494949;">-{{ formattedPrice(discount) }}</strong>
                                </div>
                                <div v-else class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 16px;
    display: block;
    color: #917777;">{{ formattedPrice(0) }}</strong>
                                </div>
                              </div>
                            </li>

                            <li class="py-4">
                              <div class="txt-holder">
                                <hr style=" margin: 10px 0px 20px 0px;border-style: solid; border-width: 0 0 1px; border-color: black;">
                                <strong class="title sub-title pull-left title-style">Tổng Tiền</strong>
                                <div class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 18px;
    display: block;
    color: #494949;">{{ formattedPrice(total) }}</strong>
                                </div>
                              </div>
                            </li>
                          </ul>
                          <button type="button" v-if="user" class="btn process-btn btn-style" @click="checkout(total)">
                            Thanh toán
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <span id="back-top" class="fa fa-arrow-up"></span>
    </div>
  </LayoutView>
</template>

<style scoped>
* {
  font-family: "Montserrat", sans-serif;
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

.account a:hover {
  color: #ff6060;
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


body {
  margin-top: 20px;
  background-color: #f1f3f7;
}

.card {
  margin-bottom: 24px;
  -webkit-box-shadow: 0 2px 3px #e4e8f0;
  box-shadow: 0 2px 3px #e4e8f0;
}

.card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #eff0f2;
  border-radius: 1rem;
}

.activity-checkout {
  list-style: none
}

.activity-checkout .checkout-icon {
  position: absolute;
  top: -4px;
  left: -24px
}

.activity-checkout .checkout-item {
  position: relative;
  padding-bottom: 24px;
  padding-left: 35px;
  border-left: 2px solid #f5f6f8
}

.activity-checkout .checkout-item:first-child {
  border-color: #3b76e1
}

.activity-checkout .checkout-item:first-child:after {
  background-color: #3b76e1
}

.activity-checkout .checkout-item:last-child {
  border-color: transparent
}

.activity-checkout .checkout-item.crypto-activity {
  margin-left: 50px
}

.activity-checkout .checkout-item .crypto-date {
  position: absolute;
  top: 3px;
  left: -65px
}


.avatar {
  height: 3rem;
  width: 3rem
}


.avatar-title {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #3b76e1;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-weight: 500;
  height: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%
}


.avatar-group .avatar-group-item {
  margin-left: -8px;
  border: 2px solid #fff;
  border-radius: 50%;
  -webkit-transition: all .2s;
  transition: all .2s
}

.avatar-group .avatar-group-item:hover {
  position: relative;
  -webkit-transform: translateY(-2px);
  transform: translateY(-2px)
}

.card-radio {
  background-color: #fff;
  border: 2px solid #eff0f2;
  border-radius: .75rem;
  padding: .5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block
}

.card-radio:hover {
  cursor: pointer
}

.card-radio-label {
  display: block
}


.card-radio-input {
  display: none
}

.card-radio-input:checked + .card-radio {
  border-color: #3b76e1 !important
}


.font-size-16 {
  font-size: 16px !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a {
  text-decoration: none !important;
}


.form-control {
  display: block;
  width: 100%;
  height: 50px;
  padding: 0.47rem 0.75rem;
  font-size: 1.4rem !important;
  font-weight: 400;
  line-height: 1.5;
  color: #545965;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #e2e5e8;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.75rem;
  -webkit-transition: border-color .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
}

.btn-style {
  font-size: 18px;
  line-height: 20px;
  text-transform: uppercase;
  width: 250px;
  padding: 14px 10px;
  display: block;
  text-align: center;
  float: right;
  font-weight: 700;
  letter-spacing: 2px;
  word-spacing: 1px;
  transition: all .25s linear;
  color: #fff;
  background: #88bd6e;
  margin-top: 22px;
  margin-bottom: 6px;
}

.btn-style:hover {
  background-color: #f6f6f6;
  color: black;

}

.title-style {
  font-size: 16px;
  line-height: 18px;
  display: block;
  margin: 0 0 11px;
  text-transform: uppercase;
  color: #868686;
}

.tieu-de {
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin: 30px 0 15px 0;
  color: #000;
}

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');

</style>