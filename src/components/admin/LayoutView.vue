<script>
import "@/assets/adminlte/vendor/bootstrap/css/bootstrap.css"
import "@/assets/adminlte/vendor/boxicons/css/boxicons.min.css"
import "@/assets/adminlte/css/theme.css"

import "@/assets/adminlte/js/theme.js"

import HeaderView from "@/components/admin/HeaderView.vue";
import SidebarView from "@/components/admin/SidebarView.vue";


export default {
  name: "LayoutView",

  components: {HeaderView, SidebarView},

  data() {
    return {
    }
  },

  mounted() {
  }
}
</script>

<template>
  <section class="body">
    <HeaderView/>
    <div class="inner-wrapper">
      <SidebarView/>
      <slot/>
    </div>
  </section>
</template>

<style scoped>

</style>