<script>
import LayoutView from "@/components/client/LayoutView.vue";
import {Field, Form} from "vee-validate";
import {useToast} from "vue-toastification";
import * as Yup from "yup";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

export default {
  name: "ForgotPassword",
  components: {LayoutView, Form, Field},
  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    // Validate form
    const schema = Yup.object().shape({
      email: Yup.string().required("Email khônng được trống.")
          .email("Sai định dạng email."),

    });
    const schema2 = Yup.object().shape({
      password2: Yup.string().required("Password khônng được trống.")
    })
    return {
      schema,
      schema2,
      email: null,
      password2: null,
      code: null,
      showCodeInput: false,
      showNewPass: false,
      newPassword: null,
      hideConfirm: true,
      codeOld: '',
      confirmnewPassword: ''
    }
  },

  methods: {
    generateRandomString() {
      return uuidv4().replace(/-/g, '').substring(0, 6);
    },

    async forgotPassword() {
      const randomCode = this.generateRandomString();
      this.code = randomCode;
      const details = {
        to: this.email,
        message: `Mã xác nhận là: ${randomCode}\n`,
        subject: "THAY ĐỔI MẬT KHẨU - PHAKESHOES"
      }
      await axios.post(`http://localhost:3030/api/sendemail`, details)
          .then(res => {
            console.log(res)
            this.showCodeInput = true;
            this.hideConfirm = false;
            this.toast.success("Đã gửi mã xác nhận về email.")
          }).catch(err => {
            console.log(err)
          })
    },

    async confirmOTP() {
      if (this.code === this.codeOld) {
        this.toast.success("Đã xác nhận mã OTP!")
        this.showCodeInput = false
        this.showNewPass = true;
      } else {
        this.toast.error("Mã OTP không chính xác!")
      }
    },

    async sendNewPassword() {
      if (this.newPassword === this.confirmnewPassword) {
        const repon = {
          email: this.email,
          new_password: this.newPassword
        }
        await axios.post(`http://localhost:3030/api/forgot/change-password`, repon).then(res => {
          console.log(res)
          this.toast.success("Đã thay đổi mật khẩu!")
          window.location.href = '/signin';
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.toast.error("Mật khẩu không trung khớp!")
      }
    }
  },
}
</script>

<template>
  <LayoutView>
    <main id="mt-main">
      <section class="mt-about-sec" style="padding-bottom: 0;">
      </section>
      <!-- Mt About Section of the Page -->
      <!-- Mt Detail Section of the Page -->
      <section class="mt-detail-sec toppadding-zero">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-push-2">
              <div class="holder" style="margin: 0;">
                <nav class="breadcrumbs">
                  <ul class="list-unstyled d-flex">
                    <li>
                      <router-link :to="{name: 'HomePage'}">
                        Trang chủ
                      </router-link>
                      &ensp;<i class="fa fa-angle-right"></i>
                    </li>
                    <li>
                      <router-link :to="{name: 'SigninView'}">
                        &ensp;Đăng nhập
                      </router-link>
                      &ensp;<i class="fa fa-angle-right"></i>
                    </li>
                    <li>&ensp; Quên mật khẩu</li>
                  </ul>
                </nav>
                <div class="mt-side-widget">

                  <header>
                    <h2 style="margin: 0 0 5px;">Quên mật khẩu</h2>
                  </header>
                  <Form @submit="forgotPassword" :validation-schema="schema" v-slot="{ errors }">
                    <fieldset>
                      <Field v-model="email" name="email" type="text" placeholder="Email"
                             :class="{ 'is-invalid': errors.email }" class="input"/>
                      <div class="text-danger font-italic text-1 text-end">{{ errors.email }}</div>
                      <div class="box">
                        <button v-if="hideConfirm" type="submit" class="btn-type1">Gửi mã tới gmail</button>
                      </div>
                    </fieldset>
                  </Form>
                  <!--                  Xác nhận OTP-->
                  <input v-if="showCodeInput" v-model="codeOld" name="code" type="text" placeholder="Nhập mã OTP"
                         class="input"/>
                  <button v-if="showCodeInput" type="submit" class="btn-type1" @click="confirmOTP">Xác nhận OTP</button>
                  <!--                  Nhập mật khẩu mới-->
<!--                  <input v-if="showNewPass" v-model="newPassword" name="code" type="text" placeholder="Mật khẩu mới"-->
<!--                         class="input"/>-->
<!--                  <input v-if="showNewPass" v-model="confirmnewPassword" name="code" type="text"-->
<!--                         placeholder="Xác nhận mật khẩu"-->
<!--                         class="input"/>-->
<!--                  <button v-if="showNewPass" type="submit" class="btn-type1" @click="sendNewPassword">Đổi mật khẩu-->
<!--                  </button>-->

                  <Form v-if="showNewPass"  >
                    <fieldset>

                      <input  v-model="newPassword"  type="text" placeholder="Xác nhận mật khẩu"
                             class="input"/>

                      <input  v-model="confirmnewPassword"  type="text" placeholder="Xác nhận mật khẩu"
                            class="input"/>

                      <div class="box">
                        <button  type="button" @click="sendNewPassword" class="btn-type1">Đổi mật khẩu</button>
                      </div>
                    </fieldset>
                  </Form>


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </LayoutView>


</template>

<style scoped>
.breadcrumbs ul li a:hover {
  color: #ff6060
}
</style>