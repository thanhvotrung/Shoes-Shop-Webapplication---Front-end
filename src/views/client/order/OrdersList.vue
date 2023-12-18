<script>
import axios from "axios";
import jwtDecode from "jwt-decode";
import LayoutView from "@/components/client/LayoutView.vue";

export default {
  name: "OdersHistory",
  components: {LayoutView},
  data() {
    return {
      orders: [],
      email: null,
      token: null,
      status: 1,
    }
  },
  methods: {
    async fetchData() {
      await axios.get(`http://localhost:3030/api/order-list`, {params: {status: this.status, email: this.email}}).then(res => {
        this.orders = res.data
        console.log("data 2,", res.data)
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
    getOrderStatus(event){
      this.status = event.currentTarget.getAttribute('data-status')
      this.fetchData()
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
<!--              <a class="btn btn-primary red-btn sign-out-btn" href="/api/logout">Đăng xuất</a>-->
            </div>
          </div>
        </div>
        <div class="col-lg-9 main-content-wrapper">
          <div class="main-content">
            <div class="nav-tab">
              <ul class="nav nav-pills" id="pills-tab" role="tablist">
                <li class="nav-item">
                  <div class="nav-link order-status" data-status="1" @click="getOrderStatus" :class="{'active' : status == 1}">Chờ lấy hàng</div>
                </li>
                <li class="nav-item">
                  <div class="nav-link order-status" data-status="2" @click="getOrderStatus" :class="{'active' : status == 2}">&Dstrok;ang giao h&agrave;ng</div>
                </li>
                <li class="nav-item">
                  <div class="nav-link order-status" data-status="3" @click="getOrderStatus" :class="{'active' : status == 3}">&Dstrok;&atilde; giao h&agrave;ng</div>
                </li>
<!--                <li class="nav-item">-->
<!--                  <div class="nav-link order-status" data-status="4" @click="getOrderStatus" :class="{'active' : status == 4}">&Dstrok;ơn hàng đã trả lại</div>-->
<!--                </li>-->
<!--                <li class="nav-item">-->
<!--                  <div class="nav-link order-status" data-status="5" @click="getOrderStatus" :class="{'active' : status == 5}">Đơn hàng đã hủy</div>-->
<!--                </li>-->
              </ul>
            </div>
            <div class="tab-content" id="pills-tabContent">
              <div v-if="orders.length > 0" class="tab-pane fade show active" id="list-order" role="tabpanel" aria-labelledby="pending-tab">
                <div v-for="(order) in orders" :key="order.id">
                  <!-- Item -->
                  <div class="item">
                    <div class="header-item">
                      <div class="order-number-wrapper">
                        Mã đơn <a class="order-number"># {{order.id}}</a>
                      </div>
                      <router-link :to="{name: 'OrderDetails', params: {id: order.id}}" class="full-details">Xem chi tiết</router-link>
                    </div>
                    <div class="item-info-wrapper">
                      <div class="product-info-wrapper">
                        <div class="thumbnails"><img :src="order.productImg" class="img-fluid"/></div>
                        <div class="product-info"><span class="name">{{order.name}}</span>
                          <div class="size">Kích cỡ: {{order.size}} EU</div>
                          <div class="size">Số lượng: {{order.quantity}}</div>
                        </div>
                      </div>
                      <div class="price bid-price"><span class="text-price">{{formattedPrice(order.price)}}</span></div>
                    </div>
                    <div class="item-info-wrapper" style="border-top: 1px solid #D5D6D6; margin-top: 10px">
                      <div class="product-info-wrapper">
                        <div class="product-info"><span class="name">Tổng đơn hàng: {{order.count}}</span>
                        </div>
                      </div>
                      <div class="price bid-price"><span class="text-price"><span>Tổng tiền: </span>{{formattedPrice(order.totalPrice)}}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <section v-if="orders.length <=0" class="mt-error-sec dark vh-100" style="background-color: #fff">
                <div class="container">
                  <div class="row">
                    <div class="col-xs-12 text-center">
                      <h1 class="text-uppercase montserrat">Không có đơn hàng nào được tìm thấy</h1>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  </LayoutView>
</template>

<style scoped>
*{
  font-family: "Montserrat", sans-serif;
}

.left-sidebar {
  border-radius: 0.25rem;
  margin-top: 40px;
  margin-bottom: 40px;
  padding: 10px;
  background-color: #fff;
}
.left-sidebar .nav-sidebar {
  margin: 1.25rem;
}
.nav-sidebar {
  display: grid;
  grid-row-gap: 0.9375rem;
}
.main-content{
  margin-top: 41px;
  margin-bottom: 50px;

}

.main-content .nav-tab {
  border-radius: 0.5rem;
  background-color: #fff;
}
.main-content .nav {
  display: flex;
  flex-wrap: wrap;
}
.main-content .nav-item {
  flex-grow: 1;
  text-align: center;
}
.main-content .nav-pills .nav-link{
  color: #2e2e2e;
}
.main-content .nav-pills .nav-link.active {
  background-color: transparent;
  color: #2e2e2e;
  border-radius: 0;
  border-bottom: 2px solid #ccc;
}
.main-content .nav-link {
  display: block;
  padding-top: 1.25rem;
}
.main-content .tab-content {
  margin-top: 0.25rem;
}
.main-content .item,
.main-content .item-small {
  padding: 1rem 2.5rem;
  border-bottom: 0.0625rem solid #D5D6D6 !important;
  border-radius: 0.25rem;
  color: #333333;
  font-weight: normal;
  margin-bottom: 1.875rem;
}
.main-content .header-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
}
.main-content .full-details,
.main-content .order-number {
  font-weight: bold;
  color: #007bff;
}
.main-content .item-info-wrapper {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  padding-top: 1.25rem;
  align-items: center;
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

.main-content .item-small .item-info-wrapper {
  display: block;
}
.main-content .item-small .product-info {
  margin: 0px;
}
.main-content .item-small .price {
  text-align: left;
}

.nav-pills {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>