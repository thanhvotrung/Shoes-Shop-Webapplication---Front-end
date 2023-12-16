<script>
import LayoutView from "@/components/client/LayoutView.vue";
import LoaderView from "@/components/client/LoaderView.vue";
import {onErrorCaptured, ref} from 'vue'
import WishlistComponent from "@/components/client/wishlist/WishlistComponent.vue";

export default {
  name: "WishList",
  components: { LayoutView, WishlistComponent, LoaderView},
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
        <WishlistComponent/>
      </template>
      <template #fallback>
        <LoaderView/>
      </template>
    </Suspense>
  </LayoutView>
</template>

<style scoped>

</style>