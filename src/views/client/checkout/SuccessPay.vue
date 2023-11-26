<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import {useToast} from "vue-toastification";


export default {
  name: "SuccessTransaction",
  components: {LayoutView,},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
    }
  },
  computed: {},

  mounted() {

    this.handleOrder()
  },

  methods: {
    async handleOrder() {
    const dataCheckout = this.$cookies.get("checkout_data")
      if(dataCheckout){
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
            .then(res => {
              console.log(res.data)
              this.toast.success("Đặt hàng thành công.")
              this.$router.push({name: 'OrderDetails', params: {id: res.data}});
            }).catch(err => {
              if (err.response.status === 400) {
                this.toast.warning(err.response.data.message)
              }
              console.log(err)
            })
        localStorage.removeItem('cartList');
        this.$cookies.remove("checkout_data")
      }
    },
  }
}
</script>

<template>
  <LayoutView>
    <section class="mt-error-sec dark">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <h1 class="text-uppercase montserrat">404</h1>
            <h3 class="text-uppercase montserrat">Trang không tồn tại</h3>
            <section class="mt-detail-sec" style="padding: 0 0 40px 0">
              <div class="container" style="border-radius: 7px;background-color: #fff">
                <form class="bill-detail">
                  <div class="row py-5" style="display: flex; justify-content: center;">
                    <router-link to="/" class="btn process-btn">Quay lại
                    </router-link>
                  </div>
                </form>
              </div>
            </section>
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

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');

</style>