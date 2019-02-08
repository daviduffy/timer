// External Dependencies
import dayjs from 'dayjs';

// Internal Dependencies
import * as types from '@/constants/constants';
import { startStop } from '@/fixtures/events';
import defaultDesignations from '@/fixtures/designations';
import { uuid } from '@/services/utils';

function Duration(value) {
  this.value = value;
  this.format = () => {
    const formatString = this.value > 3600000 ? 'hh:mm:ss' : 'mm:ss';
    this.format = () => dayjs(this.value).format(formatString);
  };
}

export class Event {
  constructor({ type, ...rest }) {
    this.type = type;
    this.id = uuid();
    this.createdAt = dayjs().valueOf();
    // pass anything in
    Object.keys(rest || {}).forEach((key) => {
      this[key] = rest[key];
    });
  }
}

const addDuration = (projection, { designation, duration }) => ({
  ...projection,
  [designation]: (projection[designation] || 0) + duration
});

const setDuration = (projection, { designation, duration }) => ({
  ...projection,
  [designation]: duration
});

const apply = {
  [types.START_TIMER]: projection => projection,
  [types.SWITCH_TIMER]: addDuration,
  [types.STOP_TIMER]: addDuration,
  [types.SET_TIMER]: setDuration
};

const getAggregate = ({ designations = [], events = {}, today = false }) => {
  const aggregateBase = { total: null };
  const aggregate = designations.reduce((obj, curr) => {
    obj[curr] = 0;
    return obj;
  }, { ...aggregateBase });
  // find out if there are existing events for the current day
  const todayStream = today ? events[today] : false;
  if (todayStream) {
    let prevEvent = null;
    todayStream.forEach((event) => {
      if (prevEvent) {
        const { designation: prevDesigation, createdAt: startTime } = prevEvent;
        const { designation: currDesigation, type: currType, createdAt: endTime } = event;

        // console.log('outside');
        if (currType === types.SET_TIMER) {
          // if this is a reset
          const { newTotal } = event;
          aggregate[currDesigation] = newTotal;
        } else {
          const duration = endTime - startTime;
          aggregate[prevDesigation] += duration;
          // console.log('here', prevDesigation, duration, currType);
          // specifically set prev event to null if this is a stop
          if (currType === types.STOP_TIMER) {
            prevEvent = null;
            return;
          }
        }
      }
      prevEvent = { ...event };
    });
  }
  return aggregate;
};

const getProjection = ({ designations = [], events = {}, today = false }) => {
  const projectionBase = designations.reduce((obj, curr) => {
    obj[curr] = 0;
    return obj;
  }, { today: null });
  // find out if there are existing events for the current day
  const todayStream = today ? events[today] : false;
  if (todayStream) {
    return todayStream.reduce((obj, event) => {
      const applyFunc = apply[event.type];
      return ({
        ...projectionBase,
        ...applyFunc(obj, event)
      });
    }, {});
  }
  return projectionBase;
};

console.log(getProjection({ designations: defaultDesignations, events: startStop, today: 1549180800000 }));

export { Duration, apply, getAggregate, getProjection };
