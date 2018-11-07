declare namespace yafi {
  interface YafiState {
    [property: string]: any
  }
  
  interface YafiAction {
    type: string,
    payload?: { [item: string]: any }
  }
  
  type ClassicReducer = (state: YafiState, action: YafiAction) => YafiState
  interface AutoReducer {
    state: YafiState,
    actions?: {
      [type: string]: (state: YafiState, payload?: { [item: string]: any }) => void
    }
  }
  
  interface YafiStore {
    readonly state: YafiState,
    dispatch: (action: YafiAction) => void,
    do: (action: YafiAction) => void,
    subscribe: (callback: (state: YafiState) => void) => void,
    unsubscribe: (callback: (state: YafiState) => void) => void,
  }
  
  interface Yafi {
    Store: {
      new (...reducers: ClassicReducer[] | [AutoReducer]): YafiStore
    },
    combineReducers: (...reducers: [{ [reducerName: string]: ClassicReducer | AutoReducer }] | ClassicReducer[]) => ClassicReducer,
    normalizeReducer: (reducer: ClassicReducer | AutoReducer) => ClassicReducer
  }
}

declare module 'yafi' {
  const y: yafi.Yafi;
  export default y;
}
