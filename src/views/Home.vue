<template>
  <Timer />
</template>

<script>
// @ is an alias to /src
import Timer from '@/components/Timer.vue';
import Total from '@/components/Total.vue';

export default {
  name: 'Home',
  components: {
    Timer,
    Total
  }
};
</script>
