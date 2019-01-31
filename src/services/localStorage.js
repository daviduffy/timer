// External Dependencies
import dayjs from 'dayjs';

export const getEvents = () => {

};

export const setEvents = (stream) => {
  const databaseName = 'designationTimer';
  const today = dayjs().startOf('day').valueOf();
  const prevJSON = window.localStorage[databaseName];
  let prevState;
  try {
    prevState = JSON.parse(prevJSON);
  } catch (err) {
    console.warn(err);
    prevState = {};
  }
  const nextState = {
    ...prevState,
    [today]: stream
  };
  window.localStorage[databaseName] = JSON.stringify(nextState);
};