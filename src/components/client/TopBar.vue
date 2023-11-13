<script>

import axios from "axios";
import jwtDecode from 'jwt-decode';

export default {
  name: "TopBar",
  data() {
    return {
      token: null,
      user: null,
      email: null
    };
  },


  methods: {

    // Giải mã JWT token sang object User
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

    signout() {
      this.$cookies.remove('JWT_TOKEN')
      this.token = null
      this.user = null
      this.email = null
      this.$router.push("/")
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
    }
  },
  mounted() {
    // Lấy cookie JWT_TOKEN từ website
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.getUser()
  },
}
</script>

<template>
<!--  <div id="mt-header" class="style17">-->
    <div class="mt-top-bar">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-6 hidden-xs">
            <span class="tel"> <i class="fa fa-phone" aria-hidden="true"></i> +84 113 113 113</span>
            <a href="#" class="tel"> <i class="fa fa-envelope-o" aria-hidden="true"></i> giay.phake@donếtchotao</a>
          </div>
          <div class="col-xs-12 col-sm-6 text-right">
          <span v-if="!user" class="account">
            <router-link to="/signin">Đăng nhập</router-link> hoặc <router-link
              to="/signup">Đăng ký</router-link></span>
            <span v-if="user" class="account">Xin chào, {{ user.fullName }} <span> | </span> <span class="signout"
                                                                                                    @click="signout">Đăng xuất</span></span>
          </div>
        </div>
      </div>
    </div>
<!--  </div>-->

</template>

<style scoped>
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