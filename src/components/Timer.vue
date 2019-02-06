<template>
  <div class="Timer">
    <ul>
      <Designation
        v-for="d in designations"
        :key="d"
        :designation="d"
        :active="d === designation"
      />
    </ul>
  </div>
</template>

<script>
// External Dependencies
import dayjs from 'dayjs';
window.dayjs = dayjs;

// Internal Components
import Designation from '@/components/Designation';

// Internal Dependencies
import display, { timer } from '@/services/display';
import { uuid } from '@/utils';
import { getAggregate } from '@/services/eventStream';
import designations from '@/fixtures/designations';
import { getEvents, setEvents } from '@/services/localStorage';

export default {
  name: 'Timer',
  components: {
    Designation
  },
  methods: {
    getDuration(designation) {
      const { aggregate = {} } = this.$store.state;
      return aggregate[designation];

      // let currentDuration;
      // // this is the currently-running timer
      // if (this.designation === designation) {
      //   // this will display weird shit after 24 hours
      //   const prevDuration = this.aggregate[designation] || 0;
      //   currentDuration = (this.time - this.startTime) + prevDuration;

      // // this is just diplaying the time from the aggregate
      // } else {
      //   currentDuration = this.aggregate[designation];
      // }
      // const currentStopMoment = dayjs(currentDuration);
      // const secondsDuration = currentStopMoment.diff(dayjs(0), 'seconds');
      // // console.log(secondsDuration);
      // return display(currentStopMoment.unix(), timer);
    },
  },
  computed: {
    aggregate() {
      return this.$store.state.aggregate;
    },
    events() {
      return this.$store.state.events;
    },
    designation() {
      return this.$store.state.designation;
    },
    day() {
      return this.$store.state.day;
    },
    designations() {
      return this.$store.state.designations;
    },
    toggleText() {
      return `${this.expanded ? 'hide' : 'show'} config`;
    },
    startTime() {
      return this.$store.state.startTime;
    },
    timer() {
      return this.$store.state.timer;
    },
    time() {
      return this.$store.state.time;
    }
  }
};
</script>

<style lang="sass">
  .Timer
    width: calc(100vh - 2rem)
    max-width: 600px
    margin: 0 auto

  .F__g
    display: flex
    flex-direction: column

  .F__i
    width: 100%
    height: 28px

  .B
    cursor: pointer

  .B--un
    border: 0
    background: 0
    padding: 0.2rem 0.8rem
</style>