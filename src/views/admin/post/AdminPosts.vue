<script>

import axios from "axios";
import LayoutView from "@/components/admin/LayoutView.vue";

import {useToast} from "vue-toastification";
import moment from "moment/moment";

export default {
  name: 'AdminPosts',
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
    }
  },
  methods: {
    async getPosts() {
      this.$router.push({ query: {} })
      await axios.get(`http://localhost:3030/api/admin/posts`).then(res => {
        this.posts = res.data.content
        this.totalPages = res.data.totalPages
        this.currentPage = res.data.number + 1
        console.log('data', res.data.content)
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
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách tin tức</h2>
      </header>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-6">
            <div class="mb-3">
              <router-link style="border: 1px solid #cccc" class="btn btn-primary mx-1 text-2" to="/admin/posts/create">
                Thêm mới bài viết <i
                  class="bi bi-plus-circle-dotted"></i>
              </router-link>
            </div>
          </div>
        </div>
        <table class="table table-bordered table-striped mb-0" id="datatable-editable">
          <thead>
          <tr>
            <th style="width:8%">Tên tin tức</th>
            <th>Trạng thái</th>
            <th>Ảnh</th>
            <th>Người đăng</th>
            <th>Thời gian đăng</th>
            <th>Thời gian sửa</th>
            <th>Chức năng</th>
          </tr>
          <tr>
            <th>
              <input v-model="title" type="text" name="id" id="id" class="form-control search-input" @change="this.$router.push({query: {...this.$route.query, title: this.title}})">
            </th>
            <th>
              <select v-model="status" name="brand" class="form-control search-select" id="brand" @change="this.$router.push({query: {...this.$route.query, status: this.status}})">
                <option value="">Tất cả</option>
                <option value="0">Nháp</option>
                <option value="1">Công khai</option>
              </select>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in posts" :key="post.id" data-item-id="1">
            <td>{{ post.title }}</td>
            <td>
              <span v-if="post.status == 0 ">Nháp</span>
              <span v-if="post.status == 1 ">Công khai</span>
            </td>
            <td><img style="width: 100px" :src="post.thumbnail" alt="alt"></td>
            <td>{{post.createdBy.fullName}}</td>
            <td>{{this.formattedDate(post.publishedAt)}}</td>
            <td>{{this.formattedDate(post.modifiedAt)}}</td>
            <td>
              <button @click="deletePost(post.id)" class="btn text-4 "><i class="btn-update bi bi-trash"></i>
              </button>
              <button class="btn text-4 ">
                <router-link :to="{name: 'EditPost', params: {id: post.id}}" style="color: black">
                  <i class="btn-update bi bi-pencil-square"></i>
                </router-link>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <br>

        <nav class="mt-pagination">
          <ul v-if="totalPages" class="list-inline">
            <li v-if="currentPage != 1">
              <router-link :to="{query: {page: 1}}"><i class="bi bi-chevron-bar-left"></i>
              </router-link>
            </li>
            <li v-if="currentPage != 1">
              <router-link :to="{query: {page: currentPage - 1}}">
                <i class="bi bi-chevron-left"></i>
              </router-link>
            </li>
            <li v-for="page in totalPages" :key="page">
              <router-link v-if="page == currentPage" style="background-color: #ff6060; color: #fff"
                           :to="{query: {page: page}}">{{ page }}
              </router-link>
              <router-link v-else :to="{query: {page: page}}">{{ page }}
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {page: currentPage + 1}}">
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
            <li v-if="currentPage != totalPages">
              <router-link :to="{query: {page: totalPages}}"><i class="bi bi-chevron-bar-right"></i>
              </router-link>
            </li>

          </ul>
        </nav><!-- mt pagination end here -->
      </div>
    </section>
  </LayoutView>
</template>