<script>

import axios from "axios";
import LayoutView from "@/components/admin/LayoutView.vue";

export default {
  name: 'ListUsers',
  components: {LayoutView},
  data() {
    return {
      users: []
    }
  },
  methods: {
    async getUser() {
        await axios.get(`http://localhost:3030/api/admin/users`).then(res => {
          this.users = res.data
          console.log('data',res.data)
        }).catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<template>
  <LayoutView>
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách người dùng</h2>
      </header>
      <div class="card-body">
        <table class="table table-bordered table-striped mb-0" id="datatable-editable">
          <thead>
          <tr>
            <th style="width:8%">Họ và Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th> Địa chỉ </th>
          </tr>
          </thead>
          <tbody >
          <tr v-for="user in users" :key="user.id" data-item-id="1">
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.address }}</td>
          </tr>
          </tbody>
        </table>
        <br>
      </div>
    </section>
    </LayoutView>
</template>




