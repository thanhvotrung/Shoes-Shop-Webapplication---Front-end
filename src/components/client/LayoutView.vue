<script>

import '@/assets/client/css/bootstrap.css'
import '@/assets/client/css/animate.css'
import '@/assets/client/css/icon-fonts.css'
import '@/assets/client/css/main.css'
import '@/assets/client/css/responsive.css'

import {
  initbackTop,
  initStickyHeader
}
  from '@/assets/client/js/jquery.main'

// import LoaderView from "@/components/LoaderView.vue";
import HeaderView from "@/components/client/HeaderView.vue";
import FooterView from "@/components/client/FooterView.vue";
import $ from "jquery";

export default {
  name: "LayoutView",
  components: {HeaderView, FooterView},
  props: ["countCartItem"],
  methods: {
    initNavOpener() {
      $(".side-close , .side-opener , .mt-side-over").on('click',function () {
        $("body").toggleClass("side-col-active");
        $(".side-opener").toggleClass("active");
        $(".mt-side-over").toggleClass("active");
        return false;
      });
      $(".mobile-toggle").on('click',function () {
        $("body").toggleClass("mobile-active");
        $(".mobile-toggle").toggleClass("active");
        return false;
      });
      $(".cart-opener, .mt-mdropover").on('click',function () {
        $(this).parent().toggleClass("open");
        return false;
      });
      $(".search-close, .icon-magnifier, .fa-search").on('click',function () {
        $("body").toggleClass("search-active");
        // console.log("123")
        return false;
      });
      $('.drop-link , #nav > ul > li.drop > a').on('click',function () {
        $(this).next().toggleClass("open");
        return false;
      });
      $('.mt-subopener').on('click',function () {
        $(this).parent().next().toggleClass("open");
        return false;
      });

    },

  },

  mounted() {
    initbackTop()
    initStickyHeader()
    this.initNavOpener()
  }
}
</script>

<template>
  <div id="wrapper">
    <!--    <LoaderView/>-->
    <div class="w1">
      <HeaderView :countCartItem="countCartItem" />
      <slot @fetchCartData="$emit('fetchCartData')"/>
      <FooterView/>
    </div>
    <span ref="onTop" id="back-top" class="fa fa-arrow-up"></span>
  </div>
</template>
<!--@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic%7cMontserrat:400,700%7cOxygen:400,300,700');-->

<style>

</style>