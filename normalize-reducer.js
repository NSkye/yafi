"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Приводит редьюсер к классическому функциональному виду, если он задан в виде объекта.
 * @param reducer редьюсер
 */
module.exports = function normalizeReducer(reducer) {
    const isClassicReducer = typeof reducer === 'function';
    if (isClassicReducer) {
        return reducer;
    }
    const isAutoReducer = typeof reducer === 'object' &&
        reducer !== null &&
        typeof reducer.state === 'object' &&
        (!reducer.actions || typeof reducer.actions === 'object');
    if (!isClassicReducer && !isAutoReducer) {
        throw Error(`Invalid reducer! Expected classic or automatic reducer`);
    }
    const autoReducer = reducer;
    const normalizedReducer = (state = autoReducer.state, action) => {
        const nextState = Object.assign({}, state);
        if (!action || !autoReducer.actions || typeof autoReducer.actions[action.type] !== 'function') {
            return nextState;
        }
        action.payload ?
            autoReducer.actions[action.type](nextState, action.payload) :
            autoReducer.actions[action.type](nextState);
        return nextState;
    };
    return normalizedReducer;
};
