"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combineReducers = require('./combine-reducers');
const normalizeReducer = require('./normalize-reducer');
/**
 * Класс хранилища
 */
module.exports = class Store {
    /**
     * Принимает на вход один или несколько редьюсеров.
     * В случае с несколькими редьюсерами,
     * на вход могут подаваться только редьюсеры классического вида,
     * представляющие собой неанонимные функции, на их основании будет разделен стейт.
     * @param reducers редьюсеры
     */
    constructor(...reducers) {
        this.subscribtions = [];
        this.actionInProgress = false;
        const autoCombine = reducers.length > 1;
        if (reducers.length === 0) {
            throw Error('Store requires at least one reducer.');
        }
        const reducer = !autoCombine ?
            normalizeReducer(reducers[0]) :
            combineReducers([...reducers]);
        const initialState = reducer(undefined, undefined);
        if (initialState === undefined) {
            throw Error('No initial state provided! Reducer should return either new state or initial state.');
        }
        this.state = initialState;
        this.reducer = reducer;
    }
    /**
     * Передает экшен в редьюсер и выполняет его.
     * Затем вызывает все коллбэки подписок.
     * Во время выполнения нельзя добавлять/удалять подписки.
     * Во время выполнения нельзя вызывать другие экшены.
     * (иначе это бы означало, что экшен вызывается из редьюсера, что очень плохо)
     * @param action экшен
     */
    dispatch(action) {
        if (this.actionInProgress) {
            throw Error('Can not dispatch other actions when action in progress!');
        }
        this.actionInProgress = true;
        const state = this.reducer(this.state, action);
        if (typeof state !== 'object' || state === null) {
            const errorMSG = `Reducer should return state object. Got [${state}] (${typeof state}) instead.`;
            throw Error(errorMSG);
        }
        this.state = state;
        this.actionInProgress = false;
        this.subscribtions.map(subscribtion => {
            subscribtion(state);
        });
    }
    /**
     * Алиас для dispatch
     * @param action экшен
     */
    do(action) {
        return this.dispatch(action);
    }
    /**
     * Производит подписку на все обновления стейта
     * @param callback функция, вызываемая после обновления стейта
     */
    subscribe(callback) {
        if (this.actionInProgress) {
            throw Error('Can not subscribe during action!');
        }
        this.subscribtions.push(callback);
    }
    /**
     * Производит отписку от всех обновлений стейта
     * @param callback функция, использованная при подписке
     */
    unsubscribe(callback) {
        if (this.actionInProgress) {
            throw Error('Can not unsubscribe during action!');
        }
        this.subscribtions = this.subscribtions.filter(s => s !== callback);
    }
};
