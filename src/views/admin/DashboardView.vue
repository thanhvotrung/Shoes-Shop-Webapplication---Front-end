<script>
import LayoutView from "@/components/admin/LayoutView.vue";

export default {
  name: "DashboardView",
  components: {LayoutView}
}
</script>

<template>
<LayoutView>
  <section role="main" class="content-body" id="main-content">
    <header class="page-header">
      <div class="right-wrapper text-right mr-5">
        <ol class="breadcrumbs">
          <li>
            <router-link to="/admin"><i class="bx bx-home-alt"></i></router-link>
          </li>
        </ol>
      </div>
    </header>
    <div class="row">
      <div class="col-lg-12">
        <div class="row mb-3">
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-primary mb-3">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-primary">
                      <i class="fas fa-life-ring"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Số lượng sản phẩm</h4>
                      <div class="info">
                        <strong class="amount" id="product-count"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/products">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-secondary">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-warning">
                      <i class="fas fa-certificate"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Tổng số danh mục</h4>
                      <div class="info">
                        <strong class="amount" id="category-count"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/categories">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-secondary">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-success">
                      <i class="fas fa-mail-bulk"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Tổng số bài viết</h4>
                      <div class="info">
                        <strong class="amount" id="post-count"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/posts">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-tertiary mb-3">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-secondary">
                      <i class="fas fa-shopping-cart"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Tổng số đơn hàng</h4>
                      <div class="info">
                        <strong class="amount" id="order-count"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/orders">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-quaternary">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-info">
                      <i class="fas fa-bookmark"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Tổng số nhãn hiệu</h4>
                      <div class="info">
                        <strong class="amount" id="brands-count"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/brands">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="col-xl-4">
            <section class="card card-featured-left card-featured-tertiary mb-3">
              <div class="card-body">
                <div class="widget-summary">
                  <div class="widget-summary-col widget-summary-col-icon">
                    <div class="summary-icon bg-danger">
                      <i class="fas fa-user-injured"></i>
                    </div>
                  </div>
                  <div class="widget-summary-col">
                    <div class="summary">
                      <h4 class="title">Tổng số user</h4>
                      <div class="info">
                        <strong class="amount" id="countUser"></strong>
                      </div>
                    </div>
                    <div class="summary-footer">
                      <a class="text-muted text-uppercase" href="/admin/users">(Xem chi tiết)</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="row pt-4">
      <div class="col-lg-7 mb-4 mb-lg-0">
        <section class="card">
          <header class="card-header">
            <div class="card-actions">
              <a href="#" class="card-action card-action-toggle" data-card-toggle></a>
              <a href="#" class="card-action card-action-dismiss" data-card-dismiss></a>
            </div>
            <h2 class="card-title">Thống kê doanh số</h2>
            <div class="row" style="margin-top: 20px">
              <div class="col-md-3">
                <input type="date" id="datepicker" class="form-control">
              </div>
              <div class="col-md-3">
                <input type="date" id="datepicker2" class="form-control">
              </div>
              <div class="col-md-3">
                <button type="button" id="btn-dashboard-filter" class="btn btn-primary btn-sm"
                        value="Lọc kết quả">Lọc kết quả
                </button>
                <a href="/admin" class="btn btn-primary btn-sm">refesh</a>
              </div>
            </div>
          </header>
          <div class="card-body">
            <div class="chart chart-md" id="chart"></div>
          </div>
        </section>
      </div>

      <div class="col-lg-5">
        <section class="card">
          <header class="card-header">
            <div class="card-actions">
              <a href="#" class="card-action card-action-toggle" data-card-toggle></a>
              <a href="#" class="card-action card-action-dismiss" data-card-dismiss></a>
            </div>
            <h2 class="card-title">Số lượng Sản phẩm được mua theo danh mục</h2>
          </header>
          <div class="card-body">
            <canvas id="barChart"></canvas>
          </div>
        </section>
      </div>

    </div>
    <div class="row pt-4">
      <div class="col-lg-5 mb-4 mb-lg-0">
        <section class="card">
          <header class="card-header">
            <div class="card-actions">
              <a href="#" class="card-action card-action-toggle" data-card-toggle></a>
              <a href="#" class="card-action card-action-dismiss" data-card-dismiss></a>
            </div>
            <h2 class="card-title">Số lượng sản phẩm được mua theo nhãn hiệu</h2>
          </header>
          <div class="card-body">
            <canvas id="doughnutBrand"></canvas>
          </div>
        </section>
      </div>
      <div class="col-lg-7">
        <section class="card">
          <header class="card-header">
            <div class="card-actions">
              <a href="#" class="card-action card-action-toggle" data-card-toggle></a>
              <a href="#" class="card-action card-action-dismiss" data-card-dismiss></a>
            </div>
            <h2 class="card-title">10 Sản phẩm bán chạy nhất trong tháng</h2>
          </header>
          <div class="card-body">
            <canvas id="myChartProduct"></canvas>
          </div>
        </section>
      </div>
    </div>
  </section>
</LayoutView>
</template>

<style scoped>

</style>