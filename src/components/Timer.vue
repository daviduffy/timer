<template>
  <div>
    <p>
      <span>{{ day }}, </span>
      <span>working on: {{ currentDesignation || "nothin'" }}</span>
    </p>
    <ul>
      <Designation
        v-for="designation in designations"
        v-on:select="handleSelectDesignation"
        :key="designation"
        :designation="designation"
        :active="currentDesignation === designation"
        :duration="getDuration(designation)"
      />
      <li>{{ total }}</li>
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

export default {
  name: 'Timer',
  data: () => ({
    aggregate: getAggregate({ designations }),
    currentDesignation: '',
    day: dayjs().format('MMM DD'),
    designations,
    startTime: null,
    timer: null,
    time: null,
    events: []
  }),
  components: {
    Designation
  },
  methods: {
    setStartTime() {
      this.startTime = dayjs().valueOf();
    },
    startTimer() {
      this.setStartTime();
      this.time = dayjs().valueOf();
      this.timer = setInterval(() => {
        this.time = dayjs().valueOf();
      }, 1000);
    },
    getDuration(designation) {
      let currentDuration;
      // this is the currently-running timer
      if (this.currentDesignation === designation) {
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
      clearInterval(this.timer);
      this.setAggregate();
      this.timer = null;
    },
    handleToggleConfig() {
      this.expanded = !this.expanded;
    },
    handleSelectDesignation(selected) {
      const action = (this.currentDesignation === selected) ? 'stop' : 'start';
      // add an event to the 
      const event = {
        id: uuid(),
        time: dayjs().valueOf(),
        designation: selected
      }
      this.events = [...this.events, event];

      // user clicked on the currently-selected designation, presumably to turn off the timer
      let nextDesignation;

      // always stop the timer on a click no matter what. it's always changing state somehow.
      this.stopTimer();

      // turn off the timer and clear designation
      if (action === 'stop') {
        nextDesignation = '';

      // otherwiser start timer on current designation
      } else {
        this.startTimer();
        nextDesignation = selected;
      }
      this.currentDesignation = nextDesignation;
    },
    setAggregate() {
      this.aggregate = getAggregate({ designations: this.designations, events: this.events });
    }
  },
  computed: {
    total() {
      const total = Object.values(this.aggregate)
        .reduce((total, curr) => {
          total += curr;
          return total;
        }, 0);
      return dayjs(total).format('mm:ss');
    },
    toggleText() {
      return `${this.expanded ? 'hide' : 'show'} config`;
    }
  }
};
</script>

<style lang="sass">
  body
    font-family: Helvetica, Tahoma, sans-serif
    font-size: 16px

  ul
    list-style: none
    margin: 0
    padding: 0

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