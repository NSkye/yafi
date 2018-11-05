export {}
const combineReducers = require('./combine-reducers');
const normalizeReducer = require('./normalize-reducer');

type subscribtionCB = (state?: YafiState) => void;

module.exports = class Store {
  private state: YafiState;
  private reducer: ClassicReducer;
  private subscribtions: subscribtionCB[] = [];
  private actionInProgress: boolean = false;

  constructor(...reducers: ClassicReducer[] | AutoReducer[]) {
    const autoCombine: boolean = reducers.length > 1;
    if (reducers.length === 0) {
      throw Error('Store requires at least one reducer.')
    }
    const reducer: ClassicReducer = !autoCombine ? 
      normalizeReducer(reducers[0]) :
      combineReducers([...reducers])
    
    const initialState: YafiState = reducer(undefined, undefined);
    if (initialState === undefined) {
      throw Error('No initial state provided! Reducer should return either new state or initial state.')
    }
    this.state = initialState;
    this.reducer = reducer;
  }

  public dispatch(action: Action): void {
    if (this.actionInProgress) {
      throw Error('Can not dispatch other actions when action in progress!')
    }
    this.actionInProgress = true;
    const state: YafiState = this.reducer(this.state, action);
    this.state = state;
    this.actionInProgress = false;
    this.subscribtions.map(subscribtion => {
      subscribtion(state);
    });
  }

  public do(action: Action): void {
    return this.dispatch(action);
  }

  public subscribe(callback: subscribtionCB): void {
    if (this.actionInProgress) {
      throw Error('Can not subscribe during action!');
    }
    this.subscribtions.push(callback);
  }

  public unsubscribe(callback: subscribtionCB): void {
    if (this.actionInProgress) {
      throw Error('Can not unsubscribe during action!');
    }
    this.subscribtions = this.subscribtions.filter(s => s !== callback);
  }
};
