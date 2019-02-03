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
  constructor({ type, payload }) {
    this.type = type;
    this.id = uuid();
    this.createdAt = dayjs().valueOf();
    if (payload !== undefined) {
      this.payload = payload;
    }
  }
}

const getAggregate = ({ designations = [], events = [] }) => {
  const aggregateBase = { total: null };
  const aggregate = designations.reduce((obj, curr) => {
    obj[curr] = 0;
    return obj;
  }, { ...aggregateBase });
  let prevEvent = false;
  events.forEach((event) => {
    // if there is a no previous event, skip everything
    if (prevEvent) {
      const { payload: prevDesignation, createdAt: startTime } = prevEvent;
      const { payload: currDesignation, createdAt: endTime } = event;
      const duration = endTime - startTime;
      aggregate[prevDesignation] += duration;
      // if designations are the same, this is a 'stop' not a 'switch'
      if (prevDesignation === currDesignation) {
        prevEvent = false;
        return;
      }
    }
    prevEvent = { ...event };
  });
  console.log(aggregate);
  return aggregate;
};

// console.log(getAggregate({ designations: defaultDesignations, events: startStop }));
// console.log(getAggregate({ designations: defaultDesignations, events: startChangeStop }));

export { Duration, getAggregate };
