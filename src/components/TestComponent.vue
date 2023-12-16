<script>
export default {
  name: "TestComponent",
  props: {
    show: Boolean,
    message: String,
  },
  methods: {
    handleYes() {
      this.$emit('yes');
    },
    handleNo() {
      this.$emit('no');
    },
  },
}
</script>

<template>
  <div v-if="show">
    <div class="popup-overlay"></div>
    <div class="popup-container">
      <div class="popup-content">
        <p>{{ message }}</p>
        <button class="btn-confirm" @click="handleYes">Xác nhận</button>
        <button class="btn-cancel" @click="handleNo">Hủy</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;

  border-radius: 5px;
}

.popup-content {
  text-align: center;
}

button {
  margin: 0 10px;
  outline: none;
  border: 1px solid;
  border-radius:5px;
}

.btn-confirm:hover {
  background-color: limegreen;
  border: 1px solid;
  color: #fff;
}

.btn-cancel:hover {
  background-color: orangered;
  color: #fff;
}
</style>