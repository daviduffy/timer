<template>
  <div class="Timer">
    <ul>
      <Designation
        v-for="d in designations"
        v-on:select="handleSelectDesignation"
        :key="d"
        :designation="d"
        :active="d === designation"
        :duration="getDuration(d)"
      />
    </ul>
  </div>
</template>

<script>
// External Dependencies
import dayjs from 'dayjs';

// Internal Components
import Designation from '@/components/Designation';

// Internal Dependencies
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
    addEvent(designation) {
      const event = {
        id: uuid(),
        time: dayjs().valueOf(),
        designation: designation
      }
      this.$store.commit('addEvent', event);
    },
    startTimer() {
      this.$store.commit('setStartTime');
      this.$store.commit('startTimer');
    },
    setDesignation(designation) {
      this.$store.commit('setDesignation', designation);
    },
    getDuration(designation) {
      let currentDuration;
      // this is the currently-running timer
      if (this.designation === designation) {
        // this will display weird shit after 24 hours
        const prevDuration = this.aggregate[designation] || 0;
        currentDuration = (this.time - this.startTime) + prevDuration;

      // this is just diplaying the time from the aggregate
      } else {
        currentDuration = this.aggregate[designation];
      }
      const humanDuration = dayjs(currentDuration).format('mm:ss');
      return humanDuration;
    },
    stopTimer() {
      this.$store.commit('stopTimer');
      this.$store.commit('setAggregate');
    },
    handleSelectDesignation(designation) {

      // always add an event
      this.addEvent(designation);

      // always save the latest state
      setEvents(this.events);

      // always stop the timer regardless
      this.stopTimer();

      // figure out if this is a stop or a start/switch action
      const action = (this.designation === designation) ? 'stop' : 'start';
      let nextDesignation;

      if (action === 'stop') {
        nextDesignation = '';
      // start timer again if a new designation was selected
      } else {
        this.startTimer();
        nextDesignation = designation;
      }
      this.$store.commit('setDesignation', nextDesignation);
    },
    setAggregate() {
      this.aggregate = getAggregate({ designations: this.designations, events: this.events });
    }
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
</style>