<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {useToast} from "vue-toastification";


export default {
  name: "OrderDetails",
  components: {LayoutView},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      id: null,
      orderDetails: [],
      email: null,
      token: null,
    }
  },
  methods: {
    async fetchData() {
      await axios.get(`http://localhost:3030/api/order-details`, {
        params: {
          id: this.id,
          email: this.email
        }
      }).then(res => {
        this.orderDetails = res.data
        console.log("data",res.data)
      }).catch(err => {
        console.log(err)
      })
    },

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

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    async handleCancelOrder(id) {
      console.log(id)
      await axios.post(`http://localhost:3030/api/cancel-order?id=${id}&email=${this.email}`)
          .then(res => {
            this.toast.success(res.data)
            this.fetchData()
          }).catch(err => {
            console.log(err)
          })
    },

  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.id = this.$route.params.id
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.fetchData()

  }
}
</script>

<template>
  <LayoutView>
    <div>
      <main id="main-content" class="container">
        <div class="row">
          <div class="col-lg-3">
            <div class="left-sidebar">
              <div class="nav-sidebar">
                <router-link to="/account" class="account nav-item">Quản lý tài khoản</router-link>

                <router-link to="/orders-list" class="buying-order nav-item">Quản lý đơn hàng</router-link>

<!--                <a class="btn btn-primary red-btn sign-out-btn" href="/api/logout">Đăng xuất</a>-->
              </div>
            </div>
          </div>
          <div class="col-lg-9 main-content-wrapper" v-if="orderDetails.length > 0">
            <div class="main-content">
              <div class="top-header">
                <div>
                  <router-link class="go-back-previous-page" to="/orders-list"><i class="bi bi-chevron-left"></i> Trở
                    lại
                  </router-link>
                </div>
                <div class="order-number-wrapper">Mã đơn <span class="order-number">#{{ id }}</span></div>
                <div class="status">{{ orderDetails[0].statusText }}</div>
              </div>
              <div class="item" v-for="(order, index) in orderDetails" :key="index">
                <div class="product-info-wrapper">
                  <div class="thumbnails"><img class="img-fluid" style="width:100px" :src="order.productImg"
                                               :alt="order.productName"/></div>
                  <div class="product-info"><span class="name">{{ order.name }}</span>
                    <div class="size">Kích thước: <span>{{ order.size }}</span> EU</div>
                    <div class="size">Số lượng: <span>{{ order.quantity }}</span></div>
                  </div>
                </div>
                <div class="price asks-price"><span class="text-price">{{ formattedPrice(order.price) }}</span></div>
              </div>

              <div class="shipping-and-price-wrapper">
                <div class="shipping-wrapper">
                  <div class="title">Địa chỉ giao hàng</div>
                  <div class="buyer-name">Tên: {{ orderDetails[0].receiverName }}</div>
                  <div class="shipping-address">Địa chỉ: {{ orderDetails[0].receiverAddress }}</div>
                  <div class="phone">Số điện thoại: {{ orderDetails[0].receiverPhone }}</div>
                  <div class="note">Ghi chú: {{ orderDetails[0].note }}</div>
                </div>
                <div class="price-wrapper">
                  <div class="sub-price-wrapper price">Tạm tính:&ensp; <span><span
                      class="text-price">{{ formattedPrice(orderDetails[0].subtotalPrice) }}</span></span></div>
                  <div class="shipping-price-wrapper price">Khuyến mãi:&ensp; <span><span
                      class="text-price">{{
                      formattedPrice(orderDetails[0].subtotalPrice - orderDetails[0].totalPrice)
                    }}</span></span>
                  </div>
                  <div class="total-price-wrapper price">Thành tiền:&ensp; <span class="total-price"><span
                      class="text-price">{{ formattedPrice(orderDetails[0].totalPrice) }}</span></span></div>
                </div>
              </div>
<!--              <div v-if="orderDetails[0].status == 1" class="d-flex flex-row-reverse">-->
<!--                <button class="btn btn-primary red-btn cancel-btn " @click="handleCancelOrder(orderDetails[0].id)">Hủy-->
<!--                  đơn hàng-->
<!--                </button>-->

<!--              </div>-->
            </div>
          </div>

        </div>
      </main>
    </div>
  </LayoutView>
</template>

<style scoped>

* {
  font-family: "Montserrat", sans-serif;
}

.left-sidebar {
  border-radius: 0.25rem;
  margin-top: 40px;
  margin-bottom: 40px;
  background-color: #fff;
  padding: 10px;
}

.left-sidebar .nav-sidebar {
  margin: 1.25rem;
}

.nav-sidebar {
  display: grid;
  grid-row-gap: 0.9375rem;
}

.main-content {
  margin-top: 41px;
  margin-bottom: 50px;
  border-radius: 0.25rem;
  background-color: #fff;
  padding: 10px;
}


.main-content .item,
.main-content .item-small {
  padding: 1rem 2.5rem;
  border: 0.0625rem solid #D5D6D6 !important;
  border-radius: 0.25rem;
  color: #333333;
  font-weight: normal;
  margin-bottom: 1.875rem;
}

.main-content .product-info-wrapper {
  display: flex;
  align-items: center;
}

.main-content .thumbnails {
  max-width: 150px;
}

.main-content .product-info {
  margin-left: 1.25rem;
}

.main-content .name {
  font-weight: bold;
  color: #333333;
}

.main-content .price {
  font-weight: bold;
  text-align: right;
}

.main-content .status {
  font-weight: bold;
}

.main-content .item-small {
  display: none;
}

.main-content .item-small .product-info {
  margin: 0px;
}

.main-content .item-small .price {
  text-align: left;
}

.main-content .item,
.main-content .item-small {
  margin: 1rem 2.5rem;
  padding: 0px;
  padding-bottom: 1.25rem;
  border: 0px !important;
}

.main-content .item {
  grid-row-gap: 1.25rem;
}

.shipping-and-price-wrapper {
  border-top: 1px solid #D5D6D6;
  border-radius: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px;

}

.shipping-and-price-wrapper div {
  display: grid;
  grid-row-gap: 0.25rem;
}

.shipping-wrapper .title {
  font-weight: bold;
}

.price-wrapper {
  font-weight: bold;
}

.price-wrapper .price {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-wrapper .total-price {
  color: #F04E40;
  font-size: 1.5rem;
}

.price-wrapper .payment-methods {
  text-align: right;
}


.main-content .item,
.main-content .item-small {
  border: 0px !important;
}

.main-content .item {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: center;
}

.main-content .cancel-btn {
  width: 40%;
  margin-top: 0.625rem;
  padding: 10px 10px;
  font-size: 14px;
  margin: 10px 10px;
}


.main-content .btns .cancel-btn {
  grid-column: 0;
  width: auto;
  justify-self: normal;
}

.main-content .item-small {
  display: none;
  margin: 0px;
}

.main-content .top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
}

.status,
.order-number {
  font-weight: bold;
}

.order-number {
  color: #F04E40;
}

.go-back-previous-page {
  color: #08C;
}

.go-back-previous-page:hover {
  color: #007bff;
}

</style>