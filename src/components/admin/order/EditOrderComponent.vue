<script>
import {useRoute} from "vue-router";
import {ref} from "vue";
import axios from "axios";

export default {
  name: "EditOrderComponent",

  async setup() {
    const route = useRoute()
    const id = route.params.id
    const order = ref(null)
    const orderDetails = ref(null)

    await new Promise(resolve => setTimeout(resolve, 1000)); // 1000 milliseconds = 1 giây

    await axios(`http://localhost:3030/api/admin/orders/info/${id}`)
        .then(res => {
          order.value = res.data
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })

    await axios(`http://localhost:3030/api/admin/orders/products/${id}`)
        .then(res => {
          orderDetails.value = res.data
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })

    return {
      order,
      orderDetails,
      id,
      route,
    }
  },

  methods: {
    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleString('vi-VN', options);
    },

    formattedPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
  }

}
</script>

<template>

  <section role="main" class="content-body" id="main-content">
    <header class="page-header">
      <div class="right-wrapper text-right mr-5">
        <ol class="breadcrumbs">
          <li>
            <router-link to="/admin">
              <i class="bx bx-home-alt"></i>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/orders-list">
              Danh sách đơn hàng
            </router-link>
          </li>
          <li><span>Cập nhât đơn hàng</span></li>
        </ol>
      </div>
    </header>
    <section class="card">

      <header class="card-header">
        <h2 class="card-title">Cập nhật đơn hàng</h2>
        <br>
        <div class="row">
          <div class="col-sm-6">
            <div class="mb-3">
              <router-link to="/admin/orders-list" class="btn btn-primary mx-1 text-3"
                           style="border: 1px solid #cccc"><i
                  class="bi bi-chevron-left"></i> Trở về
              </router-link>
              <button type="button" id="addToTable" class="btn btn-primary mx-1 text-3 btn-update-order">Cập nhật <i
                  class="bi bi-plus-circle-dotted"></i></button>
            </div>
          </div>
        </div>
      </header>
      <div class="card-body">
        <!-- Main content -->
        <div class="row">
          <div class="col-12">
            <div class="card card-outline">
              <div class="card-body pad">
                <div class="row">
                  <div class="col-md-8">
                    <div class="info-div">
                      <h3>Thông tin người đặt</h3>
                      <div class="row">
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-person"></i></span>
                            </div>
                            <div class="form-control text-4" v-text="order.createdBy.fullName"></div>
                          </div>
                        </div>
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-telephone"></i></span>
                            </div>
                            <div class="form-control text-4" v-text="order.createdBy.phone"></div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-envelope"></i></span>
                            </div>
                            <div class="form-control text-4" v-text="order.createdBy.email"></div>
                          </div>
                        </div>
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-calendar2"></i></span>
                            </div>
                            <div class="form-control text-4"
                                 v-text="formattedDate(order.createdAt)"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="info-div">
                      <h3>Thông tin người nhận</h3>
                      <div class="row">
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-person"></i></span>
                            </div>
                            <div v-if="order.status != 1" id="receiver-name" class="form-control text-4" v-text="order.receiverName"></div>
                            <input v-else id="receiver-name" type="text" class="form-control text-4" v-model="order.receiverName">
                            <span class="invalid-feedback" id="invalid-feedback-name">Họ tên trống</span>
                          </div>
                        </div>
                        <div class="col-md-6 mt-2">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-4"><i class="bi bi-telephone"></i></span>
                            </div>
                            <div v-if="order.status != 1" id="receiver-phone" class="form-control text-4" v-text="order.receiverPhone"></div>
                            <input v-else id="receiver-phone" type="text" class="form-control text-4"
                                   v-model="order.receiverPhone">
                            <span class="invalid-feedback" id="invalid-feedback-phone">Điện thoại trống</span>
                          </div>
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-md-12">
                          <div class="input-group">
                            <textarea disabled v-if="order.status != 1" class="pl-2 text-4" name="receiver-address" id="receiver-address" cols="100" rows="5"
                                      v-model="order.receiverAddress"></textarea>
                            <textarea v-else class="pl-2 text-4" name="receiver-address" id="receiver-address" cols="100" rows="5"
                                      v-model="order.receiverAddress"></textarea>
                            <span class="invalid-feedback" id="invalid-feedback-address">Địa chỉ trống</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="info-div pt-5">
                      <label>Chi tiết đơn hàng</label>
                      <div class="table-responsive">
                        <table class="table table-bordered">
                          <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Kích cỡ</th>
                            <th>Số lượng</th>
                            <th>Giá tiền</th>
                            <th>Khuyến mãi</th>
                            <th>Mức giảm</th>
                            <th>Thành tiền</th>
                          </tr>
                          </thead>
                          <tbody v-if="orderDetails">
                          <tr v-for="orderDetail in orderDetails" :key="orderDetail.id">
                            <td>
                              <span target="_blank" href="#">{{orderDetail.product.name}}</span>
                            </td>
                            <td>
                              <span>{{orderDetail.size}}</span>
                            </td>
                            <td>
                              <span class="text-quantity">{{ orderDetail.quantity }}</span>
                            </td>
                            <td>
                              <span class="text-price">{{ formattedPrice(orderDetail.price) }}</span>
                            </td>
                            <td>
                              <span v-if="order.promotion != null" v-text="order.promotion.couponCode"></span>
                            </td>
                            <td>
                              <div v-if="order.promotion != null">
                                <div v-if="order.promotion.discountType == 1">
                                  <span v-text="order.promotion.discountValue"></span> %
                                </div>
                                <div v-if="order.promotion.discountType == 2">
                                  <span class="text-price" v-text="formattedPrice(order.promotion.discountValue)"></span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span class="text-price" v-text="formattedPrice(order.totalPrice)"></span>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="edit-order-div">
                      <div class="mb-3">
                        <label>Trạng thái đơn hàng</label>
                        <div id="receiver-phone" class="form-control text-4 badge badge-warning" v-if="order.status == 1">Chờ lấy hàng</div>
                        <div id="receiver-phone" class="form-control text-4 badge badge-primary" v-if="order.status == 2">Đang giao hàng</div>
                        <div id="receiver-phone" class="form-control text-4 badge badge-success" v-if="order.status == 3">Đã giao hàng</div>
                        <div id="receiver-phone" class="form-control text-4 badge badge-light" v-if="order.status == 5">Đơn hàng bị hủy</div>
                      </div>
                      <div class="mb-3">
                        <label>Ghi chú</label>
                        <div>
                          <textarea disabled v-if="order.status != 1" class="pl-2" name="note" id="note" cols="40" rows="5" placeholder="Ghi chú" v-text="order.note"></textarea>
                          <textarea v-else class="pl-2" name="note" id="note" cols="40" rows="5" placeholder="Ghi chú" v-text="order.note"></textarea>
                        </div>
                      </div>
                      <i v-if="order.modifiedAt">Chỉnh sửa lần cuối lúc <span
                          v-text="formattedDate(order.modifiedAt)"></span> bởi <span
                          v-text="order.modifiedBy.fullName"></span></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </section>
</template>

<style scoped>
.input-group-text {
  background-color: #fff;
}
</style>