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

<style>
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');
</style>

