<template>
  <router-view
  :countCartItem="countCartItem"
  @fetchCartData="fetchCartData"
  />
</template>

<script>


export default {
  created(){


  },
  data() {
    return {
      cartList: [],
    }
  },

  computed: {
    countCartItem() {
      let count = 0
      if (this.cartList) {
        for (let i = 0; i < this.cartList.length; i++) {
          count += this.cartList[i].quantity
        }
      }
      return count
    },
  },

  methods: {
    fetchCartData() {
      this.cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    },
  },
  mounted() {
    this.fetchCartData()
  }
}
</script>

