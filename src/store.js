// External Dependencies
import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';

// Internal Dependencies
import { Event, getAggregate } from '@/services/eventStream';
import designations from '@/fixtures/designations';
import { getEvents } from '@/services/localStorage';
import * as types from '@/constants/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aggregate: getAggregate({ designations }),
    designation: '',
    designations,
    events: [],
    history: getEvents(),
    startTime: null,
    timer: null,
    time: null,
    today: dayjs().startOf('day').valueOf()
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
    startSelectDesignation(context, payload) {
      let { designation, type } = payload;
      const { designation: prevDesignation } = context.state;

      if (prevDesignation === '') {
        type = types.START_TIMER;
      } else if (prevDesignation === designation) {
        type = types.STOP_TIMER;
        designation = '';
      } else {
        type = types.SWITCH_TIMER;
      }

      const event = new Event({ type, ...payload });
      context.commit('addEvent', event);
      context.commit('stopTimer');
      context.commit('setStartTime', dayjs().valueOf());
      context.commit('setDesignation', designation);

      if (type !== types.STOP_TIMER) {
        context.commit('startTimer');
      }
      context.dispatch('startSaveEvents')
        .then(() => {
          context.dispatch('startReconstituteAggregate');
        });
    },
    startSetDuration(context, payload) {
      const { designation, hours, minutes, seconds } = payload;
      const oneHour = 3600000;
      const oneMinute = 60000;
      const oneSecond = 1000;
      const newTotal = (hours * oneHour) + (minutes * oneMinute) + (seconds * oneSecond);
      const event = new Event({ type: types.SET_TIMER, designation, newTotal });
      context.commit('addEvent', event);
      context.dispatch('startSaveEvents')
        .then(() => {
          context.dispatch('startReconstituteAggregate');
        });
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
      return Promise.resolve('just need to chain something');
    },
    startRetrieveEvents(context) {
      console.log('startRetrieveEvents');
      const storedEvents = getEvents();
      // history exists
      if (Object.keys(storedEvents).length > 0) {
        context.commit('setHistory', storedEvents);

        const today = dayjs().startOf('day').valueOf();
        const todayStream = storedEvents[today];

        // an event stream from today already exists
        if (todayStream.length > 0) {
          context.commit('setEvents', todayStream);

          const last = todayStream[todayStream.length - 1];
          const stopped = last.type === types.STOP_TIMER;

          // a timer from today is currently running
          if (!stopped) {
            context.commit('setStartTime', last.createdAt);
            context.commit('startTimer');
            context.commit('setDesignation', last.designation);
          }
        }
      }
    },
    startReconstituteAggregate(context) {
      console.log('startReconstituteAggregate');
      const { designations, today } = context.state;
      const events = getEvents();
      const aggregate = getAggregate({ events, designations, today });
      context.commit('setAggregate', aggregate);
    }
  }
});
