<script>
import LayoutView from "@/components/client/LayoutView.vue";

export default {
  name: "NotFound",
  components: {LayoutView}
}
</script>

<template>
<LayoutView>
  <section class="mt-error-sec dark">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 text-center">
          <h1 class="text-uppercase montserrat" style="font-size: 100px">404</h1>
          <h1 class="text-uppercase montserrat py-5" style="font-size: 50px">Trang không tồn tại</h1>
        </div>
      </div>
    </div>
  </section>
</LayoutView>
</template>

<style scoped>

</style>