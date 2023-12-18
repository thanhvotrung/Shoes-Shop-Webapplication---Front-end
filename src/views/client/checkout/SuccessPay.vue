<script>
import axios from "axios";
import {useToast} from "vue-toastification";


export default {
  name: "SuccessTransaction",
  components: {},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      idOrder: null,
      responseCode: null,
    }
  },

  mounted() {
    this.responseCode = this.$route.query.vnp_ResponseCode
    this.handleOrder()
  },

  methods: {
    async handleOrder() {
      const dataCheckout = this.$cookies.get("checkout_data")
      if (dataCheckout) {
        let orderDetailsList = []
        for (let i = 0; i < dataCheckout.items.length; i++) {
          let obj = {
            product_id: dataCheckout.items[i].id,
            size: dataCheckout.items[i].size,
            quantity: dataCheckout.items[i].quantity,
            product_price: dataCheckout.items[i].price
          }
          orderDetailsList.push(obj)
        }
        const obj = {
          email: dataCheckout.user.email,
          receiver_name: dataCheckout.user.fullName,
          receiver_phone: dataCheckout.user.phone,
          receiver_address: dataCheckout.user.address,
          coupon_code: dataCheckout.promotionName,
          total_price: dataCheckout.total,
          subtotal_price: dataCheckout.subtotal,
          note: dataCheckout.note,
          products: orderDetailsList
        }
        await axios.post(`http://localhost:3030/api/orders`, obj)
            .then((res) => {
              this.toast.success("Đặt hàng thành công.")
              localStorage.removeItem('cartList');
              this.$cookies.remove("checkout_data")
              this.sendMailSuccess(obj)
              this.idOrder = res.data
              // this.$router.push({name: 'OrderDetails', params: {id: res.data}});
            }).catch(err => {
              if (err.response.status === 400) {
                this.toast.warning(err.response.data.message)
              }
              console.log(err)
            })

      }
      if (this.responseCode == '00') {
        // this.$router.push({name: 'OrderDetails', params: {id: this.idOrder}});
      }
    },

    async sendMailSuccess(data) {
      const details = {
        to: data.email,
        message: `ĐƠN HÀNG CỦA QUÝ KHÁCH ĐÃ ĐƯỢC THANH TOÁN. \n
                CHI TIẾT ĐƠN HÀNG: \n
                Tên người nhận: ${data.receiver_name} \n
                Địa chỉ: ${data.receiver_address} \n
                Số điện thoại: ${data.receiver_phone} \n
                Ghi chú: ${data.note || ''} \n
                Giảm giá: ${this.formattedPrice(data.subtotal_price - data.total_price)} \n
                Tổng hóa đơn: ${this.formattedPrice(data.total_price)} \n
                CẢM ƠN QUÝ KHÁCH ĐÃ MUA HÀNG TẠI FAKESHOES!!!`,
        subject: "ĐẶT HÀNG THÀNH CÔNG! FAKESHOES!!!"
      };

      try {
        const response = await axios.post(`http://localhost:3030/api/sendemailsuccess`, details);
        console.log(response);
        this.toast.success("Đã gửi thư xác nhận về email.");
      } catch (error) {
        console.error(error);
      }
    },
    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

  }
}
</script>

<template>
  <section class="mt-error-sec dark">
    <div class="container">
      <div class="row">

        <div v-if="responseCode == '00'" class="col-xs-12 text-center">
          <div class="d-flex justify-content-center my-5">
            <img style="width: 10rem;" src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png"
                 alt="SUCCESS">
          </div>
          <h1 class="text-uppercase montserrat">Thanh toán thành công</h1>
          <section class="mt-detail-sec" style="padding: 0 0 40px 0">
            <div class="container">
              <form class="">
                <div class=" py-5 d-flex justify-content-center">
                  <div v-if="idOrder" class="mx-2">
                    <router-link :to="{name: 'OrderDetails', params: {id: this.idOrder}}"
                                 class="btn process-btn">Đơn hàng
                    </router-link>
                  </div>
                  <div class="mx-2">
                    <router-link to="/" class="btn process-btn">Trang chủ
                    </router-link>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>

        <div v-else class="col-xs-12 text-center">
          <div class="d-flex justify-content-center my-5">
            <img style="width: 10rem;" src="https://storage.needpix.com/thumbs/false-2061132_1280.png" alt="ERROR">
          </div>
          <h1 class="text-uppercase montserrat">Thanh toán thất bại</h1>
          <section class="mt-detail-sec" style="padding: 0 0 40px 0">
            <div class="container">
              <form class="">
                <div class="py-5 d-flex justify-content-center">
                  <div class="mx-2">
                    <router-link to="/cart" class="btn process-btn">Thử lại
                    </router-link>
                  </div>
                  <div class="mx-2">
                    <router-link to="/" class="btn process-btn">Trang chủ
                    </router-link>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  font-family: "Montserrat", sans-serif;
}


@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');

</style>