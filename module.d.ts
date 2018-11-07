interface Action {
  type: string,
  payload?: { [name: string]: any }
}

interface State {
  [property: string]: any
}

interface StoreInstance {
  state: State,
  dispatch: (action: Action) => void,
  do: (action: Action) => void,
  subscribe: (callback: (state?: State) => void) => void,
  unsubscribe: (callback: (state?: State) => void) => void
}

interface AutoReducer {
  state: State,
  actions: {
    [name: string]: (state, payload?: { [name: string ]: any }) => void
  }
}

type ClassicReducer = (state: State, action?: Action) => State

export namespace yafi {
  export interface Store {
    new (reducer: AutoReducer): StoreInstance
    new (...reducer: ClassicReducer[]): StoreInstance
  }
}

