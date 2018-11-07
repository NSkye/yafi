"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeReducer = require('./normalize-reducer');
const invalidArgsError = 'Can not combine reducers! ' +
    'Expected array of named functions ' +
    'or plain object';
/**
 * Вспомогательная функция для итерации через набор редьюсеров
 * @param reducers редьюсеры, представленные либо в формате массива, либо в формате ключ-значение
 * @param cb коллбэк вызываемый на каждом редьюсере
 */
function iterateThroughReducers(reducers, cb) {
    const isKeyValue = typeof reducers === 'object' && reducers !== null && !Array.isArray(reducers);
    const isArray = Array.isArray(reducers);
    if (!isKeyValue && !isArray) {
        throw Error(invalidArgsError);
    }
    if (isKeyValue) {
        for (const redName in reducers) {
            if (reducers.hasOwnProperty(redName)) {
                const reds = reducers;
                cb(normalizeReducer(reds[redName]), redName);
            }
        }
    }
    if (isArray) {
        const reds = reducers;
        reds.map((red) => {
            if (!red.name) {
                throw Error(invalidArgsError);
            }
            cb(red, red.name);
        });
    }
}
/**
 * Комбинирует редьюсеры.
 * Может комбинировать одновременно как функциональные редьюсеры, так и редьюсеры, заданные в виде обычного объекта.
 * Задавать набор редьюсеров виде массива можно только если комбинируем функциональные редьюсеры,
 * представленные в виде именованных функций.
 * @param reducers редьюсеры
 */
module.exports = function combineReducers(reducers) {
    const allReducers = [];
    iterateThroughReducers(reducers, (reducer, name) => {
        allReducers.push({ name, reducer });
    });
    return (state = {}, action) => {
        const newState = Object.assign({}, state);
        allReducers.map(r => {
            newState[r.name] = r.reducer(state[r.name], action);
            if (typeof newState[r.name] !== 'object' || newState[r.name] === null) {
                const errorMSG = 'Reducer should return state object. ' +
                    `Got [${newState[r.name]}] (${typeof newState[r.name]}) instead in reducer '${r.name}'.`;
                throw Error(errorMSG);
            }
        });
        return newState;
    };
};
