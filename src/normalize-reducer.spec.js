const normalizeReducer = require('./normalize-reducer');

it('in case of classic reducer just returns it', () => {
  function testClassicReducer (state = { test: '123' }, action) {
    return {...state};
  }
  const normalized = normalizeReducer(testClassicReducer);
  expect(normalized).toBe(testClassicReducer);
});

it('normalizes automatic reducer', () => {
  const testAutomaticReducer = {
    state: { count: 0 },
    actions: {
      increment(state) {
        let newState = {...state};
        newState.count = state.count + 1;
        return newState;
      }
    }
  }
  const normalized = normalizeReducer(testAutomaticReducer);
  expect(normalized).toBeInstanceOf(Function);
  expect(normalized({ count: 0}, { type: 'increment' })).toEqual({ count: 1 });
});

it('does not accept invalid automatic reducer', () => {
  expect(() => normalizeReducer({})).toThrowError('Invalid reducer! Expected classic or automatic reducer');
  expect(() => normalizeReducer({ actions: {} })).toThrowError('Invalid reducer! Expected classic or automatic reducer');
  expect(() => normalizeReducer({ state: { test: '123' }})).not.toThrowError();
})
