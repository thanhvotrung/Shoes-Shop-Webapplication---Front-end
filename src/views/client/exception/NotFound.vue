<script>
import LayoutView from "@/components/client/LayoutView.vue";

export default {
  name: "NotFound",
  components: {LayoutView}
}
</script>

<template>
  <LayoutView>
    <!--  <section class="mt-error-sec dark">-->
    <!--    <div class="container">-->
    <!--      <div class="row">-->
    <!--        <div class="col-xs-12 text-center">-->
    <!--          <h1 class="text-uppercase montserrat" style="font-size: 100px">404</h1>-->
    <!--          <h1 class="text-uppercase montserrat py-5" style="font-size: 50px">Trang không tồn tại</h1>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--  </section>-->

    <section class="mt-error-sec dark">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <span class="error-code montserrat">404</span>
            <h1 class="text-uppercase montserrat">Trang không được tìm thấy!</h1>
            <div class="my-5">
              <router-link to="/" class="text-5 font-weight-bold" style="color: #545454"><i class="fa fa-home"></i> QUAY LẠI TRANG CHỦ
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LayoutView>
</template>

<style scoped>

</style>