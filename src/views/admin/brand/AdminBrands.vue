<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import axios from "axios"
import * as Yup from 'yup'
import {Form, Field} from "vee-validate"
import {useToast} from "vue-toastification";
import FirebaseConfig from "@/utils/FirebaseConfig";

export default {
  name: "AdminBrands",
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
      brands: null,
      name: null,
      status: false,
      logo: '',
      schema,

      idUpdate: null,
      brandUpdate: null,
      logoUpdate: null
    }
  },

  methods: {
    async addBrand() {
      const newBrand = {
        name: this.name,
        thumbnail: this.logo[0],
        status: this.status,

      }
      console.log(newBrand)

      await axios.post('http://localhost:3030/api/admin/brands', newBrand).then((res) => {
        console.log(res)
        this.fetchData()
        this.toast.success("Thêm nhãn hiệu thành công!")
        this.name = ' '
        this.logo = null
        this.status = false
        this.$refs.closeModal_1.click();
      }).catch((err) => {
        console.log(err)
        this.toast.warning(err.response.data.message)
      })
    },
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/brands`).then(res => {
        this.brands = res.data.content
      }).catch(err => {
        console.log(err)
      })
    },

    formattedDate(timestamp) {
      const date = new Date(timestamp);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleString('vi-VN', options);
    },
    async onFileSelected(event) {
      let formData = new FormData()
      const files = event.target.files;
      if (files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.split("/")[0] !== "image") {
          console.log(files[i].type + ' does not image type.');
          continue;
        }
        formData.append('files', event.target.files[i])
      }
      await axios.post("http://localhost:3030/api/image/upload", formData).then(res => {
        this.logo = res.data
      }).catch(err => console.log(err))
    },

    async onFileSelectedUpdate(event) {
      let formData = new FormData()
      const files = event.target.files;
      if (files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.split("/")[0] !== "image") {
          console.log(files[i].type + ' does not image type.');
          continue;
        }
        formData.append('files', event.target.files[i])
      }
      await axios.post("http://localhost:3030/api/image/upload", formData).then(res => {
        this.logoUpdate = res.data[0]
      }).catch(err => console.log(err))
    },
    deleteImage(index) {
      this.logo.splice(index, 1)
    },
    selectFiles() {
      this.$refs.fileInput.click();
    },
    async findBrand(id) {
      await axios.get(`http://localhost:3030/api/admin/brands/${id}`).then(res => {
        this.idUpdate = id
        this.brandUpdate = res.data
        this.logoUpdate = res.data.thumbnail
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })

    },
    async updateBrand() {
      const newBrand = {
        name: this.brandUpdate.name,
        status: this.brandUpdate.status,
        thumbnail: this.logoUpdate,
      }
      console.log(newBrand)
      await axios.put(`http://localhost:3030/api/admin/brands/${this.idUpdate}`, newBrand).then((res) => {
        this.fetchData()
        this.toast.success(res.data)
        this.$refs.closeModal_2.click();
      }).catch((err) => {
        console.log(err)
        this.toast.warning(err.response.data.message)
      })
    },

    async deleteBrand(id) {
        await this.findBrand(id)
        FirebaseConfig.DeleteImage(this.logoUpdate)
      await axios.delete(`http://localhost:3030/api/admin/brands/${id}`).then((res) => {
        console.log(res)
        this.fetchData()
        this.toast.success("Xóa danh mục thành công!")
      }).catch((err) => {
        console.log(err)
        this.toast.warning(err.response.data.message)
      })
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<template>
  <LayoutView>

    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Danh sách nhãn hiệu </h2>
      </header>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-3">
              <button id="addToTable" class="btn btn-primary mx-1 text-2" data-bs-toggle="modal"
                      data-bs-target="#modal-add-new-brand">Thêm mới nhãn hiệu <i
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
            <th>Tên nhãn hiệu</th>
            <th>Ảnh nhãn hiệu</th>
            <th>Trạng thái nhãn hiệu</th>
            <th>Ngày tạo danh mục</th>
            <th>Ngày sửa danh mục</th>
            <th>Thao tác</th>
          </tr>
          <tr>
            <th>
              <input type="text" name="id" id="id" class="form-control search-input">
            </th>
            <th>
              <input type="text" name="name" id="name" class="form-control search-input">
            </th>
            <th></th>
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
            <input type="hidden" name="page" id="page">
          </tr>
          </thead>
          <tbody v-if="brands">
          <tr :key="brand.id" v-for="brand in brands" data-item-id="1">
            <td>{{ brand.id }}</td>
            <td class="brand-name">{{ brand.name }}</td>
            <td>
              <div class="logo-div">
                <img style="width:150px; height:auto;" :src="brand.thumbnail" :alt="brand.name"
                     class="brand-thumbnail"/>
              </div>
            </td>
            <td v-if="brand.status == true">
              <div class="checkbox-wrapper-7">
                <input checked disabled class="tgl tgl-ios" id="cb2-7" type="checkbox"/>
                <label class="tgl-btn" for="cb2-7"/>
              </div>
            </td>
            <td class="text-center" v-if="brand.status == false">
              <div class="checkbox-wrapper-7">
                <input disabled class="tgl tgl-ios" id="cb2-7" type="checkbox"/>
                <label class="tgl-btn" for="cb2-7"/>
              </div>
            </td>
            <td>{{ formattedDate(brand.createdAt) }}</td>
            <td>{{ formattedDate(brand.modifiedAt) }}</td>
            <td class="actions">
              <button @click="findBrand(brand.id)" data-bs-toggle="modal"
                      data-bs-target="#modal-update-brand"
                      class="btn text-4 btn-update edit-row edit-brand"><i
                  class="bi bi-pencil-square"></i></button>
              <button @click="deleteBrand(brand.id)" class="btn text-4 btn-delete"><i
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
    </section>

    <!-- Modal add new brand-->
    <div class="modal fade" id="modal-add-new-brand" tabindex="-1" role="dialog"
         aria-labelledby="modalAddNewBrand"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm nhãn hiệu</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <Form :validation-schema="schema" v-slot="{ errors }" @submit="addBrand">
              <div class="form-group">
                <label class="required-label" for="new-brand">Tên nhãn hiệu</label>
                <Field :class="{ 'is-invalid': errors.name }" name="name" v-model="name" type="text"
                       class="form-control" id="new-brand"/>

                <div class="text-danger font-italic text-1">{{ errors.name }}</div>
              </div>
              <div class="form-group">
                <label class="required-label">Logo</label>
<!--                <div class="thumbnail-container" style="display:none">-->
<!--                  <div class="img-div">-->
<!--                    <img class="preview-img" alt="Thumbnail post">-->
<!--                  </div>-->
<!--                </div>-->
                <br>
                <div class="select btn btn-info" role="button" @click="selectFiles">Chọn ảnh</div>
                <input hidden class="btn btn-info " type="file" name="file" id="file" ref="fileInput"
                       @change="onFileSelected">
                <div class="add-image-brand">
                  <div class="container">
                    <div class="image">
                      <img v-if="this.logo" :src="this.logo" alt="Logo thương hiệu">
                    </div>
                  </div>
                </div>
              </div>
              <br>
              <label>Trạng thái</label>
              <br>
              <div class="checkbox-wrapper-7">
                <input name="status" v-model="status" class="tgl tgl-ios" id="status-is-check"
                       type="checkbox"/>
                <label class="tgl-btn" for="status-is-check"/>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModal_1">Hủy</button>
                <button type="submit" class="btn btn-primary">Thêm</button>
              </div>
            </Form>
          </div>
        </div>


      </div>
    </div>


    <!-- Modal update brand-->
    <div class="modal fade" id="modal-update-brand" tabindex="-1" role="dialog" aria-labelledby="modalUpdateBrand"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa nhãn hiệu</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <Form :validation-schema="schema" v-slot="{ errors }" v-if="brandUpdate" @submit="updateBrand">
              <div class="form-group">
                <label class="required-label" for="update-brand">Tên nhãn hiệu</label>
                <Field name="name" :class="{ 'is-invalid': errors.name }" v-model="brandUpdate.name" type="text"
                       class="form-control" id="update-brand"/>
                <div class="text-danger font-italic text-1">{{ errors.name }}</div>
              </div>
              <div class="form-group">
                <label class="required-label">Logo</label>
                <div class="thumbnail-container" style="display:none">
                  <div class="img-div">
                    <img class="preview-img" alt="Thumbnail post">
                  </div>
                </div>
                <br>
                <div class="select btn btn-info" role="button" @click="selectFiles">Chọn ảnh</div>
                <input hidden class="btn btn-info " type="file" name="file" id="file" ref="fileInput"
                       @change="onFileSelectedUpdate">
                <div class="add-image-brand">
                  <div class="container">
                    <div class="image">
                      <!-- <span class="delete" @click="deleteImage">&times;</span> -->
                      <img :src="this.logoUpdate" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <br>
              <label>Trạng thái</label>
              <br>
              <div class="checkbox-wrapper-7">
                <input name="status" v-model="brandUpdate.status" class="tgl tgl-ios" id="status-is-check2"
                       type="checkbox">
                <label class="tgl-btn" for="status-is-check2"/>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModal_2">Hủy</button>
                <button type="submit" class="btn btn-primary btn-update-brand">Sửa</button>
              </div>
            </Form>
          </div>

        </div>
      </div>
    </div>
  </LayoutView>
</template>

<style scoped>

</style>