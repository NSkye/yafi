type subscribtionCB = (state?: YafiState) => void;

module.exports = class Store {
  private state: YafiState;
  private reducer: ClassicReducer;
  private subscribtions: subscribtionCB[] = [];

  constructor(reducer: ClassicReducer) {
    const state: YafiState = reducer(undefined, undefined);
    if (state === undefined) {
      throw Error('No initial state provided!');
    }

    this.state = state;
    this.reducer = reducer;
  }

  public dispatch(action: Action): void {
    const state: YafiState = this.reducer(this.state, action);
    this.state = state;
    this.subscribtions.map(subscribtion => {
      subscribtion(state);
    });
  }

  public subscribe(callback: subscribtionCB): void {
    this.subscribtions.push(callback);
  }
};
