<script>

import LayoutView from "@/components/admin/LayoutView.vue";
import {onErrorCaptured, ref} from 'vue'
import EditOrderComponent from "@/components/admin/order/EditOrderComponent.vue";
export default {
  name: "EditOrder",
  components: {EditOrderComponent, LayoutView},
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
        <EditOrderComponent/>
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

<style scoped>

</style>