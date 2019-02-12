const databaseName = 'designationTimer';

export const getDB = () => new Promise((res, rej) => {
  const prevJSON = window.localStorage[databaseName];
  let storedState;
  try {
    storedState = JSON.parse(prevJSON);
  } catch (err) {
    console.log(Error(err));
    storedState = {};
  }
  res(storedState);
});

export const setDB = updates => new Promise((res, rej) => {
  return getDB()
    .then((prevState) => {
      const nextState = {
        ...prevState,
        ...updates
      };
      window.localStorage[databaseName] = JSON.stringify(nextState);
      res(nextState);
    });
});
