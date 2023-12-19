<script>
import axios from "axios";
import LayoutView from "@/components/admin/LayoutView.vue";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';

import Vue3TagsInput from 'vue3-tags-input';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from "@ckeditor/ckeditor5-vue"
import {useToast} from "vue-toastification";

export default {
  name: "EditProduct",
  components: {
    Form,
    Field,
    LayoutView,
    Vue3TagsInput,
    ckeditor: CKEditor.component
  },

  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    const schemaSize = Yup.object().shape({
      quantity: Yup.number().required("Số lượng phải lớn hơn 0")
          .typeError("Không đúng định dạng.")
          .positive("Số lượng phải dương")
          .min(1, "Số lượng phải lớn hơn 0")
    })

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
      schemaSize,
      brands: null,
      categories: null,
      productSizes: {},
      id: null,
      product: null,

      // tags input of category
      tags: [],
      tag: '',

      //   Dữ liệu trong Product Form
      category_ids: [],
      images: [],
      feedbackImages: [],

      // CKEditor of description
      editor: ClassicEditor,
      editorConfig: {/* CKEditor configuration options go here*/},

      //   size VN
      sizeVN: [35, 36, 37, 38, 39, 40, 41, 42],
      size: '',
      quantity: 0,
    }
  },

  methods: {
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/categories-status`).then(res => {
        this.categories = res.data
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.')
        } else {
          console.error('An error occurred:', err)
        }
      })
      await axios.get(`http://localhost:3030/api/admin/brands`).then(res => {
        this.brands = res.data.content
      }).catch(err => {
        console.log(err)
      })
      await axios.get(`http://localhost:3030/api/admin/products/${this.id}`).then(res => {

        this.product = res.data
        this.handleChangeTag(res.data.categories)
        this.images = res.data.images
        this.feedbackImages = res.data.imageFeedBack ? res.data.imageFeedBack : []

      }).catch(err => {
        console.log(err)
      })
      await axios.get(`http://localhost:3030/api/admin/products/sizes/${this.id}`).then(res => {
        this.productSizes = res.data
      }).catch(err => {
        console.log(err)
      })
    },

    async fetchDataProductSizes() {
      await axios.get(`http://localhost:3030/api/admin/products/sizes/${this.id}`).then(res => {
        console.log(res)
        this.productSizes = res.data
      }).catch(err => {
        if (err.response.status === 401) {
          console.error('Authentication failed. Need to refresh token or re-authenticate.');
        } else {
          console.error('An error occurred:', err);
        }
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

    async onFileSelectedFeedbackImg(event) {
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
        this.feedbackImages = [...this.feedbackImages, ...res.data]
        console.log(res.data)
        console.log(this.feedbackImages)
      }).catch(err => console.log(err))
    },

    deleteImage(index) {
      this.images.splice(index, 1)
    },

    deleteFeedbackImage(index) {
      this.feedbackImages.splice(index, 1)
    },

    //   Sửa Product
    async updateProduct() {
      const newProduct = {
        name: this.product.name,
        description: this.product.description,
        brand_id: this.product.brand.id,
        category_ids: this.category_ids,
        price: this.product.price,
        salePrice: this.product.salePrice,
        product_images: this.images,
        status: this.product.status
      }
      await axios.put(`http://localhost:3030/api/admin/products/${this.id}`, newProduct)
          .then((res) => {
            console.log(res)
            this.toast.success(res.data)
            this.$router.push("/admin/products")
          }).catch((err) => {
            if (err.response.data.status === "BAD_REQUEST") {
              this.toast.error(err.response.data.message)
            }
            console.log(err)
          })
    },

    //   Thêm sửa size product
    async updateProductSizes() {
      const newProductSize = {
        size: this.size,
        count: this.quantity,
        product_id: this.id
      }
      await axios.put(`http://localhost:3030/api/admin/products/sizes`, newProductSize)
          .then(res => {
            console.log(res)
            this.toast.success(res.data)
            this.fetchDataProductSizes()
            this.quantity = 0
          }).catch(err => {
            console.log(err)
            if (err.response.data.status === "BAD_REQUEST") this.toast.warning(err.response.data.message)
          })
    },

    // Thêm ảnh feedback images product
    async updateFeedbackImages() {
      const feedbackImages = {
        feedback_images: this.feedbackImages
      }
      await axios.put(`http://localhost:3030/api/admin/products/${this.id}/update-feedback-image`, feedbackImages)
          .then(res => {
            this.toast.success(res.data)
          }).catch(err => {
            console.log(err)
          })
    },


    // async deleteProduct(id) {
    //   const imagePaths = this.product.images;
    //
    //   // Sử dụng vòng lặp for thay vì vòng lặp for (let i = 0; i <= imagePaths.length; i++)
    //   for (let i = 0; i < imagePaths.length; i++) {
    //     await FirebaseConfig.DeleteImage(imagePaths[i]);
    //   }
    //
    //   try {
    //     await axios.delete(`http://localhost:3030/api/admin/products/${id}`);
    //     this.toast.success("Sản phẩm đã được xóa thành công");
    //     this.fetchData();
    //   } catch (error) {
    //     console.error(error);
    //     this.toast.warning(error.response ? error.response.data.message : "Có lỗi xảy ra khi xóa sản phẩm");
    //   }
    // },

  },

  watch: {
    size() {
      const foundSize = this.productSizes.find(product => product.size === this.size);
      this.quantity = foundSize ? foundSize.quantity : 0;
    }
  },

  mounted() {
    this.id = this.$route.params.id;
    this.fetchData()
  }
}
</script>

<template>
  <LayoutView>
    <section role="main" class="content-body" id="main-content">
      <div v-if="product">
        <header class="page-header">
          <div class="right-wrapper text-right mr-5">
            <ol class="breadcrumbs">
              <li>
                <router-link to="/admin"><i class="bx bx-home-alt"></i></router-link>
              </li>
              <li>
                <router-link to="/admin/products"><span>Danh sách sản phẩm</span></router-link>
              </li>
              <li><span>{{ product.name }}</span></li>
            </ol>
          </div>
        </header>
        <Form @submit="updateProduct" :validation-schema="schema" v-slot="{ errors }" id="formProduct">
          <section class="card">
            <header class="card-header">
              <div class="card-actions">
              </div>
              <h2 class="card-title">{{ product.name }}</h2>
              <br>
              <div class="row">
                <div class="col-sm-6">
                  <div class="mb-3">
                    <router-link style="border: 1px solid #cccc" class="btn btn-primary text-3 mx-1"
                                 to="/admin/products">
                      <i class="bi bi-chevron-left"></i> Trở về
                    </router-link>
                    <button @click="refeshCategoryIds" type="submit" id="addToTable"
                            class="btn btn-primary text-3 mx-1">Cập nhật
                      sản phẩm <i class="bi bi-plus-circle-dotted"></i></button>
                  </div>
                </div>
              </div>
            </header>
            <div class="card-body">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                          type="button"
                          role="tab" aria-controls="home" aria-selected="true">Thông tin sản phẩm
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button"
                          role="tab" aria-controls="profile" aria-selected="false">Nhập số lượng sản phẩm
                  </button>
                </li>
<!--                <li class="nav-item" role="presentation">-->
<!--                  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button"-->
<!--                          role="tab" aria-controls="contact" aria-selected="false">Thêm ảnh feedback cho sản-->
<!--                  </button>-->
<!--                </li>-->
              </ul>
              <div class="tab-content" id="myTabContent">
                <!--Start Tab Infomation Product-->
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div class="row">
                    <div class="col-lg-9 col-md-8">
                      <!--Start Name Form-->
                      <div class="form-group">
                        <div>
                          <label class="required-label" for="name">Tên sản phẩm <span
                              class="required">*</span></label>
                        </div>
                        <Field style="font-size: 14px" type="text" class="form-control" v-model="product.name"
                               name="name"
                               id="name"/>
                        <div class="text-danger font-italic text-1">{{ errors.name }}</div>
                      </div>
                      <!--End Name Form-->
                      <!--Start Description Form-->
                      <div class="form-group">
                        <div>
                          <label class="required-label" for="description">Mô tả <span
                              class="required">*</span></label>
                        </div>
                        <!--Start Hidden-->
                        <Field as="textarea" style="font-size: 14px" hidden v-model="product.description"
                               id="description"
                               name="description"></Field>
                        <!--End Hidden-->
                        <div>
                          <ckeditor
                              :editor="editor"
                              v-model="product.description"
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
                        <select style="font-size: 14px" v-model="product.status" name="status" class="form-control"
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
                        <Field style="font-size: 14px" as="select" class="form-control" id="brand"
                               v-model="product.brand.id"
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
                        <vue3-tags-input v-if="categories" :tags="tags"
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
                        <Field style="font-size: 14px" type="text" class="form-control text-price-input money"
                               name="price" v-model="product.price"
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
                               name="salePrice" id="salePrice" v-model="product.salePrice"/>
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
                                              <span>Drag & drop image here or <span class="select"
                                                                                    role="button"
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
                <!--End Tab Infomation Product-->
                <!--Start Tab Size Product-->
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                  <div>
                    <div class="row">
                      <Form :validation-schema="schemaSize" v-slot="{ errors }" @submit="updateProductSizes"
                            class="form">
                        <div class="form-group col-md-2">
                          <label for="size">Size giày</label>
                          <select v-model="size" class="form-control text-3" id="size">
                            <option selected value="" disabled>Chọn size giày</option>
                            <option v-for="size in this.sizeVN" :value="size" :key="size">{{ size }}</option>
                          </select>
                        </div>
                        <div class="form-group col-md-2">
                          <label for="count">Số lượng có sẵn</label>
                          <Field name="quantity" v-model="quantity" type="number" class="form-control text-3"
                                 :class="{'is-invalid': errors.quantity}" id="count"/>
                          <div class="text-danger font-italic text-1">{{ errors.quantity }}</div>
                        </div>
                        <div class=" form-group col-md-3">
                          <label for="">Thực hiện</label>
                          <br>
                          <button type="submit" id="" class="btn btn-primary btn-update-size-count text-3">Cập
                            nhật số lượng <i class="bi bi-plus-circle-dotted"></i></button>
                          <br>
                        </div>
                      </Form>
                    </div>
                  </div>
                  <div>
                    <table class="table table-striped table-bordered table-hover">
                      <thead>
                      <tr>
                        <th>Size giày</th>
                        <th>Số lượng có sẵn</th>
                      </tr>
                      </thead>
                      <tbody class="list-product-size">
                      <tr v-for="ps in productSizes" :key="ps.id">
                        <td class="product-size" :data-size="ps.size">{{ ps.size }}</td>
                        <td class="product-count">{{ ps.quantity }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!--End Tab Size Product-->
                <!--Start Tab Feedback Image Product-->
                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                  <div class="row">
                    <Form @submit="updateFeedbackImages">
                      <div class="col-12">
                        <div class="form-group mb-2">
                          <button type="submit" class="btn btn-primary btn-update-feedback-img mx-1 text-3">
                            <span>Cập nhật</span>
                          </button>
                          <button type="button" class="btn btn-primary mx-1 text-3"
                                  @click="this.$refs.imgFeedBack.click()">
                            Thêm ảnh
                          </button>
                          <input class="hidden" type="file" name="file" id="file" ref="imgFeedBack" multiple
                                 @change="onFileSelectedFeedbackImg">
                        </div>
                        <div class="text-right font-italic text-danger">
                          <label>Hình ảnh feedback của khách hàng</label>
                        </div>
                        <div class="add-cate-card">
                          <div class="container">
                            <div class="image" v-for="(image, index) in feedbackImages" :key="index">
                              <span class="delete" @click="deleteFeedbackImage">&times;</span>
                              <img :src="image" alt="">
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Form>
      </div>
    </section>
  </LayoutView>
</template>

<style>

</style>