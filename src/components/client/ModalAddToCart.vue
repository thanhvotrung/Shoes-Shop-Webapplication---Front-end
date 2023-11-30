<script>
import axios from "axios";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';
import {useToast} from "vue-toastification";

export default {
  name: "ModalAddToCart",
  components: {Form, Field},
  props: ["id"],
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    const schemaSize = Yup.object().shape({
      sizeSmallCart: Yup.string().required(),
    })
    return {
      schemaSize,

      productSmallCart: null,
      imageSmallCart: null,
      sizesVNSmallCart: [35, 36, 37, 38, 39, 40, 41, 42],
      sizesProductSmallCart: [],
      sizeSmallCart: null,
      quantitySmallCart: 1,
    }
  },
  watch: {
    id: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(id) {
        if (id) {
          this.sizeSmallCart = null
          this.quantitySmallCart = 1
          this.fetchData()
        }
      },
    },
    quantitySmallCart() {
      if (this.quantitySmallCart <= 0) {
        this.quantitySmallCart = 1
      }
      if (this.quantitySmallCart > 10) this.quantitySmallCart = 10

    }
  },

  methods: {

    handleAddToCart() {
      const cartList = JSON.parse(localStorage.getItem('cartList')) || [];

      const foundItem = cartList.find(item => item.product_id === this.id && item.size === this.sizeSmallCart);

      if (foundItem) {
        foundItem.quantity += this.quantitySmallCart;
      } else {
        const cartItem = {
          product_id: this.id,
          size: this.sizeSmallCart,
          quantity: this.quantitySmallCart,
        };
        cartList.push(cartItem);
      }

      localStorage.setItem('cartList', JSON.stringify(cartList));
      this.toast.success("Đã thêm vào giỏ hàng.")
      setTimeout(() => {
        this.$refs.closeShortDetail.click()
      }, 500)
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/api/${this.id}`).then(res => {
        this.productSmallCart = res.data
        this.imageSmallCart = res.data.productImages[0]
      }).catch(err => {
        console.log(err)
      })

      await axios.get(`http://localhost:3030/api/product/sizes/${this.id}`).then(res => {
        this.sizesProductSmallCart = res.data
      }).catch(err => {
        console.log(err)
      })
    },

    handleUpdateQuantity(quantity) {
      this.quantitySmallCart = quantity;
    },
  },

  computed: {
    filteredSizesSmallCart() {
      return this.sizesVNSmallCart.map(sizeVN => {
        const outStock = !this.sizesProductSmallCart.includes(sizeVN);
        return {
          size: sizeVN,
          outStock: outStock
        };
      });
    }
    ,
  },
}
</script>

<template>
  <div class="modal fade" id="modal-add-to-cart" tabindex="-1" role="dialog"
       aria-labelledby="modalAddNewCategory" aria-hidden="true">
    <div style="transition: transform .3s ease-out; translate: 0 50px;" class="modal-dialog modal-sm" role="document">
      <div class="modal-content" style="width: 350px; border: 0px solid rgba(0,0,0,.2);
    border-radius: 10px;">
        <div class="modal-body" v-if="productSmallCart">
          <div>
            <button ref="closeShortDetail" type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="bi bi-x-lg" style="-webkit-text-stroke: 1px;"></i></span>
            </button>
          </div>
          <Form @submit="handleAddToCart" :validation-schema="schemaSize" v-slot="{ errors }">
            <div>
              <div class="d-flex align-items-center">
                <img v-if="productSmallCart.productImages" style="width: 100px" :src="productSmallCart.productImages[0]" alt="Slide">
                <div class="text-start px-5">
                  <div class="">
                    <div class="font-weight-bold py-2 cart-name">{{ productSmallCart.name }}</div>
                    <div class="cart-description">Giá tiền:
                      <span v-if="productSmallCart.promotionPrice > 0" class="">{{ formattedPrice(productSmallCart.promotionPrice) }}&ensp;<del>{{
                          formattedPrice(productSmallCart.price)
                        }}</del></span>
                      <span v-else class="">{{ formattedPrice(productSmallCart.price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="size-product">
                <div>
                  <div class="text-center text-uppercase fw-bold py-4">
                    Kích cỡ:
                    <span :class="{'text-danger' : errors.sizeSmallCart}" v-if="!sizeSmallCart">Chọn một kích cỡ</span>
                    <span v-else>{{ sizeSmallCart }}</span>
                  </div>
                  <div class="list d-flex justify-content-center flex-wrap">
                    <div v-for="(size2, index) in filteredSizesSmallCart" :key="index+100" class="mr-2 mb-2 rounded">
                      <div v-if="size2.outStock">
                        <Field disabled type="radio" class="btn-check" name="sizeSmallCart" :id="index+100"
                               :value="size2.size"
                               v-model="sizeSmallCart"/>
                        <label class="btn btn-outline-secondary text-2 text-decoration-line-through"
                               :for="index+100">{{ size2.size }}</label>
                      </div>
                      <div v-else>
                        <Field type="radio" class="btn-check" name="sizeSmallCart" :id="index+100" :value="size2.size"
                               v-model="sizeSmallCart"/>
                        <label class="btn btn-outline-secondary text-2" :for="index+100">{{
                            size2.size
                          }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cart-quantity ">
                <div class="text-row-center flex-column d-flex align-items-center justify-content-center py-4">
                  <div class="item-quantity d-flex">
                    <button type="button" @click="handleUpdateQuantity(quantitySmallCart - 1)"><i
                        class="bi bi-dash"></i></button>
                    <input type="number" v-model="quantitySmallCart">
                    <button type="button" @click="handleUpdateQuantity(quantitySmallCart + 1)"><i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <div>
                    <button type="submit" v-if="sizesProductSmallCart.length > 0" class="addToCart my-4">Thêm vào giỏ hàng
                    </button>
                    <button disabled v-else class="addToCart my-4" style="background-color: rgb(120 120 120)">Hết hàng
                    </button>
                  </div>
                  <div class="detail">
                    <router-link @click="$refs.closeShortDetail.click()"
                                 :to="{name: 'ProductDetails',  params: {slug: productSmallCart.slug ,id: productSmallCart.id}}"
                                 class="fw-bold">
                      Chi tiết sản phấm
                      <span class=""><i class="bi bi-arrow-right"></i>
                      </span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Montserrat", sans-serif;
}


.bi-arrow-right {
  -webkit-text-stroke: 1px;
}

.detail span {
  display: inline-block;
  transition: transform .3s ease-out;
}

.detail:hover a {
  color: #ff8283;
}

.detail:hover span {
  transition: transform .3s ease-out;
  display: inline-block;
  transform: translate(5px, 0);
}

.addToCart {
  padding: 12px 10px 10px;
  text-align: center;
  text-transform: uppercase;
  display: block;
  font-size: 14px;
  line-height: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  border: none;
  outline: none;
  border-radius: 25px;
  -webkit-transition: all .25s linear;
  transition: all .25s linear;
  background: #f89393;
  color: #fff;
}

.addToCart:hover {
  background-color: #f46e6f;
}

.cart-quantity {
  font-size: 16px;
  text-align: center;
}

.item-quantity {
  border: 2px solid #a1a1a1;
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
</style>