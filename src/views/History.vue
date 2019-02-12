<script>
import dayjs from 'dayjs';
export default {
  name: 'History',
  computed: {
    streams() {
      const streams = this.$store.state.streams;
      return Object.keys(streams).map((id) => ({
        id,
        ...streams[id]
      }));
    },
    thisWeek() {
      const startOfWeek = dayjs().startOf('week').valueOf();
      const endOfWeek = dayjs().endOf('week').valueOf();
      return this.streams.filter(({ id }) => {
        return id > startOfWeek && id < endOfWeek;
      })
    }
  }
};
</script>

<template>
  <div class="History">
    <h1>This is the history page</h1>
  </div>
</template>
