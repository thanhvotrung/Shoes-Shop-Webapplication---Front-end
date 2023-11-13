<script>
import TopBar from "@/components/client/TopBar.vue";
// import axios from "axios";
import {Form} from 'vee-validate';

export default {
  name: "HeaderView",
  components: {TopBar, Form},
  props: ["cartList"],
  data() {
    return {
    banner: "https://images.pexels.com/photos/4225393/pexels-photo-4225393.jpeg?auto=compress&cs=tinysrgb&w=600",
    // banner: "https://images.pexels.com/photos/5785308/pexels-photo-5785308.jpeg?auto=compress&cs=tinysrgb&w=600",
      keyword: null,
    }
  },

  methods: {
     handleSearch() {
      this.$router.push({name: "SearchProducts", query: {keyword: this.keyword}})
       console.log(this.keyword)
       this.$refs.closeSearch.click()
    },
  },
  mounted() {
    // console.log(this.cartList)
  }
}
</script>

<template>
    <TopBar/>
  <header id="mt-header" class="style17">
    <!-- mt bottom bar start here -->
    <div class="mt-bottom-bar">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <!-- mt logo start here -->
            <div class="mt-logo"><router-link to="/"><img style="height: 50px" src="https://cdn.printgo.vn/uploads/media/772948/thiet-ke-logo-shop-giay-19_1584095087.jpg" alt="Logo sóp"></router-link></div>
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
              <li class="drop">
                <a href="#" class="icon-heart cart-opener"><span style="margin-bottom: -3px;" class="num">3</span></a>
                <!-- mt drop start here -->
                <div class="mt-drop">
                  <!-- mt drop sub start here -->
                  <div class="mt-drop-sub">
                    <!-- mt side widget start here -->
                    <div class="mt-side-widget">
                      <!-- cart row start here -->
                      <div class="cart-row">
                        <a href="#" class="img"><img src="http://placehold.it/75x75" alt="image" class="img-responsive"></a>
                        <div class="mt-h">
                          <span class="mt-h-title"><a href="#">Marvelous Modern 3 Seater</a></span>
                          <span class="price"><i class="fa fa-eur" aria-hidden="true"></i> 599,00</span>
                        </div>
                        <a href="#" class="close fa fa-times"></a>
                      </div><!-- cart row end here -->
                      <!-- cart row start here -->
                      <div class="cart-row">
                        <a href="#" class="img"><img src="http://placehold.it/75x75" alt="image" class="img-responsive"></a>
                        <div class="mt-h">
                          <span class="mt-h-title"><a href="#">Marvelous Modern 3 Seater</a></span>
                          <span class="price"><i class="fa fa-eur" aria-hidden="true"></i> 599,00</span>
                        </div>
                        <a href="#" class="close fa fa-times"></a>
                      </div><!-- cart row end here -->
                      <!-- cart row start here -->
                      <div class="cart-row">
                        <a href="#" class="img"><img src="http://placehold.it/75x75" alt="image" class="img-responsive"></a>
                        <div class="mt-h">
                          <span class="mt-h-title"><a href="#">Marvelous Modern 3 Seater</a></span>
                          <span class="price"><i class="fa fa-eur" aria-hidden="true"></i> 599,00</span>
                        </div>
                        <a href="#" class="close fa fa-times"></a>
                      </div><!-- cart row end here -->
                      <!-- cart row total start here -->
                      <div class="cart-row-total">
                        <span class="mt-total">Add them all</span>
                        <span class="mt-total-txt"><a href="#" class="btn-type2">add to CART</a></span>
                      </div>
                      <!-- cart row total end here -->
                    </div><!-- mt side widget end here -->
                  </div>
                  <!-- mt drop sub end here -->
                </div><!-- mt drop end here -->
                <span class="mt-mdropover"></span>
              </li>
              <li class="">
                <router-link to="/cart" class="cart-opener">
                  <span class="icon-handbag"></span>
<!--                  <span class="num">{{this.cartList.length}}</span>-->
                </router-link>
                <!-- mt drop start here -->
<!--                <div class="mt-drop">-->
<!--                  &lt;!&ndash; mt drop sub start here &ndash;&gt;-->
<!--                  <div class="mt-drop-sub">-->
<!--                    &lt;!&ndash; mt side widget start here &ndash;&gt;-->
<!--                    <div class="mt-side-widget">-->
<!--                      &lt;!&ndash; cart row start here &ndash;&gt;-->
<!--                      <div v-for="(item, index) in this.cartList" :key="index" class="cart-row">-->
<!--                        <a href="#" class="img"><img src="http://placehold.it/75x75" alt="image" class="img-responsive"></a>-->
<!--                        <div class="mt-h">-->
<!--                          <span class="mt-h-title"><a href="#">{{ item.product_id }}</a></span>-->
<!--                          <span class="price"><i class="fa fa-eur" aria-hidden="true"></i> 599,00</span>-->
<!--                          <span class="mt-h-title">Số lượng: {{item.quantity}}</span>-->
<!--                        </div>-->
<!--                        <a href="#" class="close fa fa-times"></a>-->
<!--                      </div>-->
<!--                      &lt;!&ndash; cart row end here &ndash;&gt;-->
<!--                      <div class="cart-row-total">-->
<!--                        <span class="mt-total">Sub Total</span>-->
<!--                        <span class="mt-total-txt"><i class="fa fa-eur" aria-hidden="true"></i> 799,00</span>-->
<!--                      </div>-->
<!--                      &lt;!&ndash; cart row total end here &ndash;&gt;-->
<!--                      <div class="cart-btn-row">-->
<!--                        <a href="#" class="btn-type2">VIEW CART</a>-->
<!--                        <a href="#" class="btn-type3">CHECKOUT</a>-->
<!--                      </div>-->
<!--                    </div>&lt;!&ndash; mt side widget end here &ndash;&gt;-->
<!--                  </div>-->
<!--                  &lt;!&ndash; mt drop sub end here &ndash;&gt;-->
<!--                </div>-->
                <!-- mt drop end here -->
<!--                <span class="mt-mdropover"></span>-->
              </li>
              <li>
                <a href="#" class="bar-opener side-opener">
                  <span class="bar"></span>
                  <span class="bar small"></span>
                  <span class="bar"></span>
                </a>
              </li>
            </ul><!-- mt icon list end here -->
            <!-- navigation start here -->
            <nav id="nav">
              <ul>
                <li>
                  <router-link :to="{name: 'HomePage'}">TRANG CHỦ</router-link>
                </li>
                <li class="drop">
                  <router-link to="/products">SẢN PHẨM <i class="fa fa-angle-down" aria-hidden="true"></i></router-link>
                  <!-- mt dropmenu start here -->
                  <div class="mt-dropmenu text-left">
                    <!-- mt frame start here -->
                    <div class="mt-frame">
                      <!-- mt f box start here -->
                      <div class="mt-f-box">
                        <!-- mt col3 start here -->
                        <div class="mt-col-3">
                          <div class="sub-dropcont">
                            <strong class="title"><a href="product-grid-view.html"
                                                     class="mt-subopener">PRODUCTS</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li><a href="product-grid-view.html">Product Grid View</a></li>
                                <li><a href="product-list-view.html">Product List View</a></li>
                                <li><a href="product-detail.html">Product Detail</a></li>
                              </ul>
                            </div>
                          </div>
                          <div class="sub-dropcont">
                            <strong class="title"><a href="#" class="mt-subopener">404 Pages</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li><a href="404-page.html">404 Page</a></li>
                                <li><a href="404-page2.html">404 Page2</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <!-- mt col3 end here -->

                        <!-- mt col3 start here -->
                        <div class="mt-col-3">
                          <div class="sub-dropcont">
                            <strong class="title"><a href="#" class="mt-subopener">About US</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li><a href="about-us.html">About</a></li>
                              </ul>
                            </div>
                          </div>
                          <div class="sub-dropcont">
                            <strong class="title"><a href="#" class="mt-subopener">Contact US</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li>
                                  <router-link to="/signin">Contact</router-link>
                                </li>
                                <li>
                                  <router-link to="/signup">Contact 2</router-link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div class="sub-dropcont">
                            <strong class="title"><a href="#" class="mt-subopener">Coming Soon</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li><a href="coming-soon.html">Coming Soon</a></li>
                                <li><a href="coming-soon2.html">Coming Soon2</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <!-- mt col3 end here -->

                        <!-- mt col3 start here -->
                        <div class="mt-col-3">
                          <div class="sub-dropcont">
                            <strong class="title"><a href="#" class="mt-subopener">KITCHEN FURNITURE</a></strong>
                            <div class="sub-drop">
                              <ul>
                                <li><a href="#">Kitchen Taps</a></li>
                                <li><a href="#">Breakfast time</a></li>
                                <li><a href="#">Cooking</a></li>
                                <li><a href="#">Food Storage Boxes</a></li>
                                <li><a href="#">Spice Jars</a></li>
                                <li><a href="#">Napskins</a></li>
                                <li><a href="#">Oven Gloves</a></li>
                                <li><a href="#">Placemats</a></li>
                                <li><a href="#">Cooking</a></li>
                                <li><a href="#">Food Storage Boxes</a></li>
                                <li><a href="#">Spice Jars</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <!-- mt col3 end here -->

                        <!-- mt col3 start here -->
                        <div class="mt-col-3 promo">
                          <div class="mt-promobox">
                            <a href="#"><img style="" :src="banner" alt="promo banner"
                                             class="img-responsive"></a>
                          </div>
                        </div>
                        <!-- mt col3 end here -->
                      </div>
                      <!-- mt f box end here -->
                    </div>
                    <!-- mt frame end here -->
                  </div>
                  <!-- mt dropmenu end here -->
                  <span class="mt-mdropover"></span>
                </li>
                <li><a href="about-us.html">TIN TỨC</a></li>
                <li><a href="about-us.html">CHÍNH SÁCH</a></li>
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
      <a href="#" class="side-close"><span></span><span></span></a>
      <strong class="mt-side-title">MY ACCOUNT</strong>
      <!-- mt side widget start here -->
      <div class="mt-side-widget">
        <header>
          <span class="mt-side-subtitle">SIGN IN</span>
          <p>Welcome back! Sign in to Your Account</p>
        </header>
        <form action="#">
          <fieldset>
            <input type="text" placeholder="Username or email address" class="input">
            <input type="password" placeholder="Password" class="input">
            <div class="box">
              <span class="left"><input class="checkbox" type="checkbox" id="check1"><label
                  for="check1">Remember Me</label></span>
              <a href="#" class="help">Help?</a>
            </div>
            <button type="submit" class="btn-type1">Login</button>
          </fieldset>
        </form>
      </div>
      <!-- mt side widget end here -->
      <div class="or-divider"><span class="txt">or</span></div>
      <!-- mt side widget start here -->
      <div class="mt-side-widget">
        <header>
          <span class="mt-side-subtitle">CREATE NEW ACCOUNT</span>
          <p>Create your very own account</p>
        </header>
        <form action="#">
          <fieldset>
            <input type="text" placeholder="Username or email address" class="input">
            <button type="submit" class="btn-type1">Register</button>
          </fieldset>
        </form>
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
            <button  class="btn text-5" type="submit"><i class="bi bi-search"></i></button>

          </fieldset>
        </Form>
      </div>
    </div>
  </div><!-- mt search popup end here -->
</template>

<style >
#mt-header.style17 .mt-bottom-bar {
  padding: 10px 0 10px;
}
</style>