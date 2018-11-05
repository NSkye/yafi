type subscribtionCB = (state?: YafiState) => void;

module.exports = class Store {
  private state: YafiState;
  private reducer: ClassicReducer;
  private subscribtions: subscribtionCB[] = [];
  private actionInProgress: boolean = false;

  constructor(reducer: ClassicReducer) {
    const state: YafiState = reducer(undefined, undefined);
    if (state === undefined) {
      throw Error('No initial state provided!');
    }
    this.state = state;
    this.reducer = reducer;
  }

  public dispatch(action: Action): void {
    this.actionInProgress = true;
    const state: YafiState = this.reducer(this.state, action);
    this.state = state;
    this.subscribtions.map(subscribtion => {
      subscribtion(state);
    });
    this.actionInProgress = false;
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
