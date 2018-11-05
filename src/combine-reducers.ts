export {};
const normalizeReducer = require('./normalize-reducer');

interface ObjectWithReducers {
  [reducerName: string]: ClassicReducer | AutoReducer;
}

const invalidArgsError =
  'Can not combine reducers! ' +
  'Expected array of named functions ' +
  'or plain object';

function iterateThroughReducers(
  reducers: ObjectWithReducers | ClassicReducer[],
  cb: (reducer: ClassicReducer, name: string) => void,
): void {
  const isKeyValue = typeof reducers === 'object' && reducers !== null && !Array.isArray(reducers);
  const isArray = Array.isArray(reducers);
  if (!isKeyValue && !isArray) {
    throw Error(invalidArgsError);
  }

  if (isKeyValue) {
    for (const redName in reducers) {
      if (reducers.hasOwnProperty(redName)) {
        const reds: ObjectWithReducers = reducers as ObjectWithReducers;
        cb(normalizeReducer(reds[redName]), redName);
      }
    }
  }

  if (isArray) {
    const reds: ClassicReducer[] = reducers as ClassicReducer[];
    reds.map((red) => {
      if (!red.name) {
        throw Error(invalidArgsError);
      }
      cb(red, red.name);
    });
  }
}

module.exports = function combineReducers(reducers: ObjectWithReducers | ClassicReducer[]): ClassicReducer {
  const allReducers: Array<{ name: string, reducer: ClassicReducer }> = [];

  iterateThroughReducers(reducers, (reducer: ClassicReducer, name: string) => {
    allReducers.push({ name, reducer });
  });

  return (state: YafiState = {}, action?: Action): YafiState => {
    const newState: YafiState = {...state};

    allReducers.map(r => {
      newState[r.name] = r.reducer(state[r.name] as YafiState | undefined, action);
    });

    return newState;
  };
};
