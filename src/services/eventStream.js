import { startStop, startChangeStop } from '@/fixtures/events';
import defaultDesignations from '@/fixtures/designations';

export const getAggregate = ({ designations = [], events = [] }) => {
  const aggregateBase = { total: null };
  const aggregate = designations.reduce((obj, curr) => {
    obj[curr] = 0;
    return obj;
  }, { ...aggregateBase });
  let prevEvent = false;
  events.forEach((event) => {
    // if there is a no previous event, skip everything
    if (prevEvent) {
      const { designation: prevDesignation, time: startTime } = prevEvent;
      const { designation: currDesignation, time: endTime } = event;
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
  return aggregate;
};

// console.log(getAggregate({ designations: defaultDesignations, events: startStop }));
// console.log(getAggregate({ designations: defaultDesignations, events: startChangeStop }));

export const bub = '';
