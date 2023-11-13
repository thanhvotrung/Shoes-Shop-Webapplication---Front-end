<template>
  <router-view
  :cartList="cartList"
  @fetchCartData="fetchCartData"
  />
</template>

<script>
export default {
  data() {
    return {
      cartList: []
    }
  },
  methods: {
    fetchCartData() {
      this.cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    }
  },
  mounted() {
    this.fetchCartData()
  }
}
</script>

