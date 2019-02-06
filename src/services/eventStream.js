// External Dependencies
import dayjs from 'dayjs';

// Internal Dependencies
import * as types from '@/constants/constants';
import { startStop, startChangeStop } from '@/fixtures/events';
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
      // debugger;
      // only operate if there is a previous event
      // debugger;
      if (prevEvent) {
        const { designation: prevDesigation, createdAt: startTime } = prevEvent;
        const { designation: currDesigation, type: currType, createdAt: endTime } = event;

        console.log('outside');
        if (currType === types.SET_TIMER) {
          // if this is a reset
          const { newTotal } = event;
          aggregate[currDesigation] = newTotal;
        } else {
          const duration = endTime - startTime;
          aggregate[prevDesigation] += duration;
          console.log('here', prevDesigation, duration, currType);
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

// console.log(getAggregate({ designations: defaultDesignations, events: startStop }));
// console.log(getAggregate({ designations: defaultDesignations, events: startChangeStop }));

export { Duration, getAggregate };
