const combineReducers = require('./combine-reducers');

describe('basic state combination', () => {
  const testState1 = {
    t: 'I am test state one',
  }
  
  const testState2 = {
    i: 'I am test state two'
  }
  
  const testState3 = {
    s: 'I am test state three'
  }
  
  it('combines classic reducers', () => {
    function reducer1 (state = testState1) { return {...state} }
    function reducer2 (state = testState2) { return {...state} }
  
    const combined = combineReducers([reducer1, reducer2]);
    expect(combined()).toEqual({
      reducer1: {
        t: 'I am test state one',
      },
      reducer2: {
        i: 'I am test state two'
      }
    });
  });
  
  it('combines all reducers', () => {
    const reducer1 = {
      state: testState1
    };
    const reducer2 = (state = testState2) => ({ ...state });
    function reducer3 (state = testState3) { return {...state} }
  
    const combined = combineReducers({
      r1: reducer1,
      r2: reducer2,
      r3: reducer3
    });
  
    expect(combined()).toEqual({
      r1: {
        t: 'I am test state one',
      },
      r2: {
        i: 'I am test state two'
      },
      r3: {
        s: 'I am test state three'
      }
    });
  });
});

describe('providing actions to all reducers', () => {
  const c1 = { counter: 1 };
  const c2 = { counter: 2 };
  const c3 = { counter: 3 };

  const r1 = {
    state: c1,
    actions: {
      increment(state) {
        const newState = {...state}
        newState.counter += 1;
        return newState;
      }
    }
  }
  const r2 = {
    state: c2,
    actions: {
      decrement(state) {
        const newState = {...state}
        newState.counter -= 1;
        return newState;
      }
    }
  }
  const r3 = {
    state: c3,
    actions: {
      increment(state) {
        const newState = {...state}
        newState.counter += 1;
        return newState;
      },
      decrement(state) {
        const newState = {...state}
        newState.counter -= 1;
        return newState;
      }
    }
  }

  it('runs provides actions to all combined reducers', () => {
    const combined = combineReducers({ r1, r2, r3 });
    expect(combined(undefined, { type: 'increment' })).toEqual({
      r1: { counter: 2 },
      r2: { counter: 2 },
      r3: { counter: 4 }
    });
    expect(combined(undefined, { type: 'decrement' })).toEqual({
      r1: { counter: 1 },
      r2: { counter: 1 },
      r3: { counter: 2 }
    })
  });
});