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
  let autoReducer: AutoReducer = reducer as AutoReducer;

  const normalizedReducer: ClassicReducer = function (state: YafiState = autoReducer.state, action?: Action): YafiState {
    let nextState: YafiState = {...state};
    if (!action || !autoReducer.actions || typeof autoReducer.actions[action.type] !== 'function') {
      return nextState;
    }

    nextState = action.payload ? 
      autoReducer.actions[action.type](nextState, action.payload) :
      autoReducer.actions[action.type](nextState);
    
    return nextState;
  }

  return normalizedReducer;
}
