<script>
/* eslint-disable */
import LayoutView from "@/components/admin/LayoutView.vue";
import * as Yup from 'yup'
import {Form, Field} from 'vee-validate'
import axios from 'axios'
import {useToast} from "vue-toastification";

export default {
  name: "AddPromotion",
  components: {LayoutView, Form, Field},
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    const schema = Yup.object().shape({
      code: Yup.string().required("Mã khuyến mãi không được trống."),
      name: Yup.string().required("Tên trương trình khuyến mãi không được trống."),
      discountValue: Yup.number().required("Mức giảm không được trống.")
          .typeError('Không đúng định dạng')
          .positive("Số phải dương"),
      expiredDate: Yup.date().required("Ngày hết hạn không được trống."),
    })
    return {
      schema,
      code: null,
      name: null,
      discountType: 1,
      discountValue: 0,
      maxValue: 0,
      isPublic: true,
      active: true,
      expiredDate: null,
    }
  },

  methods: {
    createCode(code) {
      const date = new Date(); // Create a new Date object
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${code.toUpperCase() + "-" + year + month + day}`
    },

    async addPromotion() {
      const newPromotion = {
        code: this.createCode(this.code),
        name: this.name,
        discount_type: this.discountType,
        discount_value: this.discountValue,
        max_value: this.maxValue,
        is_public: this.isPublic,
        active: this.active,
        expired_date: this.expiredDate,
      }

      await axios.post(`http://localhost:3030/api/admin/promotions`, newPromotion)
          .then(res => {
            console.log(res)
            this.toast.success("Tạo khuyến mãi thành công.")
            this.$router.push('/admin/promotions')
          }).catch(err => {
            try {
              this.toast.warning(err.response.data.message)
            } catch (e) {
              console.log(err)
            }
          })
    }
  },
}
</script>

<template>
  <LayoutView>
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
              <router-link to="/admin/promotions">
                Danh sách khuyến mại
              </router-link>
            </li>
            <li><span>Tạo mới khuyến mại</span></li>
          </ol>
        </div>
      </header>
      <Form @submit="addPromotion" :validation-schema="schema" v-slot="{ errors }">
        <section class="card">
          <header class="card-header">
            <h2 class="card-title">Tạo khuyến mại</h2>
            <br>
            <div class="row">
              <div class="col-sm-6">
                <div class="mb-3">
                  <router-link to="/admin/promotions" class="btn btn-primary mx-1 text-2"
                               style="border: 1px solid #cccc">
                    <i class="bi bi-chevron-left"></i> Trở về
                  </router-link>
                  <button type="submit" id="addToTable" class="btn btn-primary mx-1 text-2">Tạo khuyến mại <i
                      class="bi bi-plus-circle-dotted"></i></button>
                </div>
              </div>
            </div>
          </header>
          <div class="card-body ">
            <!-- Main content -->
            <div class="row">
              <div class="col-lg-6 col-md-8 col-12">
                <div class="card card-outline">
                  <div class="card-body pad promotion-box">
                    <div class="form-group">
                      <div>
                        <span class="text-danger">Mã kích hoạt chỉ bao gồm ký tự in hoa từ A-Z và số từ 0-9(độ dài từ 4 - 16 ký tự)</span>
                        <br>
                        <label class="required-label" for="code">Mã code<span
                            class="required">*</span></label>
                        <span class="text-danger font-italic text-1 pl-1">{{ errors.code }}</span>
                      </div>
                      <Field name="code" v-model="code" type="text" class="form-control text-4" id="code"/>
                    </div>
                    <div class="form-group">
                      <div>
                        <label class="required-label" for="name">Tên chương trình</label>
                        <span class="invalid-feedback"
                              id="invalid-feedback-name">Độ dài tiêu đề từ 1 - 300 ký tự</span>
                        <span class="text-danger font-italic text-1 pl-1">{{ errors.name }}</span>
                      </div>
                      <Field name="name" v-model="name" type="text" class="form-control text-4" id="name"/>
                    </div>
                    <div class="form-group">
                      <label for="discount-type" class="required-label">Khuyến mãi theo</label>
                      <select name="discountType" v-model="discountType" class="form-control text-4" id="discount-type">
                        <option value=1>Phần trăm (%)</option>
                        <option value=2>Khoản tiền trực tiếp</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <div>
                        <label class="required-label" for="discount-value">Mức giảm</label>
                        <span class="invalid-feedback" id="invalid-feedback-discount-value"></span>
                        <span class="text-danger font-italic text-1 pl-1">{{ errors.discountValue }}</span>
                      </div>
                      <Field name="discountValue" v-model="discountValue" type="number"
                             class="form-control text-4" id="discount-value"/>
                    </div>
                    <div v-if="discountType == 1" class="form-group discount-exactly">
                      <div>
                        <label class="required-label" for="max-value">Mức giảm tối đa</label>
                        <span class="invalid-feedback" id="invalid-feedback-max-value">Mức giảm giá tối đa cần lớn hơn 1000đ</span>
                        <span class="text-danger font-italic text-1 pl-1">{{ errors.maxValue }}</span>
                      </div>
                      <Field name="maxValue" v-model="maxValue" type="number" class="form-control text-4"
                             id="max-value"/>
                    </div>
                    <div class="form-group">
                      <div>
                        <label class="required-label" for="expired-date">Ngày hết hạn</label>
                        <span class="text-danger font-italic text-1 pl-1">{{ errors.expiredDate }}</span>
                      </div>
                      <Field type="date" name="expiredDate" v-model="expiredDate" class="form-control text-4"
                             id="expired-date"/>
                    </div>
                    <div class="form-group">
                      <label class="" for="public">Công khai khuyến mãi</label>
                      <div class="checkbox-wrapper-7">
                        <input name="public" v-model="isPublic" class="tgl tgl-ios" id="public" type="checkbox"/>
                        <label class="tgl-btn" for="public"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="active">Kích hoạt khuyến mãi</label>
                      <div class="checkbox-wrapper-7">
                        <input name="active" v-model="active" class="tgl tgl-ios" id="active" type="checkbox"/>
                        <label class="tgl-btn" for="active"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Form>
    </section>
  </LayoutView>
</template>

<style scoped>

</style>