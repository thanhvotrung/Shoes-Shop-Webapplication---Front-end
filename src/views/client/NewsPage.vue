<script>
import LayoutView from "@/components/client/LayoutView.vue";
import {useToast} from "vue-toastification";
import axios from "axios";
import moment from 'moment';

export default {
  name: "NewsPage",
  components: {LayoutView},

  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        console.log('Query parameters changed:', newQuery);
        this.handleQueryChange(newQuery);
      }
    },
  },


  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    return {
      posts: [],
      totalPages: null,
      currentPage: null,

      title: null,
      status: null,

      id: null,
      slug: null,

    }
  },
  methods: {
    async getPosts() {
      this.$router.push({query: {}})
      await axios.get(`http://localhost:3030/api/admin/posts`).then(res => {
        this.posts = res.data.content
        res.data.content.map((
            item => {
              console.log("ITEM:", item)
            }
        ))
        this.currentPage = res.data.number + 1
        console.log('data ', res.data.content)
      }).catch(err => {
        console.log(err)
      })
    },

    async deletePost(id) {

      await axios.delete(`http://localhost:3030/api/admin/posts/${id}`)
          .then(res => {
            this.toast.success(res.data)
            this.getPosts()
            console.log(res)
          }).catch(err => {
            console.log(err)
            this.toast.warning(err.response.data.message)
          })
    },
    async handleQueryChange(query) {
      console.log(query)
      await axios.get(`http://localhost:3030/api/admin/posts`, {params: query}).then(res => {
        const response = res.data
        this.posts = response.content
        this.totalPages = response.totalPages
        this.currentPage = response.number + 1
      }).catch(err => {
        console.log(err)
      })
    },

    formattedDate(date) {
      const formatted = moment(date).format('DD/MM/YYYY HH:mm:ss');
      return formatted;
    },
  },

  mounted() {
    this.getPosts()
  }
}
</script>
<template>
  <LayoutView>
    <section class="mt-contact-banner wow fadeInUp" data-wow-delay="0.4s"
             style="background-color:rgb(25, 24, 24);height: 400px;">
      <div class="container">

        <h1 style=" font-size: 100px; text-align: center; color:aliceblue">PHAKE, INC.</h1>
        <br>
        <h1 style=" text-align: center; color:aliceblue ">BLOGS ROOM</h1>
      </div>
    </section>
    <div class="mt-blog-detail fullwidth">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 header wow fadeInUp" data-wow-delay="0.4s">
            <nav class="breadcrumbs">
            </nav>
            <ul class="list-unstyled align-right">
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 wow fadeInUp" data-wow-delay="0.4s">

            <div v-for="post in posts" :key="post.id">
              <article class="blog-post detail">
                <div class="img-holder">
                  <a><img style=" height: 600px" :src="post.thumbnail" alt="alt"></a>
                  <ul class="list-unstyled comment-nav">
                    <li><a href="#"><i class="fa fa-comments"></i>12</a></li>
                    <li><a href="#"><i class="fa fa-share-alt"></i>14</a></li>
                  </ul>
                </div>
                <div class="blog-txt">
                  <h2>
                    <li>
                      <router-link
                          :to="{name: 'NewsDetails', params: {slug: post.slug, id: post.id}}">
                        {{
                          post.title
                        }}
                      </router-link>
                    </li>
                  </h2>
                  <ul class="list-unstyled blog-nav">
                    <li><a href="#"><i class="fa fa-clock-o"></i>{{this.formattedDate(post.publishedAt)}}</a></li>
                    <li><a href="#"><i class="fa fa-list"></i>{{post.createdBy.fullName}}</a></li>

                  </ul>
                  <a href="blog-post-detail-sidebar.html" class="btn-more">Read More</a>
                </div>
              </article>
            </div>

          </div>
        </div>

        <nav class="mt-pagination">
          <ul v-if="totalPages" class="list-inline">
            <li class="mb-2" v-if="currentPage != 1">
              <router-link :to="{query: {...this.$route.query, page: 1}}"><i class="bi bi-chevron-bar-left"></i>
              </router-link>
            </li>
            <li class="mb-2" v-if="currentPage != 1">
              <router-link :to="{query: {...this.$route.query, page: currentPage - 1}}">
                <i class="bi bi-chevron-left"></i>
              </router-link>
            </li>
            <li class="mb-2" v-for="page in totalPages" :key="page">
              <router-link v-if="page == currentPage" style="background-color: #ff6060; color: #fff"
                           :to="{query: {...this.$route.query, page: page}}">{{ page }}
              </router-link>
              <router-link v-else :to="{query: {...this.$route.query, page: page}}">{{ page }}
              </router-link>
            </li>
            <li class="mb-2" v-if="currentPage != totalPages">
              <router-link :to="{query: {...this.$route.query, page: currentPage + 1}}">
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
            <li class="mb-2" v-if="currentPage != totalPages">
              <router-link :to="{query: {...this.$route.query, page: totalPages}}"><i
                  class="bi bi-chevron-bar-right"></i>
              </router-link>
            </li>

          </ul>
        </nav><!-- mt pagination end here -->
      </div>
    </div>

  </LayoutView>
</template>
<style scoped>


</style>
