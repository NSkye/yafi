export {};

/**
 * Приводит редьюсер к классическому функциональному виду, если он задан в виде объекта.
 * @param reducer редьюсер
 */
module.exports = function normalizeReducer(reducer: ClassicReducer | AutoReducer): ClassicReducer {
  const isClassicReducer: boolean = typeof reducer === 'function';
  if (isClassicReducer) {
    return reducer as ClassicReducer;
  }
  const isAutoReducer: boolean =
    typeof reducer === 'object' &&
    reducer !== null &&
    typeof reducer.state === 'object' &&
    (!reducer.actions || typeof  reducer.actions === 'object');

  if (!isClassicReducer && !isAutoReducer) {
    throw Error(`Invalid reducer! Expected classic or automatic reducer`);
  }
  const autoReducer: AutoReducer = reducer as AutoReducer;

  const normalizedReducer: ClassicReducer = (state: YafiState = autoReducer.state, action?: Action): YafiState => {
    const nextState: YafiState = {...state};
    if (!action || !autoReducer.actions || typeof autoReducer.actions[action.type] !== 'function') {
      return nextState;
    }

    action.payload ?
      autoReducer.actions[action.type](nextState, action.payload) :
      autoReducer.actions[action.type](nextState);

    return nextState;
  };

  return normalizedReducer;
};
