<script>
import axios from "axios";
import LayoutView from "@/components/admin/LayoutView.vue";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';
import {useToast} from "vue-toastification";

import Vue3TagsInput from 'vue3-tags-input';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from "@ckeditor/ckeditor5-vue"

export default {
  name: "AddProduct",
  components: {Form, Field, LayoutView, Vue3TagsInput, ckeditor: CKEditor.component},

  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    // Validate Form with Yup
    const schema = Yup.object().shape({
      name: Yup.string().required("Tên không được trống."),
      description: Yup.string().required("Mô tả không được trống."),
      brand_id: Yup.string().required("Vui lòng chọn nhãn hiệu sản phẩm."),
      category_ids: Yup.array()
          .min(1, "Vui lòng chọn ít nhất 1 danh mục sản phẩm.")
          .required("Vui lòng chọn ít nhất 1 danh mục sản phẩm."),
      price: Yup.number().required("Giá tiền không được trống.")
          .typeError("Không đúng định dạng.")
          .positive("Giá tiền phải dương")
          .min(1000, "Giá tiền phải lớn hơn 1000đ")
          .max(10000000, "Giá tiền phải thấp hơn 10.000.000đ"),
      salePrice: Yup.number().required("Giá tiền bán ra không được trống.")
          .typeError("Không đúng định dạng.")
          .positive("Giá tiền phải dương")
          .min(1000, "Giá tiền phải lớn hơn 1000đ")
          .max(10000000, "Giá tiền phải thấp hơn 10.000.000đ")
          .test(
              'is-less-than-price',
              'Giá tiền bán phải cao hơn giá tiền nhập',
              function (salePrice) {
                const price = this.parent.price;
                return salePrice > price;
              },
          )
    })

    return {
      schema,
      brands: null,
      categories: null,

      // tags input of category
      tags: [],
      tag: '',

      //   Dữ liệu trong Product Form
      name: null,
      description: '',
      brand_id: null,
      category_ids: [],
      price: null,
      salePrice: null,
      images: [],
      feed_back_images: [],
      status: 0,

      // CKEditor of description
      editor: ClassicEditor,
      editorConfig: {/* CKEditor configuration options go here*/},
    }
  },

  methods: {
    // Lấy dữ liệu từ database
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/categories-status`).then(res => {
        this.categories = res.data
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
      })
      await axios.get(`http://localhost:3030/api/admin/brands`).then(res => {
        this.brands = res.data.content
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
      })
    },

    async addProduct() {
      const newProduct = {
        name: this.name,
        description: this.description,
        brand_id: this.brand_id,
        category_ids: this.category_ids,
        price: this.price,
        salePrice: this.salePrice,
        product_images: this.images,
        feed_back_images: this.feed_back_images,
        status: this.status
      }
      await axios.post(`http://localhost:3030/api/admin/products`, newProduct).then(res => {
        console.log(res)
        this.toast.success("Tạo sản phẩm thành công")
        this.$router.push({name: "AdminProducts"})
      }).catch(err => {
        if (err.response.data.status === "BAD_REQUEST") {
          this.toast.warning(err.response.data.message)
        }
        console.log(err)
      })
    },

    //Chức năng của category tagsinput
    handleSelectedTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this.category_ids.push(tag.id);
      }
    },
    handleChangeTag(tags) {
      this.tags = tags;
      this.category_ids = this.tags.map(tag => tag.id);
    },

    // refesh category_ids
    refeshCategoryIds() {
      this.category_ids = this.tags.map(tag => tag.id);
    },

    //Thẻ mở - Chức năng xử lý thêm hình ảnh
    selectFiles() {
      this.$refs.fileInput.click();
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
        this.images = [...this.images, ...res.data]
        console.log(res.data)
      }).catch(err => console.log(err))
    },
    deleteImage(index) {
      this.images.splice(index, 1)
    },
  },

  mounted() {
    this.fetchData()
  },
}
</script>

<template>
  <LayoutView>
    <section role="main" class="content-body" id="main-content">
      <header class="page-header">
        <div class="right-wrapper text-right mr-5">
          <ol class="breadcrumbs">
            <li>
              <router-link to="/admin"><i class="bx bx-home-alt"></i></router-link>
            </li>
            <li>
              <router-link to="/admin/products"><span>Danh sách sản phẩm</span></router-link>
            </li>
            <li><span>Thêm sản phẩm mới</span></li>
          </ol>
        </div>
      </header>
      <Form @submit="addProduct" :validation-schema="schema" v-slot="{ errors }">
        <section class="card">
          <header class="card-header">
            <h2 class="card-title">Danh sách sản phẩm</h2>
            <br>
            <div class="row">
              <div class="col-sm-6">
                <div class="mb-3">
                  <router-link style="border: 1px solid #cccc" class="btn btn-primary mx-1 text-2" to="/admin/products">
                    <i class="bi bi-chevron-left"></i> Trở về
                  </router-link>
                  <button @click="refeshCategoryIds" type="submit" class="btn btn-primary mx-1 text-2">Thêm sản phẩm <i
                      class="bi bi-plus-circle-dotted"></i></button>
                </div>
              </div>
            </div>
          </header>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="card card-outline">
                  <div class="card-body pad">
                    <div class="row">
                      <div class="col-lg-9 col-md-8">
                        <!--Start Name Form-->
                        <div class="form-group">
                          <div>
                            <label class="required-label" for="name">Tên sản phẩm <span
                                class="required">*</span></label>
                          </div>
                          <Field style="font-size: 14px" type="text" :class="{'is-invalid': errors.name}"
                                 class="form-control" v-model="name" name="name"
                                 id="name"/>
                          <div class="text-danger font-italic text-1">{{ errors.name }}</div>
                          <!--                          <div class="form-floating mb-3">-->
                          <!--                            <Field style="font-size: 14px; padding-top:35px; padding-bottom: 20px" type="text" :class="{'is-invalid': errors.name, 'form-control': true}" id="floatingInput name" v-model="name" name="name" placeholder="Giày Nike"/>-->
                          <!--                            <label for="floatingInput">Tên sản phẩm <span class="required">*</span></label>-->
                          <!--                          </div>-->
                        </div>
                        <!--End Name Form-->
                        <!--Start Description Form-->
                        <div class="form-group">
                          <div>
                            <label class="required-label" for="description">Mô tả <span
                                class="required">*</span></label>
                          </div>
                          <!--Start Hidden-->
                          <Field as="textarea" style="font-size: 14px" hidden v-model="description"
                                 id="description"
                                 name="description"></Field>
                          <!--End Hidden-->
                          <div>
                            <ckeditor
                                :editor="editor"
                                v-model="description"
                                :config="editorConfig"
                            ></ckeditor>
                          </div>
                          <div class="text-danger font-italic text-1">{{ errors.description }}</div>
                        </div>
                        <!--End Description Form-->
                      </div>
                      <div class="col-lg-3 col-md-4">
                        <!--Start Status Form-->
                        <div class="form-group">
                          <label for="status" class="required-label">Trạng thái</label>
                          <select style="font-size: 14px" v-model="status" name="status" class="form-control"
                                  id="status">
                            <option value="1">Mở bán</option>
                            <option value="0">Không bán</option>
                          </select>
                        </div>
                        <!--End Status Form-->
                        <!--Start Brand Form-->
                        <div class="form-group">
                          <label for="brand" class="required-label">Nhãn hiệu sản phẩm <span
                              class="required">*</span></label>
                          <Field style="font-size: 14px" as="select"
                                 :class="{'is-invalid': errors.brand_id, 'form-control': true}" id="brand"
                                 v-model="brand_id"
                                 name="brand_id">
                            <option value="" disabled>Chọn nhãn hiệu</option>
                            <option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
                          </Field>
                          <div class="text-danger font-italic text-1">{{ errors.brand_id }}</div>
                        </div>
                        <!--End Brand Form-->
                        <!--Start Category Form-->
                        <div class="form-group">
                          <div>
                            <label class="control-label text-lg-right pt-2">Danh mục sản phẩm <span
                                class="required">*</span></label>
                          </div>
                          <!--Start Hidden-->
                          <Field hidden as="select" multiple data-plugin-selectTwo class="form-control populate"
                                 name="category_ids" id="category" v-model="category_ids">
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                              {{ category.name }}
                            </option>
                          </Field>
                          <!--End Hidden-->
                          <vue3-tags-input :class="{'is-invalid': errors.category_ids}" class="form-control text-3"
                                           v-if="categories" :tags="tags"
                                           v-model="tag"
                                           :select="true"
                                           :select-items="categories"
                                           @on-select="handleSelectedTag"
                                           @on-tags-changed="handleChangeTag"
                                           placeholder="Chọn danh mục">
                            <template #item="{ tag }">
                              {{ tag.name }}
                            </template>
                            <template #no-data>
                              No Data
                            </template>
                            <template #select-item="tag">
                              {{ tag.name }}
                            </template>
                          </vue3-tags-input>
                          <div class="text-danger font-italic text-1">{{ errors.category_ids }}</div>
                        </div>
                        <!--End Category Form-->
                        <!--Start Price Form-->
                        <div class="form-group">
                          <div>
                            <label class="required-label" for="price">Giá gốc sản phẩm (VNĐ) <span
                                class="required">*</span></label>
                          </div>
                          <Field style="font-size: 14px" type="text" :class="{'is-invalid': errors.price}"
                                 class="form-control text-price-input money"
                                 name="price" v-model="price"
                                 id="price"/>
                          <div class="text-danger font-italic text-1">{{ errors.price }}</div>
                        </div>
                        <!--End Price Form-->
                        <!--Start Sale Price Form-->
                        <div class="form-group">
                          <div>
                            <label class="required-label" for="salePrice">Giá bán ra của sản phẩm
                              (VNĐ)
                              <span class="required">*</span></label>
                          </div>
                          <Field style="font-size: 14px" type="text" class="form-control text-price-input money"
                                 :class="{'is-invalid': errors.salePrice}"
                                 name="salePrice" id="salePrice" v-model="salePrice"/>
                          <div class="text-danger font-italic text-1">{{ errors.salePrice }}</div>
                        </div>
                        <!--End Sale Price Form-->
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div>
                          <label class="required-label">Ảnh sản phẩm <span
                              class="required">*</span></label> <i>(Lưu ý: Nên để nền trắng)</i>
                          <span class="invalid-feedback" id="invalid-feedback-product-img">Chưa chọn ảnh sản phẩm</span>
                        </div>
                        <div class="add-cate-card">

                          <div class="drag-area">
                            <span>Drag & drop image here or <span class="select" role="button"
                                                                  @click="selectFiles">Choose</span></span>
                            <input class="hidden" type="file" name="file" id="file" ref="fileInput" multiple
                                   @change="onFileSelected">
                          </div>
                          <div class="container">
                            <div class="image" v-for="(image, index) in images" :key="index">
                              <span class="delete" @click="deleteImage">&times;</span>
                              <img :src="image" alt="">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Form>
    </section>
  </LayoutView>
</template>

<style>
.ck-editor__editable {
  min-height: 200px;
}

.add-cate-card {
  width: 100% !important;
  padding: 10px !important;
  box-shadow: 0 0 5px #ffdfdf !important;
  border-radius: 5px !important;
  overflow: hidden !important;
}


.add-cate-card p {
  font-weight: bold !important;
  color: #0d6efd !important;
}

.add-cate-card button {
  outline: 0 !important;
  border: 0 !important;
  color: #fff !important;
  border-radius: 5px !important;
  font-weight: 400 !important;
  padding: 8px 13px !important;
  width: 100% !important;
  background: #0d6efd !important;
}

.add-cate-card .drag-area {
  height: 150px !important;
  border-radius: 5px !important;
  border: 2px dashed #0d6efd !important;
  background: #f4f2f2 !important;
  color: #0d6efd !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  user-select: contain !important;
  -webkit-user-select: none !important;
  margin-top: 10px !important
}

.add-cate-card .drag-area {
  font-size: 18px !important;
}

.add-cate-card .select {
  color: #5256ad !important;
  margin-left: 5px !important;
  cursor: pointer !important;
  transition: 0.4s !important;

}

.add-cate-card .select:hover {
  opacity: 0.6 !important;
}

.add-cate-card .container {
  width: 100% !important;
  height: auto !important;
  display: flex !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
  flex-wrap: wrap !important;
//max-height: 200px !important; position: relative !important; margin-bottom: 8px !important; padding-top: 15px !important
}

.add-cate-card .container .image {
  width: 200px !important;
  margin-right: 5px !important;
  height: auto !important;
  position: relative !important;
  margin-bottom: 8px !important;
}

.add-cate-card .container .image img {
  width: 100% !important;
  height: 100% !important;
  border-radius: 5px !important;
}

.add-cate-card .container .image span {
  position: absolute !important;
  top: -2px !important;
  right: 9px !important;
  font-size: 20px !important;
  cursor: pointer !important;
}

.hidden {
  display: none !important;
}

.delete {
  z-index: 1 !important;
  color: red !important;
}
</style>