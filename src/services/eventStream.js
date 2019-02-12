// External Dependencies
import dayjs from 'dayjs';

// Internal Dependencies
import * as types from '@/constants/constants';
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

const getTotalsProjection = ({ designations = [], streams = {}, today = false }) => {
  const projectionBase = designations.reduce((obj, curr) => {
    obj[curr] = 0;
    return obj;
  }, { today: null });
  // find out if there are existing events for the current day
  const todayStream = today ? streams[today] : false;
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

const getDesignationsProjection = (designations = []) => {
  const allDesignations = [
    ...defaultDesignations,
    ...designations.map(({ designation }) => designation)
  ];
  return Array.from(new Set(allDesignations));
};

export { Duration, apply, getTotalsProjection, getDesignationsProjection };
