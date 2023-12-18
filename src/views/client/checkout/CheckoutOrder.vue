<script>
// import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import {Field, Form} from "vee-validate";

import {useToast} from "vue-toastification";
import * as Yup from "yup";

export default {
  name: "CheckoutOrder",
  props: [],
  components: {Form, Field},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    const phoneRegExp = /^((\+[1-9]{1,4})|(\([0-9]{2,3}\))|([0-9]{2,4}))?[0-9]{3,4}?[0-9]{3,4}?$/
    const schemaProfile = Yup.object().shape({
      fullName: Yup.string().required(" Tên không được để trống."),
      phone: Yup.string()
          .required("Số điện thoại không được trống")
          .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
          .min(10, "Số điện thoại không hợp lệ")
          .max(10, "Số điện thoại không hợp lệ"),
      address: Yup.string().required("Địa chỉ không được để trống")
    })
    return {
      schemaProfile,
      dataCheckout: null,
    }
  },
  computed: {},

  methods: {
    async fetchData() {
      const data = this.$cookies.get("checkout_data")
      if (data) {
        this.dataCheckout = data
      } else {
        this.$router.push("/cart")
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

  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.fetchData()
    console.log((this.dataCheckout))
  }
}

</script>

<template>
<!--  <LayoutView>-->
    <div v-if="dataCheckout" id="wrapper">
      <div class="w1">

        <!-- Main of the Page -->
        <main id="mt-main">

          <!-- Mt Detail Section of the Page -->
          <div class="container" style="margin-top: 30px; max-width: 1360px !important;">
              <Form @submit="checkout(dataCheckout.total)" v-if="dataCheckout.user" :validation-schema="schemaProfile" v-slot="{errors}">
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
                            <h5 class="font-size-16 mb-3">Thông tin thanh toán</h5>
                            <div class="mb-3">

                                <div>
                                  <div class="row">
                                    <div class="col-lg-6">
                                      <div class="mb-3">
                                        <label class="form-label" for="billing-name">Tên</label>
                                        <Field class="form-control" id="billing-name"
                                               v-model=" dataCheckout.user.fullName "
                                               name="fullName"/>
                                        <div class="text-danger font-italic text-1 text-end">{{ errors.fullName }}</div>
                                      </div>
                                    </div>
                                    <Field hidden class="form-control" id="billing-mail"
                                           v-model=" dataCheckout.user.email"
                                           name="mail"/>
                                    <div class="col-lg-6">
                                      <div class="mb-3">
                                        <label class="form-label" for="billing-phone">Số điện thoại</label>
                                        <Field class="form-control" id="billing-phone"
                                               v-model=" dataCheckout.user.phone "
                                               name="phone"/>
                                        <div class="text-danger font-italic text-1 text-end">{{ errors.phone }}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="mb-3">
                                    <label class="form-label" for="billing-address">Địa chỉ nhận hàng</label>
                                    <Field as="textarea" name="address" class="form-control" rows="2" id="billing-address"
                                              v-model=" dataCheckout.user.address "></Field>
                                    <div class="text-danger font-italic text-1 text-end">{{ errors.address }}</div>
                                  </div>
                                  <div class="mb-3">
                                    <label class="form-label" for="billing-note">Ghi chú</label>
                                    <textarea class="form-control" rows="2" id="billing-note"
                                              v-model=" dataCheckout.note "></textarea>
                                  </div>
                                </div>

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
                            <h5 class="font-size-16 mb-3">Phương thức thanh toán</h5>
                          </div>
                          <div>
                            <div class="row">
                              <div class="col-lg-3 col-sm-6">
                                <div data-bs-toggle="collapse">
                                  <label class="card-radio-label">
                                    <input checked type="radio" name="pay-method" id="pay-methodoption1"
                                           class="card-radio-input">
                                    <span class="card-radio py-3 text-center text-truncate">
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                         alt="">
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
                      <table class="table table-borderless">
                        <thead>
                        <tr>
                          <th scope="col">Tên sản phẩm</th>
                          <th scope="col">Giá</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Kích thước</th>
                          <th scope="col">Tổng</th>
                        </tr>
                        </thead>
                        <tbody v-if="dataCheckout.items">
                        <tr v-for="(item, index) in dataCheckout.items" :key="index">
                          <td>{{ item.name }}</td>
                          <td>{{ formattedPrice(item.price) }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.size }}</td>
                          <td>
                            <div>{{ formattedPrice(item.price * item.quantity) }}</div>
                          </td>
                        </tr>
                        </tbody>
                      </table>

                        <div class="col">
                          <h2 class="tieu-de">Tổng tiền thanh toán</h2>
                          <ul class="list-unstyled block ">

                            <li class="py-4">
                              <div class="txt-holder">
                                <strong class="sub-title pull-left title-style">Tổng phụ</strong>

                                <div class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 16px;
    display: block;
    color: #917777;">{{ formattedPrice(dataCheckout.subtotal) }}</strong>
                                </div>
                              </div>
                            </li>

                            <li class="py-4">
                              <div class="txt-holder">
                                <strong class="sub-title pull-left title-style">Khuyến mãi</strong>

                                <div v-if="dataCheckout.discount > 0" class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 18px;
    display: block;
    color: #494949;">-{{ formattedPrice(dataCheckout.discount) }}</strong>
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
                                <hr style=" margin: 10px 0 20px 0;border-style: solid; border-width: 0 0 1px; border-color: black;">
                                <strong class="title sub-title pull-left title-style">Tổng Tiền</strong>
                                <div class="txt pull-right">
                                  <strong style="font-size: 16px;
    line-height: 18px;
    display: block;
    color: #494949;">{{ formattedPrice(dataCheckout.total) }}</strong>
                                </div>
                              </div>
                            </li>
                          </ul>
                          <button type="submit" v-if="dataCheckout" class="btn process-btn btn-style">
                            Thanh toán
                          </button>
                        </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
              </Form>
          </div>
        </main>
      </div>
      <span id="back-top" class="fa fa-arrow-up"></span>
    </div>
    <div v-else>
      <section class="mt-error-sec dark">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 text-center">
              <h1 class="text-uppercase montserrat">Chưa có sản phẩm nào trong giỏ hàng</h1>
<!--              <div class="txt">-->
<!--                <p>Thêm sản phẩm vào giỏ hàng đi rồi quay lại!</p>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </section>
    </div>
<!--  </LayoutView>-->
</template>

<style scoped>
* {
  font-family: "Montserrat", sans-serif;
}


.table-cart thead {
  font-size: 15px;
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
}


.activity-checkout .checkout-item:last-child {
  border-color: transparent
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