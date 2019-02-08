// External Dependencies
import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';

// Internal Dependencies
import { Event, getAggregate, getProjection, apply } from '@/services/eventStream';
import designations from '@/fixtures/designations';
import { getEvents } from '@/services/localStorage';
import * as types from '@/constants/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aggregate: getAggregate({ designations }),
    designation: '',
    designations,
    duration: null,
    events: [],
    history: getEvents(),
    startTime: null,
    timer: null,
    today: dayjs().startOf('day').valueOf()
  },
  mutations: {
    recordEvent(state, event) {
      state.events = [...state.events, event];
    },
    setEvents(state, payload) {
      state.events = payload;
    },
    setDesignation(state, designation) {
      state.designation = designation;
    },
    setHistory(state, payload) {
      state.history = payload;
    },
    startTimer(state, startTime = false) {
      const now = dayjs().valueOf();
      state.startTime = startTime || now;
      state.duration = now - state.startTime;
      state.timer = setInterval(() => {
        state.time = dayjs().valueOf();
        state.duration = dayjs().valueOf() - state.startTime;
      }, 1000);
    },
    stopTimer(state) {
      clearInterval(state.timer);
      state.timer = null;
      state.startTime = null;
      state.duration = null;
    },
    handleToggleConfig() {
      this.expanded = !this.expanded;
    },
    setAggregate(state, payload) {
      state.aggregate = payload;
    }
  },
  actions: {
    startApplyEvent(context, event) {
      const applyFunc = apply[event.type];
      const { aggregate: prevProjection } = context.state;
      const nextProjection = applyFunc(prevProjection, event);
      context.commit('setAggregate', nextProjection);
    },
    startStartTimer(context, protoEvent) { // type, designation
      const event = new Event({ ...protoEvent });
      return context.dispatch('startRecordEvent', event)
        .then(() => {
          context.commit('startTimer');
          context.commit('setDesignation', protoEvent.designation);
          return context.dispatch('startApplyEvent', event);
        });
    },
    startSwitchTimer(context, protoEvent) {
      const { designation: prevDesignation } = context.state;
      const protoEventStop = {
        type: types.STOP_TIMER,
        designation: prevDesignation,
        duration: protoEvent.duration
      };
      const protoEventStart = {
        type: types.START_TIMER,
        designation: protoEvent.designation
      };
      context.dispatch('startStopTimer', protoEventStop)
        .then(() => context.dispatch('startStartTimer', protoEventStart));
    },
    startStopTimer(context, protoEvent) {
      const { startTime } = context.state;
      const duration = dayjs().valueOf() - startTime;
      const event = new Event({ ...protoEvent, duration });
      return context.dispatch('startRecordEvent', event)
        .then(() => {
          context.commit('stopTimer', event);
          context.commit('setDesignation', ''); // clear current designation
          return context.dispatch('startApplyEvent', event);
        });
    },
    startRecordEvent(context, event) {
      context.commit('recordEvent', event);
      const databaseName = 'designationTimer';
      const today = dayjs().startOf('day').valueOf();
      const prevState = getEvents();
      const nextState = {
        ...prevState,
        [today]: context.state.events
      };
      window.localStorage[databaseName] = JSON.stringify(nextState);
      return Promise.resolve('just need to chain something');
    },
    // user is manually over-riding the projected duration for a given designation
    startSetDuration(context, payload) {
      const { designation, hours, minutes, seconds } = payload;
      const oneHour = 3600000;
      const oneMinute = 60000;
      const oneSecond = 1000;
      const duration = (hours * oneHour) + (minutes * oneMinute) + (seconds * oneSecond);
      const event = new Event({ type: types.SET_TIMER, designation, duration });
      return context.dispatch('startRecordEvent', event)
        .then(() => context.dispatch('startApplyEvent', event));
    },
    startRetrieveEvents(context) {
      const storedEvents = getEvents();
      // history exists
      if (Object.keys(storedEvents).length > 0) {
        context.commit('setHistory', storedEvents);

        const today = dayjs().startOf('day').valueOf();
        const todayStream = storedEvents[today];

        // an event stream from today already exists
        if (todayStream && todayStream.length > 0) {
          context.commit('setEvents', todayStream);

          const last = todayStream[todayStream.length - 1];
          const running = last.type !== types.STOP_TIMER;

          // a timer from today is currently running
          if (running) {
            context.commit('startTimer', last.createdAt);
            context.commit('setDesignation', last.designation);
          }
        }
      }
    },
    startReconstituteAggregate(context) {
      const { today } = context.state;
      const events = getEvents();
      const aggregate = getProjection({ events, designations, today });
      context.commit('setAggregate', aggregate);
    }
  }
});
