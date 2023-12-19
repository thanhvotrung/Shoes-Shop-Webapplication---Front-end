<script>

export default {
  name: "HeaderView",

}
</script>

<template>
  <header class="header">
    <div class="logo-container">
      <router-link to="/admin" class="logo"> <img src="@/assets/logo.png" style="width: 40px" alt="Logo sóp">
      </router-link>
    </div>

    <div class="header-right">
      <span class="separator dropdown"></span>
      <div id="userbox" class="userbox">
        <a href="#" data-bs-toggle="dropdown" >
          <figure class="profile-picture">
            <img src="@/assets/adminlte/img/avatar.png" alt="Joseph Doe" class="rounded-circle"
                 />
          </figure>
          <div class="profile-info" >
            <span class="name text-3">ADMIN</span>
            <span class="role text-2 pt-2">Administrator</span>
          </div>
          <i class="fa custom-caret"></i>
        </a>
        <div class="dropdown-menu">
          <ul class="list-unstyled mb-2">
            <li class=""></li>
<!--            <li>-->
<!--              <a class="dropdown-item text-4" href="#"><i-->
<!--                  class="bx bx-user-circle"></i>Thông tin tài khoản</a>-->
<!--            </li>-->
            <li>
              <router-link to="/" class="dropdown-item text-4"><i
                  class="bx bx-accessibility"></i>Quay lại trang chủ</router-link>
            </li>
<!--            <li>-->
<!--              <a class="dropdown-item text-4" href="#"><i class="bx bx-power-off"></i> Đăng xuất</a>-->
<!--            </li>-->
          </ul>
        </div>
      </div>
    </div>

  </header>
</template>

<style scoped>

</style>