<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios"
import {Form, Field} from "vee-validate";
import * as Yup from "yup";
import {useToast} from "vue-toastification";

export default {
  name: "SignupView",
  setup() {
    const toast = useToast();
    return {toast}
  },
  components: {LayoutView, Form, Field},
  data() {
    const schema = Yup.object().shape({
      fullName: Yup.string().required("Họ và tên không được trống."),
      email: Yup.string().required("Email không được trống.")
          .email("Sai định dạng email."),
      password: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự.."),
      confirmPassword: Yup.string().required("Mật khẩu không được trống.")
          .oneOf([Yup.ref('password'), null], 'Hai mật khẩu không giống nhau.'),

    })
    return {
      schema,
      fullName: null,
      email: null,
      password: null,
      confirmPassword: null,
    }
  },

  methods: {
    async signup() {
      const body = {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
      }
      await axios({
        method: "POST",
        url: "http://localhost:3030/api/register",
        data: body,
      }).then(res => {
        this.toast.success("Đăng ký thành công.")
        const token = res.data
        try {
          this.$cookies.set("JWT_TOKEN", `${token}`, '30min')
        } catch (err) {
          console.log(err)
        }
        this.$router.push('/')
      }).catch(err => {
        this.toast.error(err.response.data.message)
        console.log(err)
      })
    }
  }
}
</script>

<template>
  <LayoutView>
    <main id="mt-main">
      <!-- Mt About Section of the Page -->
      <section class="mt-about-sec" style="padding-bottom: 0;"></section>
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
                    <li>&ensp; Đăng ký</li>
                  </ul>
                </nav>
                <div class="mt-side-widget">
                  <header>
                    <h2 style="margin: 0 0 5px;">Đăng ký</h2>
                    <p></p>
                  </header>
                  <Form @submit="signup" style="margin: 0 0 80px;" :validation-schema="schema" v-slot="{errors}">
                    <fieldset>
                      <div class="row">
                        <div class="col-xs-12 col-sm-12">
                          <Field v-model="fullName" name="fullName" type="text" placeholder="Họ và tên của mày" class="input"/>
                          <div class="text-danger font-italic text-1 text-end">{{ errors.fullName }}</div>
                        </div>
                        <div class="col-xs-12 col-sm-12">
                          <Field v-model="email" type="text" name="email" placeholder="Email" class="input"/>
                          <div class="text-danger font-italic text-1 text-end">{{ errors.email }}</div>
                        </div>
                        <div class="col-xs-12 col-sm-12">
                          <Field v-model="password" type="password" name="password" placeholder="Mật khẩu"
                                 class="input"/>
                          <div class="text-danger font-italic text-1 text-end">{{ errors.password }}</div>
                        </div>
                        <div class="col-xs-12 col-sm-12">
                          <Field v-model="confirmPassword" type="password" name="confirmPassword"
                                 placeholder="Nhập lại mật khẩu" class="input"/>
                          <div class="text-danger font-italic text-1 text-end">{{ errors.confirmPassword }}</div>
                        </div>
                      </div>
                      <div class="box">
                        <router-link class="help" :to="{name: 'SigninView'}">
                          Đã có tài khoản?
                        </router-link>
                        <button type="submit" class="btn-type1">Đăng ký</button>
                      </div>

                    </fieldset>
                  </Form>
                  <!--                    <header>-->
                  <!--                      <h2 style="margin: 0 0 5px;">register with social</h2>-->
                  <!--                      <p>Create an account using social</p>-->
                  <!--                    </header>-->
                  <!--                    <ul class="mt-socialicons">-->
                  <!--                      <li class="mt-facebook"><a href="#"><i class="fa fa-facebook-f"></i></a></li>-->
                  <!--                      <li class="mt-twitter"><a href="#"><i class="fa fa-twitter"></i></a></li>-->
                  <!--                      <li class="mt-linkedin"><a href="#"><i class="fa fa-linkedin"></i></a></li>-->
                  <!--                      <li class="mt-dribbble"><a href="#"><i class="fa fa-dribbble"></i></a></li>-->
                  <!--                      <li class="mt-pinterest"><a href="#"><i class="fa fa-openid"></i></a></li>-->
                  <!--                      <li class="mt-youtube"><a href="#"><i class="fa fa-youtube-play"></i></a></li>-->
                  <!--                    </ul>-->
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

<style>
.breadcrumbs ul li a:hover {
  color: #ff6060
}
</style>