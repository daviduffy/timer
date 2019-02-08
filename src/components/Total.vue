<template>
  <div class="Total">
    <div class="Total__total">
      <span class="h7">{{day}}</span>
      <span>{{total}}</span>
      <span class="h7">Total hours today</span>
    </div>
  </div>
</template>

<script>
// External Dependencies
import dayjs from 'dayjs';

// Internal Dependencies
import display, { euro } from '@/services/display';

export default {
  name: 'Total',
  computed: {
    aggregate() {
      return this.$store.state.aggregate || {};
    },
    day() {
      return this.$store.state.day;
    },
    startTime() {
      return this.$store.state.startTime;
    },
    duration() {
      return this.$store.state.duration;
    },
    timer() {
      return this.$store.state.timer;
    },
    total() {
      const aggregateTotal = Object.values(this.aggregate)
        .reduce((total, curr) => {
          total += curr || 0;
          return total;
        }, 0);
      let total;
      // if there is currently a timer, add the duration from the timer
      if (this.startTime) {
        total = aggregateTotal + this.duration;
      } else {
        total = aggregateTotal;
      }
      // const format = total > 3599999 ?  : 'mm[<span>]:ss[</span>]';
      return display(total, euro);
    }
  }
};
</script>

<style lang="sass" scoped>
  .Total 
    display: flex
    padding: 0 1rem 1rem
  
  .Total__total
    display: flex
    flex-direction: column

  .Total__total
    font-size: 2.25rem
    font-weight: 300
    padding: 0 0.5rem 0.5rem
    margin: 0 0.5rem 0

  .h7
    font-size: 0.8rem
</style>
