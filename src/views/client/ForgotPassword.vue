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
          .email("Sai định dạng email.")
    })
    return {
      schema,
      email: null,
    }
  },

  methods: {
    generateRandomString() {
      return uuidv4().replace(/-/g, '').substring(0, 6);
    },
    async forgotPassword() {
      const randomString = this.generateRandomString()
      const details = {
        to: this.email,
        message: `Mật khẩu mới của bạn là: ${randomString}\n Xin thay đổi mật khẩu mới sau khi đăng nhập`,
        subject: "THAY ĐỔI MẬT KHẨU - PHAKESHOES"
      }
      await axios.post(`http://localhost:3030/api/sendemail`, details)
          .then(res => {
            console.log(res)
            this.toast.success("Đã gửi tin nhắn xác nhận về email.")
          }).catch(err => {
            console.log(err)
          })
      const repon = {
        email: this.email,
        new_password: randomString
      }
      await axios.post(`http://localhost:3030/api/forgot/change-password`, repon).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
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
                             :class="{ 'is-invalid': errors.email }"
                             class="input"/>
                      <div class="text-danger font-italic text-1 text-end">{{ errors.email }}</div>
                      <div class="box">
                        <button type="submit" class="btn-type1">Xác nhận</button>
                        <!--                        <span class="left"><input class="checkbox" type="checkbox" id="check1"><label for="check1">Remember Me</label></span>-->
                      </div>

                    </fieldset>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Mt Detail Section of the Page end -->
    </main>
  </LayoutView>


</template>

<style scoped>
.breadcrumbs ul li a:hover {
  color: #ff6060
}
</style>