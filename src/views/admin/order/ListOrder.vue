<script>
import LayoutView from "@/components/admin/LayoutView.vue";
import {onErrorCaptured, ref} from 'vue'
import ListOrderComponent from "@/components/admin/order/ListOrderComponent.vue";

export default {
  name: "ListOrder",
  components: {LayoutView, ListOrderComponent},
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
        <ListOrderComponent/>
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