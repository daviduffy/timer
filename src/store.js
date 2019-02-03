// External Dependencies
import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';

// Internal Dependencies
import { uuid } from '@/utils';
import { Event, TimerEvent, getAggregate } from '@/services/eventStream';
import designations from '@/fixtures/designations';
import { getEvents, setEvents } from '@/services/localStorage';
import * as types from '@/constants/constants';

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
    setAggregate(state, payload) {
      state.aggregate = payload;
    }
  },
  actions: {
    startSelectDesignation(context, nextDesignation = '') {
      // determine if this is start, switch, or stop
      const { designation: prevDesignation } = context.state;
      let type;
      let designation = nextDesignation;
      if (prevDesignation === '') {
        type = types.START_TIMER;
      } else if (nextDesignation === prevDesignation) {
        type = types.STOP_TIMER;
        designation = '';
      } else {
        type = types.SWITCH_TIMER;
      }
      const event = new Event({ type, payload: designation });
      context.commit('addEvent', event);
      context.commit('setDesignation', designation);
      context.dispatch('startSaveEvents');
      const { id, type: TYPE, payload, createdAt } = event;
      console.log({ id, type: TYPE, payload, createdAt });
    },
    startSaveEvents({ state }) {
      const databaseName = 'designationTimer';
      const today = dayjs().startOf('day').valueOf();
      const prevState = getEvents();
      const nextState = {
        ...prevState,
        [today]: state.events
      };
      window.localStorage[databaseName] = JSON.stringify(nextState);
    },
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
    },
    startReconstituteAggregate(context) {
      const { designations } = context.state;
      const events = getEvents();
      const aggregate = getAggregate({ events, designations });
      context.commit('setAggregate', aggregate);
    }
  }
});
