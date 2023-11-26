<script>
import axios from "axios";

export default {
  name: "testAuth",
  async created() {
    await axios({
      method: "GET",
      url: 'http://localhost:3030/api/test',
      header: {
        Authorization: 'Bearer ' + this.$cookies.get("JWT_TOKEN")
      },
    }).then(res => console.log(res))
        .catch(err => {
          console.log(err)
        })
  }
}
</script>

<template>

  <button @click="handleTest">test</button>
</template>

<style scoped>

</style>