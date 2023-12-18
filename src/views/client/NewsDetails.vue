<script>
import LayoutView from "@/components/client/LayoutView.vue";
import axios from "axios";
import moment from "moment/moment";

export default {
  name: "NewsDetails",
  components: {LayoutView},

  watch: {
    "$route.params"() {
      this.id = this.$route.params.id;
      this.slug = this.$route.params.slug;
      this.fetchData()
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  },


  data() {
    return {

      totalPages: null,
      currentPage: null,

      id: null,
      slug: null,
      posts: null,

      title: null,
      thumbnail: null,
      status: null,

    }
  },
  methods: {
    slideTo(val) {
      this.currentSlide = val
    },

    async fetchData() {
      let temp;
      await axios.get(`http://localhost:3030/api/news/${this.slug}/${this.id}`).then(res => {
        const post = res.data
        this.posts = post
        document.title = post.name
        temp = post.description


      }).catch(err => {
        console.log(err)
      })
      this.$refs.utextDesc.innerHTML = temp
    },


    formattedDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    },
  },

  mounted() {
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.id = this.$route.params.id;
    this.slug = this.$route.params.slug;
    this.fetchData();
  }
}
</script>
<template>
  <LayoutView>
    <section v-if="posts" class="mt-contact-banner wow fadeInUp" data-wow-delay="0.4s"
             style="background-color:rgb(25, 24, 24); display: flex">
      <div class="container">
        <h1 style=" text-align: center; color:aliceblue">{{ posts.title }} </h1>
      </div>
    </section>
    <div class="mt-blog-detail fullwidth wow fadeInUp" data-wow-delay="0.4s">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <article v-if="posts" class="blog-post style3">
              <div class="img-holder">
                <a><img style=" height: 600px" :src="posts.thumbnail" alt="alt"></a>
                <ul class="list-unstyled comment-nav">
                  <li><a href="#"><i class="fa fa-comments"></i>12</a></li>
                  <li><a href="#"><i class="fa fa-share-alt"></i>14</a></li>
                </ul>
              </div>
              <div class="blog-txt mx-left" style="max-width: 1025px;">
                <h2><a href=""></a>{{posts.title}}</h2>
                <ul class="list-unstyled blog-nav">
                  <li><a href="#"><i class="fa fa-clock-o"></i>{{ this.formattedDate(posts.publishedAt) }}</a></li>
                  <li><a href="#"><i class="fa fa-list"></i>{{ posts.createdBy.fullName }}</a></li>
                </ul>
                <div class="product-detailwow " data-wow-delay="0.4s">

                    <div ref="utextDesc"></div>

                </div>
              </div>
            </article>


          </div>
        </div>
      </div>
    </div>


  </LayoutView>
</template>
<style scoped>


</style>
