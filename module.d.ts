export interface Action {
  type: string,
  payload?: { [name: string]: any }
}

export interface State {
  [property: string]: any
}

export interface StoreInstance {
  state: State,
  dispatch: (action: Action) => void,
  do: (action: Action) => void,
  subscribe: (callback: (state?: State) => void) => void,
  unsubscribe: (callback: (state?: State) => void) => void
}

export interface AutoReducer {
  state: State,
  actions: {
    [name: string]: (state, payload?: { [name: string ]: any }) => void
  }
}

export type ClassicReducer = (state: State, action?: Action) => State

export interface yafi {
  Store: {
    new (reducer: AutoReducer): StoreInstance
    new (...reducer: ClassicReducer[]): StoreInstance
  },
  combineReducers: (...reducers: ClassicReducer[]) => ClassicReducer,
  combineReducers: (reducers: { [name: string]: ClassicReducer | AutoReducer }) => ClassicReducer,
  normalizeReducer: (reducer: ClassicReducer | AutoReducer) => ClassicReducer
}

declare module './index.js' {
  export default yafi
}

