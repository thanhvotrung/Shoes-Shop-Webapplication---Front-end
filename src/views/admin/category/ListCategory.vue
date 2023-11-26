<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios"
import * as Yup from 'yup'
import {Form, Field} from "vee-validate"
import {useToast} from "vue-toastification";

export default {
  name: "ListCategory",
  components: {LayoutView, Form, Field},
  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    const schema = Yup.object().shape({
      name: Yup.string().required("Tên không được trống."),
    })
    return {
      categories: null,
      name: null,
      status: false,
      schema,

      idUpdate: null,
      categoryUpdate: null,
    }
  },

  methods: {
    async addCategory() {
      const newCategory = {
        name: this.name,
        status: this.status,
      }
      await axios.post('http://localhost:3030/api/admin/categories', newCategory).then(() => {
        this.fetchData()
        this.toast.success("Thêm danh mục thành công!")
        this.name = ' '
        this.status = false
        this.$refs.closeModal_1.click();
      }).catch((err) => {
        console.log(err)
        if (err.response.data.status === "BAD_REQUEST") {
          this.toast.warning(err.response.data.message)
        }
      })
    },
    async updateCategory() {
      const newCategory = {
        name: this.categoryUpdate.name,
        status: this.categoryUpdate.status,
      }

      await axios.put(`http://localhost:3030/api/admin/categories/${this.idUpdate}`, newCategory).then((res) => {
        this.fetchData()
        this.toast.success(res.data)
        this.$refs.closeModal_2.click();
      }).catch((err) => {
        console.log(err)
        this.toast.warning(err.response.data.message)
      })
    },
    async deleteCategory(id) {
      await axios.delete(`http://localhost:3030/api/admin/categories/${id}`).then((res) => {
        this.fetchData()
        this.toast.success(res.data)
      }).catch((err) => {
        console.log(err)
        this.toast.warning(err.response.data.message)
      })
    },


    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleString('vi-VN', options);
    },

    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/categories`).then(res => {
        this.categories = res.data.content

      }).catch(err => {
        try {
          if (err.response.status === 401) {
            console.error('Authentication failed. Need to refresh token or re-authenticate.');
          } else {
            console.error('An error occurred:', err);
          }
        } catch (e) {
          console.log(e)
          console.log(err)
        }
      })
    },
    async findCategory(id) {
      await axios.get(`http://localhost:3030/api/admin/categories/${id}`).then(res => {
        this.idUpdate = id
        this.categoryUpdate = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.fetchData()
  }
}

</script>
<template>
  <LayoutView>
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách danh mục </h2>
      </header>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-3">
              <button id="addToTable" class="btn btn-primary mx-1 text-2" data-bs-toggle="modal"
                      data-bs-target="#modal-add-new-category">Thêm mới danh mục <i
                  class="bi bi-plus-circle-dotted"></i></button>
              <button id="btn-search" class="btn btn-primary mx-1 text-2">Tìm kiếm <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        <table class="table table-bordered table-striped mb-0" id="datatable-editable">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Trạng thái danh mục</th>
            <th>Thứ tự danh mục</th>
            <th>Ngày tạo danh mục</th>
            <th>Ngày sửa danh mục</th>
            <th>Thao tác</th>
          </tr>
          <tr>
            <!-- <form method="GET" id="search-form"> -->
            <th>
              <input type="text" name="id" id="id" class="form-control search-input">
            </th>
            <th>
              <input type="text" name="name" id="name" class="form-control search-input">
            </th>
            <th>
              <select name="status" class="form-control search-select" id="status">
                <option value="">Tất cả</option>
                <option value="0">Ẩn</option>
                <option value="1">Hiển thị</option>
              </select>
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <input type="hidden" name="page" id="page">
            <!-- </form> -->
          </tr>
          </thead>
          <tbody v-if="categories">
          <tr v-for="category in categories" data-item-id="1" :key="category.id">
            <td>{{ category.id }}</td>
            <td class="category-name">{{ category.name }}</td>
            <td v-if="category.status == true">
              <div class="checkbox-wrapper-7">
                <input checked disabled class="tgl tgl-ios" id="cb2-7" type="checkbox"/>
                <label class="tgl-btn" for="cb2-7"/>
              </div>
            </td>
            <td class="text-center" v-if="category.status == false">
              <div class="checkbox-wrapper-7">
                <input disabled class="tgl tgl-ios" id="cb2-7" type="checkbox"/>
                <label class="tgl-btn" for="cb2-7"/>
              </div>
            </td>
            <td>{{ category.order }}</td>
            <td>{{ formattedDate(category.createdAt) }}</td>
            <td>{{ formattedDate(category.modifiedAt) }}</td>
            <td class="actions">
              <button @click="findCategory(category.id)" data-bs-toggle="modal"
                      data-bs-target="#modal-update-category"
                      class="btn text-4 btn-update edit-row edit-category"><i
                  class="bi bi-pencil-square"></i></button>
              <button @click="deleteCategory(category.id)" class="btn text-4 btn-delete"><i
                  class="bi bi-trash3"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <br>
        <!-- Pagination -->
        <nav aria-label="Page navigation">
          <ul class="pagination" id="pagination"></ul>
        </nav>
      </div>

      <!-- Modal add new category-->
      <div class="modal fade" id="modal-add-new-category" tabindex="-1" role="dialog"
           aria-labelledby="modalAddNewCategory" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm danh mục</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <Form :validation-schema="schema" v-slot="{errors}" @submit="addCategory" id="formCategory">
                <Field :class="{'is-invalid':errors.name}" type="text" class="form-control" v-model="name" name="name"
                       id="new_category"
                       placeholder="Nhập tên danh mục mới"/>
                <div class="text-danger font-italic text-1">{{ errors.name }}</div>
                <br>
                <label>Trạng thái</label>
                <br>
                <div class="checkbox-wrapper-7">
                  <input name="status" v-model="status" class="tgl tgl-ios" id="status-is-check" type="checkbox"/>
                  <label class="tgl-btn" for="status-is-check"/>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModal_1">Hủy
                  </button>
                  <button class="btn btn-primary">Thêm</button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal update category-->
      <div class="modal fade" id="modal-update-category" tabindex="-1" role="dialog"
           aria-labelledby="modalUpdateCategory" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa danh mục</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <Form :validation-schema="schema" v-slot="{errors}" @submit="updateCategory" v-if="categoryUpdate"
                    id="formUpdateCategory">
                <Field :class="{'is-invalid':errors.name}" v-model="categoryUpdate.name" type="text"
                       class="form-control" name="name" id="update_category"
                       placeholder="Nhập tên danh mục mới"/>
                <div class="text-danger font-italic text-1">{{ errors.name }}</div>
                <br>
                <label>Trạng thái</label>
                <br>
                <div class="checkbox-wrapper-7">
                  <input v-model="categoryUpdate.status" class="tgl tgl-ios" id="status-is-check2" type="checkbox"/>
                  <label class="tgl-btn" for="status-is-check2"/>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModal_2">Hủy
                  </button>
                  <button type="submit" class="btn btn-primary">Sửa</button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LayoutView>
</template>

<style>
.checkbox-wrapper-7 .tgl {
  display: none;
}

.checkbox-wrapper-7 .tgl,
.checkbox-wrapper-7 .tgl:after,
.checkbox-wrapper-7 .tgl:before,
.checkbox-wrapper-7 .tgl *,
.checkbox-wrapper-7 .tgl *:after,
.checkbox-wrapper-7 .tgl *:before,
.checkbox-wrapper-7 .tgl + .tgl-btn {
  box-sizing: border-box;
}

.checkbox-wrapper-7 .tgl::-moz-selection,
.checkbox-wrapper-7 .tgl:after::-moz-selection,
.checkbox-wrapper-7 .tgl:before::-moz-selection,
.checkbox-wrapper-7 .tgl *::-moz-selection,
.checkbox-wrapper-7 .tgl *:after::-moz-selection,
.checkbox-wrapper-7 .tgl *:before::-moz-selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::-moz-selection,
.checkbox-wrapper-7 .tgl::selection,
.checkbox-wrapper-7 .tgl:after::selection,
.checkbox-wrapper-7 .tgl:before::selection,
.checkbox-wrapper-7 .tgl *::selection,
.checkbox-wrapper-7 .tgl *:after::selection,
.checkbox-wrapper-7 .tgl *:before::selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::selection {
  background: none;
}

.checkbox-wrapper-7 .tgl + .tgl-btn {
  outline: 0;
  display: block;
  width: 4em;
  height: 2em;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.checkbox-wrapper-7 .tgl + .tgl-btn:after,
.checkbox-wrapper-7 .tgl + .tgl-btn:before {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;
}

.checkbox-wrapper-7 .tgl + .tgl-btn:after {
  left: 0;
}

.checkbox-wrapper-7 .tgl + .tgl-btn:before {
  display: none;
}

.checkbox-wrapper-7 .tgl:checked + .tgl-btn:after {
  left: 50%;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn {
  background: #fbfbfb;
  border-radius: 2em;
  padding: 2px;
  transition: all 0.4s ease;
  border: 1px solid #e8eae9;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn:after {
  border-radius: 2em;
  background: #fbfbfb;
  transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), padding 0.3s ease, margin 0.3s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn:hover:after {
  will-change: padding;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active {
  box-shadow: inset 0 0 0 2em #e8eae9;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active:after {
  padding-right: 0.8em;
}

.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn {
  background: #86d993;
}

.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active {
  box-shadow: none;
}

.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active:after {
  margin-left: -0.8em;
}

.actions {
  display: flex;
  border: none !important;
}

.btn-delete:hover {
  color: orangered;
}

.btn-update:hover {
  color: lightgreen;
}
</style>