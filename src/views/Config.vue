<script>
import dayjs from 'dayjs';
export default {
  name: 'Config',
  computed: {
    designations() {
      return this.$store.state.designations
    }
  }
};
</script>

<template>
  <div class="Config">
    <h1>This is the history page</h1>
  </div>
</template>
