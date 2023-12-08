<script>
import LayoutView from "@/components/client/LayoutView.vue";
import {onErrorCaptured, ref} from 'vue'
import ListProductComponent from "@/components/client/product/ListProductComponent.vue";
export default {
  name: "ListProduct",
  components: {LayoutView, ListProductComponent},
  setup() {
    const error = ref(null)
    onErrorCaptured(e => {
      error.value = e
      console.log(error)
    })
    return {
      error
    }
  },
}
</script>

<template>
  <LayoutView>

    <div v-if="error">Parent: {{error}}</div>
    <Suspense>
      <template #default>
        <ListProductComponent/>
      </template>
      <template #fallback>
        <div  class="loader-container">
          <div class="loader">
            <img src="@/assets/client/images/svg/rings.svg" alt="loader">
          </div>
        </div>
      </template>
    </Suspense>
  </LayoutView>
</template>
