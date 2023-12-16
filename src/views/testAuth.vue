<script>
import testComponent from "@/components/TestComponent.vue";

export default {
  name: "testAuth",
  components: {testComponent},
  data() {
    return {
      isPopupOpen: false,
    };
  },
  methods: {
    openPopup() {
      this.isPopupOpen = true;
    },
    handleYes() {
      // Handle 'Yes' button click
      console.log("User clicked Yes");
      this.isPopupOpen = false;
    },
    handleNo() {
      // Handle 'No' button click
      console.log("User clicked No");
      this.isPopupOpen = false;
    },
  },

}
</script>

<template>
  <div>
    <!-- Other content of your component -->

    <button @click="openPopup">Open Popup</button>

    <!-- Include the PopupYesNo component -->
    <testComponent
        v-if="isPopupOpen"
        :show="isPopupOpen"
        message="Do you want to proceed?"
        @yes="handleYes"
        @no="handleNo"
    ></testComponent>
  </div>
</template>

<style scoped>

</style>