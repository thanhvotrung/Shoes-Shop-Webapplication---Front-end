<script>
export default {
  name: "SidebarView",

  methods: {
    fff(){
      document.querySelector("#sidebar").classList.toggle("collapsed");
    }
  }
}
</script>

<template >
  <aside  id="sidebar-left" class="sidebar-left" >
    <div class="sidebar-header">
      <div class="sidebar-toggle d-none d-md-block" data-toggle-class="sidebar-left-collapsed"
           data-target="html" data-fire-event="sidebar-left-toggle">
        <i class="bi bi-justify" aria-label="Toggle sidebar"></i>
      </div>
    </div>
    <div class="nano">
      <div class="nano-content">
        <nav id="menu" class="nav-main " role="navigation">
          <ul class="nav nav-main">
            <li>
              <router-link to="/admin">
                <i class="bx bx-home-alt" aria-hidden="true"></i>
                <span>Trang chủ</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'ListCategory'}">
                <i class="bx bx-layout"></i>
                <span>Quản lý danh mục</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/brands">
                <i class="bx bx-layout"></i>
                <span>Quản lý nhãn hiệu</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/products">
                <i class="bx bx-loader-circle"></i>
                <span>Quản lý sản phẩm</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/news">
                <i class="bx bx-cart-alt" aria-hidden="true"></i>
                <span>Quản lý bài viết</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/promotions">
                <i class="bx bx-collection" aria-hidden="true"></i>
                <span>Quản lý khuyến mại</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/orders-list">
                <i class="bx bx-cart-alt" aria-hidden="true"></i>
                <span>Quản lý đơn hàng</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/users">
                <i class="bx bx-cart-alt" aria-hidden="true"></i>
                <span>Quản lý tài khoản</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-main a {
  font-size: 14px;
}


</style>