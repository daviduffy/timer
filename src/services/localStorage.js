// External Dependencies
import dayjs from 'dayjs';

const databaseName = 'designationTimer';

export const getEvents = () => {
  const prevJSON = window.localStorage[databaseName];
  let storedState;
  try {
    storedState = JSON.parse(prevJSON);
  } catch (err) {
    console.warn(err);
    storedState = {};
  }
  return storedState;
};

export const setEvents = (stream) => {
  const today = dayjs().startOf('day').valueOf();
  const prevState = getEvents();
  const nextState = {
    ...prevState,
    [today]: stream
  };
  window.localStorage[databaseName] = JSON.stringify(nextState);
};