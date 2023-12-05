<template>
  <LayoutView>
    <main style="background-color: #f2f2f2" id="mt-main" class="  ">
      <div class="container">
        <div class="row">
          <div class="col-lg-3"
               style="background-color: #fff;margin-top: 20px;border-radius: 20px 0px 0px 20px; padding-top: 65px">
            <div class="image" style="width: 250px">
              <img src="https://cdn.printgo.vn/uploads/media/772948/thiet-ke-logo-shop-giay-19_1584095087.jpg">
            </div>
            <div class="text-router">
              <router-link to="/user">Quản lý tài khoản</router-link>
              <router-link to="/don-hang">Quản lý đơn hàng</router-link>
            </div>
          </div>
          <div class="col-lg-9 " style="background-color: #fff;margin-top: 20px; border-radius: 0px 20px 20px 0px">
            <div class="main-content">
              <h1 class="account-title font">Thông tin tài khoản</h1>
              <div class="tab-pane fade show active" id="profile-setting" role="tabpanel"
                   aria-labelledby="profile-setting-tab">
                <Form class="setting-box" v-if="user" @submit="updateProfile" :validation-schema="schemaProfile"
                      v-slot="{errors}">
                  <div class="full-name item-row col-md-10">
                    <div class="text required-label font">Họ tên
                      <span
                          class="text-danger font-italic text-1 float-end">{{ errors.fullName }}</span>
                    </div>
                    <div>
                      <Field class="form-control" id="in-user-fullname" v-model=" user.fullName " name="fullName"/>
                      <div class="invalid-feedback"></div>
                    </div>
                  </div>
                  <div class="email item-row col-md-10">
                    <div class="text required-label font">Email</div>
                    <input class="form-control" disabled="disabled" v-model=" user.email "/>
                  </div>
                  <div class="password item-row col-md-10">
                    <div class="text required-label font">Mật khẩu</div>
                    <div class="password-wrapper d-flex">
                      <input class="form-control" type="password" style="width: 540px;
    margin-right: 20px;" disabled="disabled" autocomplete="autocomplete"
                             value="******"/>
                      <div id="addToTable" class=" mx-1 text-4"
                           style=" padding-top: 11px" data-bs-toggle="modal"
                           data-bs-target="#modal-changepass">Đổi mật khẩu
                      </div>
                    </div>
                  </div>
                  <div class="phone item-row col-md-10">
                    <div class="text required-label font">Số điện thoại</div>
                    <div> <span
                        class="text-danger font-italic text-1 float-end">{{ errors.phone }}</span>
                      <Field type="text" class="form-control" id="in-user-phone" v-model=" user.phone " name="phone"/>
                      <div class="invalid-feedback"></div>
                    </div>
                  </div>
                  <div class="address item-row col-md-10">
                    <div class="text font">Địa chỉ</div>
                    <div>
                      <textarea class="form-control" rows="2" id="in-user-address"
                                v-model=" user.address "></textarea>
                    </div>
                  </div>
                  <div class=" item-row col-md-10 modal-footer">
                    <button class=" red-btn update-btn font btn-type1" style="width: 100px;  margin: 10px 0px 10px 0px ; padding-top: 20px;
    padding-bottom: 20px; font-size: 12px">Cập nhật
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal change password -->
      <div class="modal fade" id="modal-changepass" tabindex="-1" role="dialog"
           aria-labelledby="modalAddNewCategory" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Đổi mật khẩu</h5>
              <button type="button" style="border: none; background-color: transparent; font-size: 30px"
                      data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="background-color: #f2f2f2">
              <div class="mt-side-widget">
                <Form @submit="changePassword" :validation-schema="schema" v-slot="{ errors }">
                  <fieldset>
                    <div>
                      <label for="name" class="form-label" style="padding-left: 15px">Nhập mật khẩu cũ
                        <span
                            class="text-danger">*</span>
                      </label>
                      <span
                          class="text-danger font-italic text-1 float-end">{{ errors.oldPassword }}</span>
                    </div>
                    <Field v-model="oldPassword" name="oldPassword" type="password"
                           :class="{ 'is-invalid': errors.oldPassword }"
                           class="input"/>
                    <div>
                      <label for="name" class="form-label" style="padding-left: 15px">Nhập mật khẩu mới
                        <span
                            class="text-danger">*</span>
                      </label>
                      <span
                          class="text-danger font-italic text-1 float-end">{{ errors.newPassword }}</span>
                    </div>
                    <Field v-model="newPassword" name="newPassword" type="password" class="input"
                           :class="{ 'is-invalid': errors.newPassword }"/>
                    <div>
                      <label for="name" class="form-label" style="padding-left: 15px">Nhập lại mật khẩu
                        <span
                            class="text-danger">*</span>
                      </label>
                      <span
                          class="text-danger font-italic text-1 float-end">{{ errors.confirmPassword }}</span>
                    </div>
                    <Field v-model="confirmPassword" name="confirmPassword" type="password"
                           placeholder="Xác nhận mật khẩu" class="input"
                           :class="{ 'is-invalid': errors.confirmPassword }"/>
                    <div class="modal-footer">
                      <button type="submit"  class=" btn-type1">Lưu mật khẩu</button>
                      <button type="button" class=" btn-secondary btn-type1"  data-bs-dismiss="modal" ref="closeModal_1">Hủy
                      </button>
                    </div>
                  </fieldset>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </LayoutView>
</template>

<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Form, Field} from "vee-validate"
import * as Yup from "yup";
import {useToast} from "vue-toastification";

export default {
  name: 'UserView',
  components: {LayoutView, Form, Field},
  data() {
    const schema = Yup.object().shape({
      oldPassword: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự.."),
      newPassword: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự..")
          .notOneOf([Yup.ref('oldPassword'), null], 'Hai mật khẩu không được giống nhau.'),
      confirmPassword: Yup.string().required("Mật khẩu không được trống.")
          .oneOf([Yup.ref('newPassword'), null], 'Hai mật khẩu không giống nhau.'),

    })
    const phoneRegExp = /^((\+[1-9]{1,4})|(\([0-9]{2,3}\))|([0-9]{2,4}))?[0-9]{3,4}?[0-9]{3,4}?$/
    const schemaProfile = Yup.object().shape({
      fullName: Yup.string().required(" Tên không được để trống."),
      phone: Yup.string()
          .required("Số điện thoại không được trống")
          .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
          .min(10, "Số điện thoại không hợp lệ")
          .max(10, "Số điện thoại không hợp lệ")
    })
    return {
      schema,
      schemaProfile,
      user: null,
      token: null,
      email: null,
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,

    }
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  methods: {
    async changePassword() {
      const obj = {
        email: this.email,
        old_password: this.oldPassword,
        new_password: this.newPassword,
      }

      await axios.post(`http://localhost:3030/api/change-password`, obj).then(res => {
        console.log(res)
        this.$refs.closeModal_1.click();
        this.toast.success("Đổi mật khẩu thành công !")

      }).catch(err => {
            console.log(err)
            this.toast.error("Mật khẩu cũ không chính xác !!!")
          }
      )
    },

    async updateProfile() {
      const obj = {
        phone: this.user.phone,
        full_name: this.user.fullName,
        address: this.user.address,
        email: this.email,
        roles: this.roles
      }
      await axios.put(`http://localhost:3030/api/update-profile`, obj).then(res => {
        console.log(res)
        this.toast.success("Đổi thông tin thành công!")
      }).catch(err => {
            console.log(err)
            this.toast.error("Thông tin không đúng!")
          }
      )
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/users`).then(res => {
        console.log(res.data)
        this.user = res.data
      })
    },
    decodeJwt() {
      // JWT token to be decoded
      const token = this.token; // Replace with your JWT token
      if (token) {
        try {
          // Decode the JWT
          const decodedToken = jwtDecode(token);
          this.email = decodedToken.sub;
          // You can access the decoded claims in the `decodedToken` object
          console.log('Decoded JWT Claims:', decodedToken);
        } catch (error) {
          // Handle any errors (e.g., invalid JWT format)
          console.error('JWT Decoding Error:', error);
        }
      }
    },
    async getUser() {
      if (this.email) {
        await axios.get(`http://localhost:3030/user/${this.email}`).then(res => {
          this.user = res.data
          console.log(this.user)
        }).catch(err => {
          console.log(err)
        })
      }
    },
  },
  mounted() {
    // Lấy cookie JWT_TOKEN từ website
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.getUser()
  },
}
</script>

<style>
.setting-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-title {
  display: flex;
  justify-content: center;
}

.form-control {
  height: 45px;
  font-size: 20px !important;
  margin-bottom: 20px;
  border: none;
  border-radius: 10px;
}


.font {
  font-family: "Montserrat", sans-serif;
}

.text {
  font-size: 14px !important;
}

#addToTable {
  color: #0a6aa1;
}

#addToTable:hover {
  cursor: pointer;
  color: #ff6060;
}

.text-router {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  padding-left: 20px;
  padding-top: 15px;
  line-height: 2;
}

.text-router > a {
  color: #6f6c6c;
  text-decoration: none;
}

.text-router > a:hover {
  color: #ff6060;
}

.modal-dialog {
  margin-top: 20vh;

}

.modal-title {
  text-align: center;
}

.btn-style:hover {
  background-color: #60c7ff;
}
</style>