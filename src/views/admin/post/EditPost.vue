<script>
import axios from "axios";
import LayoutView from "@/components/admin/LayoutView.vue";
import {Form, Field} from 'vee-validate';
import * as Yup from 'yup';
import {useToast} from "vue-toastification";



import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from "@ckeditor/ckeditor5-vue"
import jwtDecode from "jwt-decode";

export default {
  name: "EditPost",
  components: {Form, Field, LayoutView, ckeditor: CKEditor.component},

  setup() {
    const toast = useToast();
    return {toast}
  },

  data() {
    // Validate Form with Yup
    const schema = Yup.object().shape({
      title: Yup.string().required("Tên không được trống."),
      content: Yup.string().required("Mô tả không được trống."),
      description: Yup.string().required("Mô tả không được trống."),
    })

    return {
      schema,

      //   Dữ liệu trong Product Form
      images: [],
      id: null,
      post: null,

      // CKEditor of description
      editor: ClassicEditor,
      editorConfig: {/* CKEditor configuration options go here*/},

      email: null,
      token: null,
    }
  },


  methods: {
    //   Sửa Product
    async updatePost() {
      const newPost = {
        title: this.post.title,
        content: this.post.content,
        description: this.post.description,
        image: this.images[0] || '',
        status: this.post.status,
        email: this.email
      }
      await axios.put(`http://localhost:3030/api/admin/posts/${this.id}`, newPost)
          .then((res) => {
            console.log(res)
            this.toast.success(res.data)
            this.$router.push("/admin/news")
          }).catch((err) => {
            if (err.response.data.status === "BAD_REQUEST") {
              this.toast.error(err.response.data.message)
            }
            console.log(err)
          })
    },
    async fetchData() {
      await axios.get(`http://localhost:3030/api/admin/posts/${this.id}`).then(res => {
        console.log(res)
        this.post = res.data
        this.images.push(res.data.thumbnail)
      }).catch(err => {
        console.log(err)
      })
    },

    decodeJwt() {
      const token = this.token;
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.email = decodedToken.sub;
        } catch (error) {
          console.error('JWT Decoding Error:', error);
        }
      }
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
    this.token = this.$cookies.get("JWT_TOKEN")
    this.decodeJwt()
    this.id = this.$route.params.id;
    this.fetchData()
  },

}
</script>

<template>
  <LayoutView>
    <section role="main" class="content-body" id="main-content">
      <div v-if="post">
        <header class="page-header">
          <div class="right-wrapper text-right mr-5">
            <ol class="breadcrumbs">
              <li>
                <router-link to="/admin"><i class="bx bx-home-alt"></i></router-link>
              </li>
              <li>
                <router-link to="/admin/products"><span>Danh sách sản phẩm</span></router-link>
              </li>
              <li><span>{{ post.title }}</span></li>
            </ol>
          </div>
        </header>
        <Form @submit="updatePost"  :validation-schema="schema" v-slot="{ errors }">
          <section class="card">
            <header class="card-header">
              <h2 class="card-title">Danh sách tin tức</h2>
              <br>
              <div class="row">
                <div class="col-sm-6">
                  <div class="mb-3">
                    <router-link style="border: 1px solid #cccc" class="btn btn-primary mx-1 text-2" to="/admin/posts">
                      <i class="bi bi-chevron-left"></i> Trở về
                    </router-link>
                    <button  type="submit" class="btn btn-primary mx-1 text-2">Sửa bài viết <i
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
                              <label class="required-label" for="title">Tên tin tức <span
                                  class="required">*</span></label>
                            </div>
                            <Field style="font-size: 14px" type="text" :class="{'is-invalid': errors.title}"
                                   class="form-control" v-model="post.title" name="title"
                                   id="title"/>
                            <div class="text-danger font-italic text-1">{{ errors.title }}</div>

                          </div>
                          <!--End Name Form-->
                          <!--Start Description Form-->
                          <div class="form-group">
                            <div>
                              <label class="required-label" for="content">Nội dung <span
                                  class="required">*</span></label>
                            </div>
                            <!--Start Hidden-->
                            <Field style="font-size: 14px" type="text" :class="{'is-invalid': errors.content}"
                                   class="form-control" v-model="post.content" name="content"
                                   id="content"/>
                            <div class="text-danger font-italic text-1">{{ errors.content }}</div>
                            <div>
                              <label class="required-label" for="content">Mô tả <span
                                  class="required">*</span></label>
                            </div>
                            <Field as="textarea" style="font-size: 14px" hidden v-model="post.description"
                                   id="description"
                                   name="description"></Field>
                            <!--End Hidden-->
                            <div>
                              <ckeditor
                                  :editor="editor"
                                  v-model="post.description"
                                  :config="editorConfig"
                              ></ckeditor>
                            </div>
                            <div class="text-danger font-italic text-1">{{ errors.description }}</div>

                          </div>

                        </div>
                        <div class="form-group">
                          <label for="status" class="required-label">Trạng thái</label>
                          <select style="font-size: 14px" v-model="post.status" name="status" class="form-control"
                                  id="status">
                            <option value="1">Công khai</option>
                            <option value="0">Nháp</option>
                          </select>
                        </div>
                        <!--End Description Form-->
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
          </section>
        </Form>
      </div>
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