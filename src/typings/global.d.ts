interface YafiState {
  [property: string]: unknown
}

interface Action {
  type: string,
  payload?: unknown
}

interface AutoReducer {
  state: YafiState,
  actions: {
    [action: string]: (state: YafiState, action: Action | undefined) => YafiState
  }
}

type ClassicReducer = (state: YafiState | undefined, action: Action | undefined) => YafiState
