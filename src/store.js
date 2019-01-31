// External Dependencies
import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';

// Internal Dependencies
import { uuid } from '@/utils';
import { getAggregate } from '@/services/eventStream';
import designations from '@/fixtures/designations';
import { getEvents, setEvents } from '@/services/localStorage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aggregate: getAggregate({ designations }),
    currentDesignation: '',
    day: dayjs().format('MMM DD'),
    designations,
    startTime: null,
    timer: null,
    time: null,
    events: []
  },
  mutations: {
    setStartTime(state) {
      state.startTime = dayjs().valueOf();
    },
    startTimer(state) {
      this.$store.commit('setStartTime');
      state.time = dayjs().valueOf();
      state.timer = setInterval(() => {
        state.time = dayjs().valueOf();
      }, 1000);
    },
    getDuration(state, designation) {
      let currentDuration;
      // this is the currently-running timer
      if (state.currentDesignation === designation) {
        // this will display weird shit after 24 hours
        const prevDuration = state.aggregate[designation] || 0;
        currentDuration = (state.time - state.startTime) + prevDuration;

      // this is just diplaying the time from the aggregate
      } else {
        currentDuration = state.aggregate[designation];
      }
      const humanDuration = dayjs(currentDuration).format('mm:ss');
      return humanDuration;
    },
    stopTimer(state) {
      clearInterval(state.timer);
      this.setAggregate();
      state.timer = null;
    },
    handleToggleConfig() {
      this.expanded = !this.expanded;
    },
    handleSelectDesignation(selected) {
      const action = (this.currentDesignation === selected) ? 'stop' : 'start';
      // add an event to the stream
      const event = {
        id: uuid(),
        time: dayjs().valueOf(),
        designation: selected
      };
      const nextEvents = [...this.events, event];
      this.events = nextEvents;

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
      setEvents(nextEvents);
      this.currentDesignation = nextDesignation;
    },
    setAggregate() {
      this.aggregate = getAggregate({ designations: this.designations, events: this.events });
    }
  },
  actions: {

  },
});
