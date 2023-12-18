<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';
import {useToast} from "vue-toastification";

import jwtDecode from "jwt-decode";

export default {
  name: "SigninView",

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
      password: Yup.string().required("Mật khẩu không được trống."),
    })

    return {
      schema,
      email: null,
      password: null,
    }
  },

  methods: {
    async login() {
      const body = {
        email: this.email,
        password: this.password
      }

      await axios({
        method: "POST",
        url: 'http://localhost:3030/api/login',
        data: body
      }).then(async res => {
        this.toast.success("Đăng nhập thành công.")
        const token = res.data

        this.decodeJwt(token)
        // this.$store.commit('setAuth', { isAuthenticated: true});
        try {
          this.$cookies.set("JWT_TOKEN", `${token}`)
        } catch (err) {
          console.log(err)
        }
        this.$router.back()
      }).catch(err => {
        this.toast.error(err.response.data.message)
        console.log(err)
      })

    },
    // Giải mã JWT token sang object User
    decodeJwt(token) {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          let emailToken = decodedToken.sub;
          this.getUser(emailToken)
        } catch (error) {
          console.error('JWT Decoding Error:', error);
        }
      }
    },

    async getUser(emailToken) {
      if (emailToken) {
        await axios.get(`http://localhost:3030/user/${emailToken}`).then(res => {
          let user = res.data
          let roles = res.data.roles
          let role = roles.includes("ADMIN") ? "ADMIN" : "USER";
          // this.$store.commit('setAuth', { isAuthenticated: true, name: user.fullName});
          this.$store.dispatch('login', { username: user.fullName, role: role });
        }).catch(err => {
          console.log(err)
        })
      }
    },

  }
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
                    <li>&ensp; Đăng nhập</li>
                  </ul>
                </nav>
                <div class="mt-side-widget">

                  <header>
                    <h2 style="margin: 0 0 5px;">ĐĂNG NHẬP</h2>
                  </header>
                  <Form @submit="login" :validation-schema="schema" v-slot="{ errors }">
                    <fieldset>
                      <Field v-model="email" name="email" type="text" placeholder="Email"
                             :class="{ 'is-invalid': errors.email }"
                             class="input"/>
                      <div class="text-danger font-italic text-1 text-end">{{ errors.email }}</div>
                      <Field v-model="password" name="password" type="password" placeholder="Mật khẩu" class="input"
                             :class="{ 'is-invalid': errors.email }"/>
                      <div class="text-danger font-italic text-1 text-end">{{ errors.password }}</div>
                      <div class="box">
                        <button type="submit" class="btn-type1">Đăng nhập</button>
                        <!--                        <span class="left"><input class="checkbox" type="checkbox" id="check1"><label for="check1">Remember Me</label></span>-->
                          <router-link class="help" :to="{name: 'SignupView'}">
                            Chưa có tài khoản?
                          </router-link>
                        <span class="help">&ensp;</span>
                          <router-link class="help" :to="{name: 'ForgotPassword'}">
                            Quên mật khẩu
                          </router-link>
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