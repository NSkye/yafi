const Store = require('./Store');

describe('basic functionality', () => {
  const testReducer = (state = ({ counter: 0 }), action) => {
    const newState = {...state};
    if (!action || !action.type) {
      return newState;
    }
  
    if (action.type === 'increment') {
      newState.counter = state.counter + 1;
    }
  
    return newState;
  }
  
  let testStore = null;
  beforeEach(() => {
    testStore = new Store(testReducer);
  });
  
  it('provides store', ()=>{
    expect(testStore.state).toEqual({ counter: 0 });
  })
  
  it('updates store', ()=> {
    testStore.dispatch({ type: 'increment' });
    expect(testStore.state).toEqual({ counter: 1 });
    testStore.do({ type: 'increment' });
    expect(testStore.state).toEqual({ counter: 2 });
  })
  
  test('can subscribe to state updates', () => {
    const subscrCB = jest.fn();
    testStore.subscribe(subscrCB);
    testStore.do({ type: 'increment' });
    testStore.do({ type: 'another_action' });
    expect(subscrCB).toHaveBeenCalledTimes(2);
  })
  
  it('can unsubscribe from state updates', () => {
    const subscrCB = jest.fn();
    testStore.subscribe(subscrCB);
    testStore.unsubscribe(subscrCB);
    testStore.do({ type: 'increment' });
    testStore.do({ type: 'another_action' });
    expect(subscrCB).toHaveBeenCalledTimes(0);
  })
});

describe('multiple reducer functionality', () => {
  it('implicitly combines reducers', () => {
    function r1(state = { c: 1 }) { return {...state} }
    function r2(state = { c: 2 }) { return {...state} }
    function r3(state = { c: 3 }) { return {...state} }

    const store = new Store(r1, r2, r3);
    expect(store.state).toEqual({
      r1: { c: 1 },
      r2: { c: 2 },
      r3: { c: 3 },
    })
  });
})