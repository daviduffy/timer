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
    day: dayjs().format('MMM DD'),
    designation: '',
    designations,
    history: getEvents(),
    startTime: null,
    timer: null,
    time: null,
    events: []
  },
  mutations: {
    addEvent(state, event) {
      state.events = [...state.events, event];
    },
    setEvents(state, payload) {
      console.log(payload);
      state.events = payload;
    },
    setStartTime(state, ms) {
      state.startTime = dayjs(ms).valueOf();
    },
    setDesignation(state, designation) {
      state.designation = designation;
    },
    setHistory(state, payload) {
      state.history = payload;
    },
    startTimer(state) {
      state.time = dayjs().valueOf();
      state.timer = setInterval(() => {
        state.time = dayjs().valueOf();
      }, 1000);
    },
    stopTimer(state) {
      clearInterval(state.timer);
      state.timer = null;
      state.startTime = null;
      state.time = null;
    },
    handleToggleConfig() {
      this.expanded = !this.expanded;
    },
    setAggregate(state) {
      state.aggregate = getAggregate({ designations: state.designations, events: state.events });
    }
  },
  actions: {
    startRetrieveEvents(context) {
      const storedEvents = getEvents();
      // history exists
      if (Object.keys(storedEvents).length > 0) {
        context.commit('setHistory', storedEvents);

        const today = dayjs().startOf('day').valueOf();
        const todayStream = storedEvents[today];

        // an event stream from today already exists
        if (todayStream) {
          context.commit('setEvents', todayStream);
          context.commit('setAggregate');

          const [secondToLast, last] = todayStream.slice(todayStream.length - 2);
          const stopped = secondToLast.designation === last.designation;

          // a timer from today is currently running
          if (!stopped) {
            context.commit('setStartTime', last.time);
            context.commit('startTimer');
            context.commit('setDesignation', last.designation);
          }
        }
      }
    }
  }
});
