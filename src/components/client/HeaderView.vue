<script>
import axios from "axios";
import {Field, Form} from 'vee-validate';
import * as Yup from 'yup';
import {useToast} from "vue-toastification";
import jwtDecode from "jwt-decode";

export default {
  name: "HeaderView",
  components: {Form, Field},
  props: ['countCartItem'],
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    const schemaLogin = Yup.object().shape({
      email: Yup.string().required("Email khônng được trống.")
          .email("Sai định dạng email."),
      password: Yup.string().required("Mật khẩu không được trống."),
    })
    const schemaSignup = Yup.object().shape({
      fullName: Yup.string().required("Họ và tên không được trống."),
      emailSignup: Yup.string().required("Email không được trống.")
          .email("Sai định dạng email."),
      passwordSignup: Yup.string().required("Mật khẩu không được trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
          .max(50, "Mật khẩu tối đa 50 ký tự.."),
      confirmPassword: Yup.string().required("Mật khẩu không được trống.")
          .oneOf([Yup.ref('passwordSignup'), null], 'Hai mật khẩu không giống nhau.'),

    })
    return {
      schemaLogin,
      schemaSignup,
      emailToken: null,
      token: null,
      user: null,

      email: null,
      password: null,

      fullName: null,
      emailSignup: null,
      passwordSignup: null,
      confirmPassword: null,

      banner: "https://images.pexels.com/photos/4225393/pexels-photo-4225393.jpeg?auto=compress&cs=tinysrgb&w=600",
      keyword: null,
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
        try {
          this.$cookies.set("JWT_TOKEN", `${token}`, '30min')
        } catch (err) {
          console.log(err)
        }

        this.$refs.closeSidebar.click()
      }).catch(err => {
        this.toast.error(err.response.data.message)
        console.log(err)
      })
    },

    async signup() {
      const body = {
        fullName: this.fullName,
        email: this.emailSignup,
        password: this.passwordSignup,
      }
      await axios({
        method: "POST",
        url: "http://localhost:3030/api/register",
        data: body,
      }).then(res => {
        this.toast.success("Đăng ký thành công.")
        const token = res.data

        this.decodeJwt(token)
        try {
          this.$cookies.set("JWT_TOKEN", `${token}`)
        } catch (err) {
          console.log(err)
        }

        this.$refs.closeSidebar.click()
      }).catch(err => {
        this.toast.error(err.response.data.message)
        console.log(err)
      })
    },

    handleSearch() {
      this.$router.push({name: "SearchProducts", query: {keyword: this.keyword}})
      console.log(this.keyword)
      this.$refs.closeSearch.click()
    },

    // Giải mã JWT token sang object User

    decodeJwt(token) {
      // JWT token to be decoded
      if (token) {
        try {
          // Decode the JWT
          const decodedToken = jwtDecode(token);
          let email = decodedToken.sub;
          this.getUser(email)
        } catch (error) {

          console.error('JWT Decoding Error:', error);
        }
      }
    },


    async getUser(email) {
      if (email) {
        await axios.get(`http://localhost:3030/user/${email}`).then(res => {
          const user = res.data
          let roles = res.data.roles
          let role = roles.includes("ADMIN") ? "ADMIN" : "USER";
          this.$store.dispatch('login', { username: user.fullName, role: role });
          // this.$store.commit('setAuth', { isAuthenticated: true, name: user.fullName});

        }).catch(err => {
          console.log(err)
        })
      }
    },


    signout() {
      // this.$store.commit('setAuth', { isAuthenticated: false, name: null});
      this.$store.dispatch('logout');
      this.$cookies.remove('JWT_TOKEN')
      localStorage.removeItem('AUTH');
      this.$router.push('/signin');
    },



  },
  mounted() {
  }
}
</script>

<template>
  <div class="mt-top-bar">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-6 hidden-xs">
          <span class="tel"> <i class="fa fa-phone" aria-hidden="true"></i> +84 113 113 113</span>
          <a href="#" class="tel"> <i class="fa fa-envelope-o" aria-hidden="true"></i> giay.phake@donếtchotao</a>
        </div>
        <div class="col-xs-12 col-sm-6 text-right">

          <span v-if="!this.$store.state.isAuthenticated" class="account">
            <router-link to="/signin">Đăng nhập</router-link> hoặc <router-link
              to="/signup">Đăng ký</router-link></span>
          <span v-if="this.$store.state.isAuthenticated" class="account">Xin chào, <router-link to="/account">{{
              this.$store.state.user.username

            }}</router-link> <span> | </span> <span class="signout"
                                                    @click="signout">Đăng xuất</span></span>
        </div>
      </div>
    </div>
  </div>
  <header id="mt-header" class="style17">
    <!-- mt bottom bar start here -->
    <div class="mt-bottom-bar">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <!-- mt logo start here -->
            <div class="mt-logo">
              <router-link to="/"><img style="height: 50px"
                                       src="@/assets/logo.png"
                                       alt="Logo sóp"></router-link>
            </div>
            <!-- mt icon list start here -->
            <ul class="mt-icon-list">
              <li class="hidden-lg hidden-md">
                <a href="#" class="bar-opener mobile-toggle">
                  <span class="bar"></span>
                  <span class="bar small"></span>
                  <span class="bar"></span>
                </a>
              </li>
              <li><a href="#" class="icon-magnifier"></a></li>
              <li class="">
                <a href="#" class="icon-heart cart-opener"><span style="margin-bottom: -3px;" class="num">3</span></a>
              </li>
              <li class="">
                <router-link to="/cart" class="cart-opener">
                  <span class="icon-handbag"></span>
                                    <span class="num">{{countCartItem}}</span>
                </router-link>
              </li>


              <li v-if="this.$store.state.isAuthenticated">
                <router-link to="/account" class=""><i class="bi bi-person text-4"></i>
                </router-link>
              </li>
              <li v-else>
                <a href="#" class="side-opener"><i class="bi bi-person text-4"></i>
                </a>
              </li>
            </ul><!-- mt icon list end here -->
            <!-- navigation start here -->
            <nav id="nav">
              <ul>
                <li>
                  <router-link :to="{name: 'HomePage'}">TRANG CHỦ</router-link>
                </li>
                <li>
                  <router-link to="/products">SẢN PHẨM</router-link>
                </li>
                <li><a href="#">TIN TỨC</a></li>
                <li><a href="#">CHÍNH SÁCH</a></li>
                <li>
                  <a class="drop-link" href="contact-us.html">LIÊN HỆ<i class="fa fa-angle-down hidden-lg hidden-md"
                                                                        aria-hidden="true"></i></a>
                  <div class="s-drop">
                    <ul>
                      <li><a href="contact-us.html">Contact</a></li>
                      <li><a href="contact-us2.html">Contact 2</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
            <!-- mt icon list end here -->
          </div>
        </div>
      </div>
    </div>
    <!-- mt bottom bar end here -->
    <span class="mt-side-over"></span>
  </header><!-- mt header style4 end here -->
  <!-- mt side menu start here -->
  <div class="mt-side-menu">
    <!-- mt holder start here -->
    <div class="mt-holder">
      <a href="#" ref="closeSidebar" class="side-close"><span></span><span></span></a>
      <!--      <strong class="mt-side-title">MY ACCOUNT</strong>-->
      <!-- mt side widget start here -->
      <div class="mt-side-widget">
        <header>
          <span class="mt-side-subtitle">Đăng nhập</span>
          <!--          <p>Welcome back! Sign in to Your Account</p>-->
        </header>
        <Form @submit="login" :validation-schema="schemaLogin" v-slot="{ errors }">
          <fieldset>
            <Field v-model="email" name="email" type="text" placeholder="Email"
                   :class="{ 'is-invalid': errors.email}"
                   class="input"/>
            <div class="text-danger font-italic text-1 text-end">{{ errors.email }}</div>
            <Field v-model="password" name="password" type="password" placeholder="Mật khẩu" class="input"
                   :class="{ 'is-invalid': errors.email }"/>
            <div class="text-danger font-italic text-1 text-end">{{ errors.password }}</div>
            <div class="box">
              <button type="submit" class="btn-type1">Đăng nhập</button>
            </div>

          </fieldset>
        </Form>
      </div>
      <!-- mt side widget end here -->
      <div class="or-divider"><span class="txt"></span></div>
      <!-- mt side widget start here -->
      <div class="mt-side-widget">
        <header>
          <span class="mt-side-subtitle">Đăng ký</span>
          <!--          <p>Create your very own account</p>-->
        </header>
        <Form @submit="signup" style="margin: 0 0 80px;" :validation-schema="schemaSignup" v-slot="{errors}">
          <fieldset>
            <div class="row">
              <div class="col-xs-12 col-sm-12">
                <Field v-model="fullName" name="fullName" type="text" placeholder="Họ và tên của mày" class="input"/>
                <div class="text-danger font-italic text-1 text-end">{{ errors.fullName }}</div>
              </div>
              <div class="col-xs-12 col-sm-12">
                <Field v-model="emailSignup" type="text" name="emailSignup" placeholder="Email" class="input"/>
                <div class="text-danger font-italic text-1 text-end">{{ errors.emailSignup }}</div>
              </div>
              <div class="col-xs-12 col-sm-12">
                <Field v-model="passwordSignup" type="password" name="passwordSignup" placeholder="Mật khẩu"
                       class="input"/>
                <div class="text-danger font-italic text-1 text-end">{{ errors.passwordSignup }}</div>
              </div>
              <div class="col-xs-12 col-sm-12">
                <Field v-model="confirmPassword" type="password" name="confirmPassword"
                       placeholder="Nhập lại mật khẩu" class="input"/>
                <div class="text-danger font-italic text-1 text-end">{{ errors.confirmPassword }}</div>
              </div>
            </div>
            <div class="box">
              <button type="submit" class="btn-type1">Đăng ký</button>
            </div>

          </fieldset>
        </Form>
      </div>
      <!-- mt side widget end here -->
    </div>
    <!-- mt holder end here -->
  </div><!-- mt side menu end here -->
  <!-- mt search popup start here -->
  <div class="mt-search-popup">
    <div class="mt-holder">
      <a ref="closeSearch" href="#" class="search-close"><span></span><span></span></a>
      <div class="mt-frame">
        <Form @submit="handleSearch">
          <fieldset class="d-flex">
            <input v-model="keyword" type="text" placeholder="Tìm kiếm...">
            <button class="btn text-5" type="submit"><i class="bi bi-search"></i></button>

          </fieldset>
        </Form>
      </div>
    </div>
  </div><!-- mt search popup end here -->
</template>

<style>
#mt-header.style17 .mt-bottom-bar {
  padding: 10px 0 10px;
}

.account, .account a {
  color: #a1a1a1;
}

.account a:hover {
  color: #ff6060;
}

.signout {
  cursor: pointer;
}

.signout:hover {
  color: #ff6060;

}

#mt-header.style17 {
  color: #a1a1a1;
}

.mt-top-bar {
  padding: 10px 0;
  background: #f2f2f2;
}

.mt-top-bar .tel {
  color: #a1a1a1;
  margin: 0 46px 0 0;
  font-family: "Source Sans Pro", sans-serif;
}

.mt-top-bar .tel:hover {
  color: #ff6060;
}

.mt-top-bar .tel .fa {
  font-size: 12px;
  margin: 0 3px 0 0;
}
</style>